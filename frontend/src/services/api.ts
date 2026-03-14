
import axios, { AxiosHeaders } from 'axios';

// ── Types ──────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'student' | 'company' | 'admin';
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  skills?: string[];
  savedJobs?: string[];
  preferences: {
    emailNotifications: boolean;
    darkMode: boolean;
    language?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface Job {
  _id: string;
  companyId: string;
  title: string;
  companyName: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salaryRange: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  _id: string;
  jobId: string | Job;
  studentId: string;
  status: 'Submitted' | 'Reviewed' | 'Interview' | 'Rejected' | 'Offered';
  coverLetter: string;
  resumeSnapshot: Record<string, unknown>;
  createdAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Assessment {
  id: number;
  _id?: string;
  title: string;
  category: string;
  duration: string;
  questionsCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  color?: string;
  questions?: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: number;
  type: 'multiple-choice' | 'code-challenge' | 'text-input';
  question: string;
  options?: string[];
  correct?: number;
  correctAnswer?: string;
  codeSnippet?: string;
  explanation?: string;
}

export interface TopStudent {
  userId: string;
  name: string;
  email: string;
  averageScore: number;
  bestScore: number;
  completedAssessments: number;
}

export interface UserAssessment {
  _id: string;
  userId: string;
  assessmentId: number;
  title: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  score: string;
  timestamp: string;
}

export interface InterviewSession {
  _id: string;
  userId: string;
  status: 'active' | 'paused' | 'completed';
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  transcript: string[];
  finalScore?: number;
  summaryFeedback?: string;
  createdAt: string;
}

export interface InterviewQuestion {
  id: string;
  text: string;
  expectedKeyPoints: string[];
}

export interface InterviewFeedback {
  score: number;
  criteria?: {
    clarity: number;
    relevance: number;
    completeness: number;
  };
  feedback: string;
  improvements: string[];
}

export interface InterviewHistoryItem {
  id: string;
  date: string;
  score: number;
  feedback: string;
  answersCount: number;
}

export interface DashboardStats {
  totalAssessments: number;
  completedAssessments: number;
  averageScore: number;
  totalApplications: number;
  applicationsByStatus: Record<string, number>;
  totalInterviews: number;
  completedInterviews: number;
  profileCompletion: number;
}

export interface CompanyStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalApplicants: number;
  applicationsByStatus: Record<string, number>;
  totalStudents: number;
  recentApplications: Application[];
  jobs: Array<{
    jobId: string;
    title: string;
    isActive: boolean;
    totalApplicants: number;
    appliedStudents: string[];
    statusBreakdown: Record<string, number>;
  }>;
}

export interface AchievementBadge {
  id: string;
  title: string;
  icon: string;
  color: string;
  desc: string;
  unlocked: boolean;
}

export interface AchievementsData {
  level: number;
  xp: number;
  maxXp: number;
  badges: AchievementBadge[];
}

export interface CareerRoadmapStep {
  id: number;
  title: string;
  skills: string[];
  relatedAssessmentIds: number[];
  description: string;
  status: 'Completed' | 'In Progress' | 'Locked';
  progress: number;
}

// ── API Client ──────────────────────────────────────────────────────

const normalizeApiBase = (value?: string) => {
  const raw = (value || '').trim();
  if (!raw) return '';

  const withoutTrailingSlash = raw.endsWith('/') ? raw.slice(0, -1) : raw;
  return withoutTrailingSlash.endsWith('/api') ? withoutTrailingSlash : `${withoutTrailingSlash}/api`;
};

const inferFallbackBaseUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:5000/api';

  const { protocol, hostname } = window.location;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

  if (isLocal) {
    return `${protocol}//${hostname}:5000/api`;
  }

  // Production fallback for deployments where VITE_API_BASE_URL is not set.
  return 'https://fouram-student-backend.onrender.com/api';
};

const resolvedBaseURL =
  normalizeApiBase((import.meta as any).env?.VITE_API_BASE_URL) ||
  normalizeApiBase((import.meta as any).env?.VITE_API_URL) ||
  inferFallbackBaseUrl();

const FALLBACK_API_BASES = Array.from(
  new Set([
    inferFallbackBaseUrl(),
    'https://fouram-student-backend.onrender.com/api'
  ].filter(Boolean))
);

const api = axios.create({
  baseURL: resolvedBaseURL,
  timeout: 15000,
});

