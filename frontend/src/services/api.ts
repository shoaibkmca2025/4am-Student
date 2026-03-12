
import axios, { AxiosHeaders } from 'axios';

const normalizeApiBase = (value?: string) => {
  const raw = (value || '').trim();
  if (!raw) return '';

  const withoutTrailingSlash = raw.endsWith('/') ? raw.slice(0, -1) : raw;
  return withoutTrailingSlash.endsWith('/api') ? withoutTrailingSlash : `${withoutTrailingSlash}/api`;
};

const resolvedBaseURL =
  normalizeApiBase((import.meta as any).env?.VITE_API_BASE_URL) ||
  normalizeApiBase((import.meta as any).env?.VITE_API_URL) ||
  (typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:5000/api`
    : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: resolvedBaseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

// Response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error but don't crash app, let components handle fallback
    console.warn('API Call Failed:', error.message);
    return Promise.reject(error);
  }
);

export const assessmentService = {
  getAll: async () => {
    const response = await api.get('/assessments');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/assessments/${id}`);
    return response.data;
  }
};

export const authService = {
  register: async (payload: { name: string; email: string; password: string; role: 'student' | 'company' }) => {
    try {
      const response = await api.post('/auth/register', payload);
      return response.data as { token: string; user: any };
    } catch (error) {
      if (axios.isAxiosError(error) && !error.response) {
        const token = localStorage.getItem('authToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const fallbackUrls = ['http://127.0.0.1:5000/api', 'http://localhost:5000/api'].filter((url) => url !== resolvedBaseURL);
        for (const baseURL of fallbackUrls) {
          try {
            const response = await axios.post(`${baseURL}/auth/register`, payload, { timeout: 15000, headers });
            return response.data as { token: string; user: any };
          } catch (fallbackError) {
            if (axios.isAxiosError(fallbackError) && fallbackError.response) throw fallbackError;
          }
        }
      }
      throw error;
    }
  },
  login: async (payload: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', payload);
      return response.data as { token: string; user: any };
    } catch (error) {
      if (axios.isAxiosError(error) && !error.response) {
        const token = localStorage.getItem('authToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const fallbackUrls = ['http://127.0.0.1:5000/api', 'http://localhost:5000/api'].filter((url) => url !== resolvedBaseURL);
        for (const baseURL of fallbackUrls) {
          try {
            const response = await axios.post(`${baseURL}/auth/login`, payload, { timeout: 15000, headers });
            return response.data as { token: string; user: any };
          } catch (fallbackError) {
            if (axios.isAxiosError(fallbackError) && fallbackError.response) throw fallbackError;
          }
        }
      }
      throw error;
    }
  },
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data as { user: any };
  }
};

export const userService = {
  me: async () => {
    const response = await api.get('/users/me');
    return response.data as { user: any };
  },
  updateMe: async (payload: { name?: string; email?: string }) => {
    const response = await api.put('/users/me', payload);
    return response.data as { user: any };
  },
  updatePreferences: async (payload: { emailNotifications?: boolean; darkMode?: boolean }) => {
    const response = await api.put('/users/me/preferences', payload);
    return response.data as { user: any };
  },
  changePassword: async (payload: { currentPassword: string; newPassword: string }) => {
    const response = await api.put('/users/me/password', payload);
    return response.data as { ok: boolean };
  },
  deleteMe: async () => {
    const response = await api.delete('/users/me');
    return response.data as { ok: boolean };
  },
  saveJob: async (jobId: string) => {
    const response = await api.post('/users/me/saved-jobs', { jobId });
    return response.data as { user: any };
  },
  unsaveJob: async (jobId: string) => {
    const response = await api.delete(`/users/me/saved-jobs/${jobId}`);
    return response.data as { user: any };
  }
};

export const resumeService = {
  getMe: async () => {
    const response = await api.get('/resume/me');
    return response.data as { resume: any };
  },
  saveMe: async (data: any) => {
    const response = await api.put('/resume/me', { data });
    return response.data as { resume: any };
  }
};

export const userAssessmentService = {
  getMe: async () => {
    const response = await api.get('/user-assessments/me');
    return response.data as { assessments: any[] };
  },
  upsertMe: async (assessmentId: number, payload: { status?: string; score?: string | number; timestamp?: string }) => {
    const response = await api.put(`/user-assessments/me/${assessmentId}`, payload);
    return response.data as { assessment: any };
  }
};

export const contactService = {
  send: async (payload: { name: string; email: string; interest: string; message: string }) => {
    const response = await api.post('/contact', payload);
    return response.data as { ok: boolean };
  }
};

export const jobService = {
  list: async () => {
    const response = await api.get('/jobs');
    return response.data as { jobs: any[] };
  },
  getById: async (id: string) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data as { job: any };
  },
  mine: async () => {
    const response = await api.get('/jobs/me/mine');
    return response.data as { jobs: any[] };
  },
  create: async (payload: any) => {
    const response = await api.post('/jobs', payload);
    return response.data as { job: any };
  },
  apply: async (jobId: string, payload: { coverLetter?: string }) => {
    const response = await api.post(`/jobs/${jobId}/apply`, payload);
    return response.data as { application: any };
  },
  applications: async (jobId: string) => {
    const response = await api.get(`/jobs/${jobId}/applications`);
    return response.data as { applications: any[] };
  }
};

export const applicationService = {
  mine: async () => {
    const response = await api.get('/applications/me');
    return response.data as { applications: any[] };
  },
  companyRecent: async () => {
    const response = await api.get('/applications/company/recent');
    return response.data as { applications: any[] };
  }
};

export const interviewApi = {
  getSessions: async () => {
    const response = await api.get('/interviews/sessions');
    return response.data as { sessions: any[] };
  },
  startSession: async () => {
    const response = await api.post('/interviews/sessions');
    return response.data as { session: any };
  },
  submitAnswer: async (sessionId: string, transcript: string) => {
    const response = await api.post(`/interviews/sessions/${sessionId}/answer`, { transcript });
    return response.data as { feedback: any };
  },
  getNextQuestion: async (sessionId: string) => {
    const response = await api.post(`/interviews/sessions/${sessionId}/next`);
    return response.data as { question: any; session: any };
  },
  endSession: async (sessionId: string) => {
    const response = await api.post(`/interviews/sessions/${sessionId}/end`);
    return response.data as { ok: boolean; session: any };
  }
};

export const careerService = {
  getRoadmap: async () => {
    const response = await api.get('/career');
    return response.data as { roadmap: any[] };
  }
};

export const achievementService = {
  getStats: async () => {
    const response = await api.get('/achievements');
    return response.data as { level: number; xp: number; maxXp: number; badges: any[] };
  }
};

export const notificationService = {
  getAll: async () => {
    const response = await api.get('/notifications');
    return response.data as any[];
  },
  markRead: async (id: string) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
  markAllRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data as { message: string };
  }
};

export default api;
