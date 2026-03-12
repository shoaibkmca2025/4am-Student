const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'COMPANY' | 'ADMIN';
}

interface AuthResult {
  user: User;
  tokens: TokenPair;
}

interface Assessment {
  id: string;
  title: string;
  category: string;
  duration: number;
  difficulty: string;
  _count: { questions: number };
}

interface AssessmentWithQuestions {
  id: string;
  title: string;
  category: string;
  duration: number;
  difficulty: string;
  questions: { id: string; question: string; options: string[]; order: number }[];
}

interface AssessmentResult {
  id: string;
  score: number;
  correct?: number;
  total?: number;
  xpEarned: number;
  timeTaken: number;
  completedAt: string;
}

interface InterviewSession {
  id: string;
  status: string;
  transcript: TranscriptEntry[];
  overallScore?: number;
  feedback?: Record<string, unknown>;
  startedAt: string;
  completedAt?: string;
}

interface TranscriptEntry {
  role: 'interviewer' | 'candidate';
  text: string;
  score?: number;
  feedback?: string;
  improvements?: string[];
  timestamp: string;
}

interface AnswerEvaluation {
  score: number;
  feedback: string;
  improvements: string[];
  nextQuestion: string | null;
}

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location?: string;
  type?: string;
  salary?: string;
  status: string;
  createdAt: string;
  company?: { companyName: string; logoUrl?: string };
}

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  private saveTokens(tokens: TokenPair) {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  private clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  private async tryRefresh(): Promise<boolean> {
    if (!this.refreshToken) return false;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
      if (!res.ok) {
        this.clearTokens();
        return false;
      }
      const data: ApiResponse<TokenPair> = await res.json();
      if (data.success && data.data) {
        this.saveTokens(data.data);
        return true;
      }
      this.clearTokens();
      return false;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
    retry = true
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

    if (res.status === 401 && retry) {
      // Deduplicate concurrent refresh calls
      if (!this.refreshPromise) {
        this.refreshPromise = this.tryRefresh().finally(() => {
          this.refreshPromise = null;
        });
      }
      const refreshed = await this.refreshPromise;
      if (refreshed) {
        return this.request<T>(path, options, false);
      }
      // Redirect to login if refresh fails
      window.location.href = '/login';
      return { success: false, message: 'Session expired', data: null };
    }

    const data: ApiResponse<T> = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  }

  // ─── Auth ────────────────────────────────────────────────────────────────────

  async register(payload: { name: string; email: string; password: string; role: 'STUDENT' | 'COMPANY' }) {
    const res = await this.request<AuthResult>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.data) {
      this.saveTokens(res.data.tokens);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  }

  async login(payload: { email: string; password: string }) {
    const res = await this.request<AuthResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.data) {
      this.saveTokens(res.data.tokens);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
    } finally {
      this.clearTokens();
    }
  }

  getCurrentUser(): User | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // ─── Assessments ─────────────────────────────────────────────────────────────

  async getAssessments() {
    const res = await this.request<Assessment[]>('/assessments');
    return res.data ?? [];
  }

  async startAssessment(id: string) {
    const res = await this.request<AssessmentWithQuestions>(`/assessments/${id}/start`);
    return res.data;
  }

  async submitAssessment(id: string, answers: Record<string, number>, timeTaken: number) {
    const res = await this.request<AssessmentResult>(`/assessments/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers, timeTaken }),
    });
    return res.data;
  }

  async getAssessmentResults() {
    const res = await this.request<AssessmentResult[]>('/assessments/results');
    return res.data ?? [];
  }

  // ─── Interviews ───────────────────────────────────────────────────────────────

  async startInterview() {
    const res = await this.request<{ session: InterviewSession; firstQuestion: string }>(
      '/interviews/start',
      { method: 'POST' }
    );
    return res.data;
  }

  async submitInterviewAnswer(sessionId: string, answer: string) {
    const res = await this.request<{ evaluation: AnswerEvaluation; transcript: TranscriptEntry[] }>(
      `/interviews/${sessionId}/answer`,
      { method: 'POST', body: JSON.stringify({ answer }) }
    );
    return res.data;
  }

  async endInterview(sessionId: string) {
    const res = await this.request<InterviewSession>(`/interviews/${sessionId}/end`, {
      method: 'POST',
    });
    return res.data;
  }

  async getInterviewSession(sessionId: string) {
    const res = await this.request<InterviewSession>(`/interviews/${sessionId}`);
    return res.data;
  }

  // ─── Jobs ─────────────────────────────────────────────────────────────────────

  async getJobs(filters?: { search?: string; type?: string; location?: string }) {
    const params = new URLSearchParams(filters as Record<string, string>).toString();
    const res = await this.request<Job[]>(`/jobs${params ? `?${params}` : ''}`);
    return res.data ?? [];
  }

  async getJob(id: string) {
    const res = await this.request<Job>(`/jobs/${id}`);
    return res.data;
  }

  async createJob(payload: {
    title: string;
    description: string;
    requirements: string[];
    location?: string;
    type?: string;
    salary?: string;
    expiresAt?: string;
  }) {
    const res = await this.request<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  }

  async applyToJob(id: string, coverNote?: string) {
    const res = await this.request(`/jobs/${id}/apply`, {
      method: 'POST',
      body: JSON.stringify({ coverNote }),
    });
    return res.data;
  }

  async getJobApplications(jobId: string) {
    const res = await this.request(`/jobs/${jobId}/applications`);
    return res.data;
  }

  async updateApplicationStatus(jobId: string, applicationId: string, status: string) {
    const res = await this.request(`/jobs/${jobId}/applications/${applicationId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return res.data;
  }

  // ─── Student Profile ──────────────────────────────────────────────────────────

  async getStudentProfile() {
    const res = await this.request('/students/profile');
    return res.data;
  }

  async updateStudentProfile(data: {
    phone?: string;
    college?: string;
    degree?: string;
    skills?: string[];
    resumeUrl?: string;
    linkedIn?: string;
    github?: string;
  }) {
    const res = await this.request('/students/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  }

  async getStudentApplications() {
    const res = await this.request('/students/applications');
    return res.data;
  }

  // ─── Company Profile ──────────────────────────────────────────────────────────

  async getCompanyProfile() {
    const res = await this.request('/companies/profile');
    return res.data;
  }

  async updateCompanyProfile(data: {
    companyName?: string;
    industry?: string;
    website?: string;
    description?: string;
    location?: string;
    size?: string;
  }) {
    const res = await this.request('/companies/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  }

  async getCompanyJobs() {
    const res = await this.request('/companies/jobs');
    return res.data;
  }
}

export const api = new ApiClient();
export type {
  User,
  AuthResult,
  Assessment,
  AssessmentWithQuestions,
  AssessmentResult,
  InterviewSession,
  TranscriptEntry,
  AnswerEvaluation,
  Job,
  TokenPair,
};
