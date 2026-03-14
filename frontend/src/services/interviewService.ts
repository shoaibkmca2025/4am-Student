
import { interviewService as interviewApi, InterviewHistoryItem } from './api';

export interface Question {
  id: string;
  text: string;
  expectedKeyPoints: string[];
}

export interface Feedback {
  score: number;
  criteria?: {
    clarity: number;
    relevance: number;
    completeness: number;
  };
  feedback: string;
  improvements: string[];
}

export interface SessionState {
  id: string;
  status: 'idle' | 'connecting' | 'active' | 'paused' | 'completed';
  currentQuestionIndex: number;
  questions: Question[];
  transcript: string[];
  startTime: number;
}

class InterviewService {
  private session: SessionState | null = null;

  async getHistory(): Promise<InterviewHistoryItem[]> {
    const response = await interviewApi.getHistory();
    return response.interviews || [];
  }

  async startSession(): Promise<SessionState> {
    try {
      const response = await interviewApi.createSession();
      const backendSession = response.session;
      
      this.session = {
        id: backendSession._id,
        status: backendSession.status,
        currentQuestionIndex: backendSession.currentQuestionIndex || 0,
        questions: backendSession.questions || [],
        transcript: backendSession.transcript || [],
        startTime: new Date(backendSession.createdAt).getTime()
      };
      
      return { ...this.session };
    } catch (error) {
      console.error("Failed to start interview session", error);
      throw error;
    }
  }

  async submitAnswer(answerText: string): Promise<Feedback> {
    if (!this.session) throw new Error("No active session");

    const transcriptText = answerText.trim();
    if (!transcriptText) {
      throw new Error('Answer cannot be empty.');
    }

    try {
      const response = await interviewApi.submitAnswer(this.session.id, transcriptText);
      
      if (this.session.transcript) {
          this.session.transcript.push(transcriptText);
      } else {
          this.session.transcript = [transcriptText];
      }
      
      return response.feedback;
    } catch (error) {
      console.error("Failed to submit answer", error);
      throw error;
    }
  }

  async getNextQuestion(): Promise<Question | null> {
    if (!this.session) throw new Error("No active session");
    
    try {
      const response = await interviewApi.nextQuestion(this.session.id);
      
      if (response.session) {
          this.session.status = response.session.status;
          this.session.currentQuestionIndex = response.session.currentQuestionIndex;
      }
      
      if (!response.question) {
        this.session.status = 'completed';
        return null;
      }
      
      return response.question;
    } catch (error) {
      console.error("Failed to get next question", error);
      throw error;
    }
  }

  async endSession(): Promise<void> {
    if (this.session) {
      try {
        await interviewApi.endSession(this.session.id);
        this.session.status = 'completed';
      } catch (error) {
        console.error("Failed to end session", error);
      }
    }
  }
}

export const interviewServiceWrapper = new InterviewService();