// Retry with exponential backoff for network errors & 5xx
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    config.__retryCount = config.__retryCount || 0;
    config.__usedApiFailover = config.__usedApiFailover || false;

    const isRetryable =
      !error.response ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ERR_NETWORK' ||
      (error.response?.status >= 500 && error.response?.status < 600);

    if (isRetryable && !config.__usedApiFailover) {
      const currentBase = normalizeApiBase(config.baseURL || resolvedBaseURL);
      const failoverBase = FALLBACK_API_BASES.find((base) => normalizeApiBase(base) !== currentBase);
      if (failoverBase) {
        config.__usedApiFailover = true;
        config.baseURL = failoverBase;
        return api(config);
      }
    }

    if (isRetryable && config.__retryCount < MAX_RETRIES) {
      config.__retryCount += 1;
      const delay = RETRY_DELAY_BASE * Math.pow(2, config.__retryCount - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return api(config);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
    }

    return Promise.reject(error);
  }
);

// ── Services ──────────────────────────────────────────────────────

export const assessmentService = {
  getAll: async (): Promise<Assessment[]> => {
    const response = await api.get('/assessments');
    return response.data;
  },
  getById: async (id: number): Promise<Assessment> => {
    const response = await api.get(`/assessments/${id}`);
    return response.data;
  },
  create: async (payload: Partial<Assessment>): Promise<Assessment> => {
    const response = await api.post('/assessments', payload);
    return response.data;
  },
  remove: async (id: number): Promise<{ ok: boolean; message: string }> => {
    const response = await api.delete(`/assessments/${id}`);
    return response.data;
  },
  getTopStudents: async (limit = 5): Promise<TopStudent[]> => {
    const response = await api.get('/assessments/top-students', { params: { limit } });
    return response.data.students || [];
  }
};

export const authService = {
  register: async (payload: { name: string; email: string; password: string; role: 'student' | 'company' | 'admin' }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', payload);
    return response.data;
  },
  login: async (payload: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', payload);
    return response.data;
  },
  me: async (): Promise<{ user: UserProfile }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  }
};

export const userService = {
  me: async (): Promise<{ user: UserProfile }> => {
    const response = await api.get('/users/me');
    return response.data;
  },
  updateMe: async (payload: Partial<Pick<UserProfile, 'name' | 'email' | 'bio' | 'phone' | 'location' | 'website' | 'skills'>>): Promise<{ user: UserProfile }> => {
    const response = await api.put('/users/me', payload);
    return response.data;
  },
  updatePreferences: async (payload: Partial<UserProfile['preferences']>): Promise<{ user: UserProfile }> => {
    const response = await api.put('/users/me/preferences', payload);
    return response.data;
  },
  changePassword: async (payload: { currentPassword: string; newPassword: string }): Promise<{ ok: boolean; message: string }> => {
    const response = await api.put('/users/me/password', payload);
    return response.data;
  },
  deleteMe: async (): Promise<{ ok: boolean }> => {
    const response = await api.delete('/users/me');
    return response.data;
  },
  saveJob: async (jobId: string): Promise<{ user: UserProfile }> => {
    const response = await api.post('/users/me/saved-jobs', { jobId });
    return response.data;
  },
  unsaveJob: async (jobId: string): Promise<{ user: UserProfile }> => {
    const response = await api.delete(`/users/me/saved-jobs/${jobId}`);
    return response.data;
  }
};

export const resumeService = {
  getMe: async (): Promise<{ resume: Record<string, any> | null }> => {
    const response = await api.get('/resume/me');
    return response.data;
  },
  saveMe: async (data: Record<string, any>): Promise<{ resume: Record<string, any> }> => {
    const response = await api.put('/resume/me', { data });
    return response.data;
  }
};

export const userAssessmentService = {
  getMe: async (): Promise<{ assessments: UserAssessment[] }> => {
    const response = await api.get('/user-assessments/me');
    return response.data;
  },
  upsertMe: async (assessmentId: number, payload: { status?: string; score?: string | number; timestamp?: string; timeTaken?: string }): Promise<{ assessment: UserAssessment }> => {
    const response = await api.put(`/user-assessments/me/${assessmentId}`, payload);
    return response.data;
  }
};

export const contactService = {
  send: async (payload: { name: string; email: string; interest: string; message: string }): Promise<{ ok: boolean; message: string }> => {
    const response = await api.post('/contact', payload);
    return response.data;
  }
};

