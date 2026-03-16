import api from '../api';

export interface StudyLogInput {
  date?: string;
  minutes?: number;
  source?: 'manual' | 'pomodoro';
}

export interface PomodoroRoomInput {
  name: string;
  allowCamera?: boolean;
  type?: 'silent' | 'live-study';
}

export interface MarketplaceListingInput {
  title: string;
  description?: string;
  category: 'notes' | 'ppt-template' | 'design' | 'study-guide';
  price: number;
}

export const extensionApi = {
  gamifiedOverview: async () => (await api.get('/extensions/gamified/overview')).data,
  logStudy: async (payload: StudyLogInput) => (await api.post('/extensions/gamified/study-log', payload)).data,
  submitQuizAttempt: async (payload: { topic?: string; totalQuestions: number; correctAnswers: number }) =>
    (await api.post('/extensions/gamified/memory-quiz/attempt', payload)).data,

  studyMirrorAnalytics: async (days = 14) => (await api.get('/extensions/study-mirror/analytics', { params: { days } })).data,

  createPomodoroRoom: async (payload: PomodoroRoomInput) => (await api.post('/extensions/pomodoro/rooms', payload)).data,
  listPomodoroRooms: async () => (await api.get('/extensions/pomodoro/rooms')).data,
  joinPomodoroRoom: async (roomId: string) => (await api.post(`/extensions/pomodoro/rooms/${roomId}/join`)).data,
  leavePomodoroRoom: async (roomId: string) => (await api.post(`/extensions/pomodoro/rooms/${roomId}/leave`)).data,
  completePomodoroSession: async (focusMinutes = 25) =>
    (await api.post('/extensions/pomodoro/session/complete', { focusMinutes })).data,

  saveDistractionLog: async (payload: { date?: string; studyMinutes: number; socialMediaMinutes: number; otherDistractionMinutes: number }) =>
    (await api.post('/extensions/distraction/log', payload)).data,
  distractionReport: async (days = 14) => (await api.get('/extensions/distraction/report', { params: { days } })).data,

  assignmentGenerator: async (payload: { topic: string; level?: string; length?: number }) =>
    (await api.post('/extensions/ai-tools/assignment-generator', payload)).data,
  notesGenerator: async (payload: { topic: string }) => (await api.post('/extensions/ai-tools/notes-generator', payload)).data,
  presentationGenerator: async (payload: { topic: string }) =>
    (await api.post('/extensions/ai-tools/presentation-generator', payload)).data,
  homeworkHelper: async (payload: { question: string }) =>
    (await api.post('/extensions/ai-tools/homework-helper', payload)).data,

  randomKnowledge: async () => (await api.get('/extensions/viral/random-knowledge')).data,
  examPanicSheet: async (payload: { subject: string }) => (await api.post('/extensions/viral/exam-panic-sheet', payload)).data,
  procrastinationAlarm: async (payload: { minutes: number; message?: string }) =>
    (await api.post('/extensions/viral/procrastination-alarm', payload)).data,

  listConfessions: async () => (await api.get('/extensions/community/confessions')).data,
  createConfession: async (payload: { message: string; mood?: string }) =>
    (await api.post('/extensions/community/confessions', payload)).data,
  globalMap: async () => (await api.get('/extensions/community/global-map')).data,
  liveStudyRooms: async () => (await api.get('/extensions/community/live-study-rooms')).data,

  marketplaceListings: async (category?: string) => (await api.get('/extensions/marketplace/listings', { params: { category } })).data,
  createListing: async (payload: MarketplaceListingInput) => (await api.post('/extensions/marketplace/listings', payload)).data,
  purchaseListing: async (listingId: string) => (await api.post(`/extensions/marketplace/listings/${listingId}/purchase`)).data,
  wallet: async () => (await api.get('/extensions/marketplace/wallet')).data,
  topUpWallet: async (amount: number) => (await api.post('/extensions/marketplace/wallet/top-up', { amount })).data,
  earnings: async () => (await api.get('/extensions/marketplace/earnings')).data
};

export default extensionApi;
