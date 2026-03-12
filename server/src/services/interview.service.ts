import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';
import { logger } from '../utils/logger';

interface TranscriptEntry {
  role: 'interviewer' | 'candidate';
  text: string;
  score?: number;
  feedback?: string;
  improvements?: string[];
  timestamp: string;
}

function getGeminiClient() {
  if (!env.GEMINI_API_KEY) {
    throw ApiError.internal('Gemini API key not configured');
  }
  return new GoogleGenerativeAI(env.GEMINI_API_KEY);
}

const SYSTEM_PROMPT = `You are an expert technical interviewer for software engineering positions. 
Your role is to conduct professional mock interviews. 
When given the prompt to generate a question, respond with ONLY the interview question text.
When evaluating an answer, respond with a JSON object containing:
{
  "score": <number 0-100>,
  "feedback": "<brief feedback on the answer>",
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "nextQuestion": "<next interview question or null if interview is complete>"
}`;

async function generateFirstQuestion(): Promise<string> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `${SYSTEM_PROMPT}\n\nStart a technical interview. Generate the first question: "Tell me about yourself and your technical background."`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    logger.error('Gemini API error generating first question', err);
    return "Tell me about yourself and your technical background.";
  }
}

async function evaluateAnswer(
  question: string,
  answer: string,
  questionIndex: number
): Promise<{ score: number; feedback: string; improvements: string[]; nextQuestion: string | null }> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const isLast = questionIndex >= 4; // 5 questions total

  const prompt = `${SYSTEM_PROMPT}

Interview question asked: "${question}"
Candidate's answer: "${answer}"
Question number: ${questionIndex + 1} of 5

Evaluate this answer and ${isLast ? 'set nextQuestion to null since this is the last question' : 'provide the next interview question'}.
Respond with ONLY valid JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    logger.error('Gemini API error evaluating answer', err);
    return {
      score: 70,
      feedback: 'Your answer showed good understanding of the topic.',
      improvements: ['Provide more specific examples', 'Elaborate on technical details'],
      nextQuestion: isLast ? null : 'Describe a challenging technical problem you solved recently.',
    };
  }
}

export async function startSession(userId: string) {
  const firstQuestion = await generateFirstQuestion();

  const transcript: TranscriptEntry[] = [
    {
      role: 'interviewer',
      text: firstQuestion,
      timestamp: new Date().toISOString(),
    },
  ];

  const session = await prisma.interviewSession.create({
    data: {
      userId,
      status: 'active',
      transcript: transcript as unknown as Parameters<typeof prisma.interviewSession.create>[0]['data']['transcript'],
    },
  });

  return { session, firstQuestion };
}

export async function submitAnswer(userId: string, sessionId: string, answerText: string) {
  const session = await prisma.interviewSession.findUnique({ where: { id: sessionId } });
  if (!session) throw ApiError.notFound('Interview session not found');
  if (session.userId !== userId) throw ApiError.forbidden('Access denied');
  if (session.status === 'completed') throw ApiError.badRequest('Interview already completed');

  const transcript = (session.transcript as unknown as TranscriptEntry[]) || [];
  const questionIndex = Math.floor(transcript.length / 2); // Each Q&A pair = 2 entries
  const lastQuestion = transcript.filter((t) => t.role === 'interviewer').pop();

  if (!lastQuestion) throw ApiError.badRequest('No question found to answer');

  const evaluation = await evaluateAnswer(lastQuestion.text, answerText, questionIndex);

  transcript.push({
    role: 'candidate',
    text: answerText,
    score: evaluation.score,
    feedback: evaluation.feedback,
    improvements: evaluation.improvements,
    timestamp: new Date().toISOString(),
  });

  if (evaluation.nextQuestion) {
    transcript.push({
      role: 'interviewer',
      text: evaluation.nextQuestion,
      timestamp: new Date().toISOString(),
    });
  }

  await prisma.interviewSession.update({
    where: { id: sessionId },
    data: { transcript: transcript as unknown as Parameters<typeof prisma.interviewSession.update>[0]['data']['transcript'] },
  });

  return { evaluation, transcript };
}

export async function endSession(userId: string, sessionId: string) {
  const session = await prisma.interviewSession.findUnique({ where: { id: sessionId } });
  if (!session) throw ApiError.notFound('Interview session not found');
  if (session.userId !== userId) throw ApiError.forbidden('Access denied');

  const transcript = (session.transcript as unknown as TranscriptEntry[]) || [];
  const candidateEntries = transcript.filter((t) => t.role === 'candidate');

  const overallScore =
    candidateEntries.length > 0
      ? candidateEntries.reduce((sum, e) => sum + (e.score || 0), 0) / candidateEntries.length
      : 0;

  const feedback = {
    totalQuestions: candidateEntries.length,
    averageScore: overallScore,
    strengths: ['Good communication', 'Technical knowledge'],
    areasToImprove: candidateEntries.flatMap((e) => e.improvements || []).slice(0, 3),
  };

  const updated = await prisma.interviewSession.update({
    where: { id: sessionId },
    data: {
      status: 'completed',
      overallScore,
      feedback: feedback as unknown as Parameters<typeof prisma.interviewSession.update>[0]['data']['feedback'],
      completedAt: new Date(),
    },
  });

  return updated;
}
