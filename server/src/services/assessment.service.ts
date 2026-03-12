import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';

const XP_PER_CORRECT = 10;

export interface SubmitAnswersInput {
  answers: Record<string, number>; // { questionId: selectedIndex }
  timeTaken: number;
}

export async function getAssessments() {
  return prisma.assessment.findMany({
    where: { isActive: true },
    select: {
      id: true,
      title: true,
      category: true,
      duration: true,
      difficulty: true,
      _count: { select: { questions: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getAssessmentById(id: string) {
  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          options: true,
          // correctIndex is intentionally excluded — never sent to client
          order: true,
        },
        orderBy: { order: 'asc' },
      },
    },
  });
  if (!assessment || !assessment.isActive) throw ApiError.notFound('Assessment not found');
  return assessment;
}

export async function submitAssessment(
  userId: string,
  assessmentId: string,
  input: SubmitAnswersInput
) {
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: {
      questions: { select: { id: true, correctIndex: true }, orderBy: { order: 'asc' } },
    },
  });
  if (!assessment) throw ApiError.notFound('Assessment not found');

  const total = assessment.questions.length;
  if (total === 0) throw ApiError.internal('Assessment has no questions');

  let correct = 0;
  for (const q of assessment.questions) {
    const selected = input.answers[q.id];
    if (selected !== undefined && selected === q.correctIndex) {
      correct++;
    }
  }

  const score = (correct / total) * 100;
  const xpEarned = correct * XP_PER_CORRECT;

  const result = await prisma.assessmentResult.create({
    data: {
      userId,
      assessmentId,
      score,
      answers: input.answers,
      timeTaken: input.timeTaken,
      xpEarned,
    },
  });

  // Award XP to student profile
  await prisma.studentProfile.updateMany({
    where: { userId },
    data: { xp: { increment: xpEarned } },
  });

  return { result, score, correct, total, xpEarned };
}

export async function getUserResults(userId: string) {
  return prisma.assessmentResult.findMany({
    where: { userId },
    include: { assessment: { select: { title: true, category: true } } },
    orderBy: { completedAt: 'desc' },
  });
}