export const jobService = {
  list: async (params?: { page?: number; limit?: number; search?: string; type?: string; location?: string }): Promise<{ jobs: Job[]; pagination: Pagination }> => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },
  getById: async (id: string): Promise<{ job: Job }> => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },
  mine: async (params?: { page?: number; limit?: number }): Promise<{ jobs: Job[]; pagination: Pagination }> => {
    const response = await api.get('/jobs/me/mine', { params });
    return response.data;
  },
  create: async (payload: Partial<Job>): Promise<{ job: Job }> => {
    const response = await api.post('/jobs', payload);
    return response.data;
  },
  update: async (id: string, payload: Partial<Job>): Promise<{ job: Job }> => {
    const response = await api.put(`/jobs/${id}`, payload);
    return response.data;
  },
  remove: async (id: string): Promise<{ ok: boolean }> => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },
  apply: async (jobId: string, payload: { coverLetter?: string }): Promise<{ application: Application }> => {
    const response = await api.post(`/jobs/${jobId}/apply`, payload);
    return response.data;
  },
  applications: async (jobId: string, params?: { page?: number; limit?: number }): Promise<{ applications: Application[]; pagination: Pagination }> => {
    const response = await api.get(`/jobs/${jobId}/applications`, { params });
    return response.data;
  }
};

export const applicationService = {
  mine: async (params?: { page?: number; limit?: number }): Promise<{ applications: Application[]; pagination: Pagination }> => {
    const response = await api.get('/applications/me', { params });
    return response.data;
  },
  companyRecent: async (params?: { page?: number; limit?: number }): Promise<{ applications: Application[]; pagination: Pagination }> => {
    const response = await api.get('/applications/company/recent', { params });
    return response.data;
  },
  updateStatus: async (id: string, status: Application['status']): Promise<{ application: Application }> => {
    const response = await api.patch(`/applications/${id}/status`, { status });
    return response.data;
  },
  withdraw: async (id: string): Promise<{ ok: boolean }> => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  }
};

export const interviewService = {
  getSessions: async (): Promise<{ sessions: InterviewSession[] }> => {
    const response = await api.get('/interviews/sessions');
    return response.data;
  },
  getHistory: async (): Promise<{ interviews: InterviewHistoryItem[] }> => {
    const response = await api.get('/interviews/history');
    return response.data;
  },
  createSession: async (): Promise<{ session: InterviewSession }> => {
    const response = await api.post('/interviews/sessions');
    return response.data;
  },
  submitAnswer: async (sessionId: string, transcript: string): Promise<{ feedback: InterviewFeedback }> => {
    const response = await api.post(`/interviews/sessions/${sessionId}/answer`, { transcript });
    return response.data;
  },
  nextQuestion: async (sessionId: string): Promise<{ question: InterviewQuestion | null; session: InterviewSession }> => {
    const response = await api.post(`/interviews/sessions/${sessionId}/next`);
    return response.data;
  },
  endSession: async (sessionId: string): Promise<{ ok: boolean; session: InterviewSession }> => {
    const response = await api.post(`/interviews/sessions/${sessionId}/end`);
    return response.data;
  }
};

export const notificationService = {
  getAll: async (params?: { page?: number; limit?: number }): Promise<{ notifications: Notification[]; unreadCount: number; pagination: Pagination }> => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },
  markRead: async (id: string): Promise<{ notification: Notification }> => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
  markAllRead: async (): Promise<{ ok: boolean }> => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },
  remove: async (id: string): Promise<{ ok: boolean }> => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
  clearAll: async (): Promise<{ ok: boolean }> => {
    const response = await api.delete('/notifications');
    return response.data;
  }
};

export const statsService = {
  student: async (): Promise<{ stats: DashboardStats }> => {
    const response = await api.get('/stats/student');
    return response.data;
  },
  company: async (): Promise<{ stats: CompanyStats }> => {
    const response = await api.get('/stats/company');
    return response.data;
  }
};

export const achievementService = {
  get: async (): Promise<AchievementsData> => {
    const response = await api.get('/achievements');
    return response.data;
  }
};

export const careerService = {
  getRoadmap: async (): Promise<{ roadmap: CareerRoadmapStep[] }> => {
    const response = await api.get('/career');
    return response.data;
  }
};

export default api;
