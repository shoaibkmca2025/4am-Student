
import { v4 as uuidv4 } from 'uuid';

export interface Question {
  id: string;
  text: string;
  expectedKeyPoints: string[];
}

export interface Feedback {
  score: number;
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

// Mock Data
const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: "Tell me about yourself and why you're interested in this role.",
    expectedKeyPoints: ['Background', 'Experience', 'Motivation']
  },
  {
    id: 'q2',
    text: "Describe a challenging technical problem you solved recently.",
    expectedKeyPoints: ['Problem', 'Action', 'Result', 'technologies used']
  },
  {
    id: 'q3',
    text: "How do you handle disagreements with team members?",
    expectedKeyPoints: ['Communication', 'Empathy', 'Resolution']
  }
];

class InterviewService {
  private session: SessionState | null = null;

  async startSession(): Promise<SessionState> {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    this.session = {
      id: uuidv4(),
      status: 'active',
      currentQuestionIndex: 0,
      questions: MOCK_QUESTIONS,
      transcript: [],
      startTime: Date.now()
    };
    
    return { ...this.session };
  }

  async submitAnswer(audioBlob: Blob): Promise<Feedback> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis
    return {
      score: 85,
      feedback: "Good use of the STAR method. You clearly articulated the situation.",
      improvements: ["Try to quantify your results more.", "Speak a bit more slowly."]
    };
  }

  async getNextQuestion(): Promise<Question | null> {
    if (!this.session) throw new Error("No active session");
    
    const nextIndex = this.session.currentQuestionIndex + 1;
    if (nextIndex >= this.session.questions.length) {
      this.session.status = 'completed';
      return null;
    }
    
    this.session.currentQuestionIndex = nextIndex;
    return this.session.questions[nextIndex];
  }

  async endSession(): Promise<void> {
    if (this.session) {
      this.session.status = 'completed';
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

export const interviewService = new InterviewService();
