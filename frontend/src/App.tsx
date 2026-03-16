import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import AdminPage from './pages/AdminPage';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider as AuthContextProvider } from './context/AuthContext';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AssessmentPage = React.lazy(() => import('./pages/AssessmentPage'));
const FeatureHubPage = React.lazy(() => import('./features/FeatureHubPage'));
const StudyModulesPage = React.lazy(() => import('./modules/StudyModulesPage'));
const LearningToolsPage = React.lazy(() => import('./tools/LearningToolsPage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      <span className="text-sm text-slate-500 dark:text-slate-400">Loading...</span>
    </div>
  </div>
);

// Simple error boundary
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
          <div className="max-w-md w-full rounded-2xl p-8 bg-white/60 dark:bg-slate-800/60 border border-red-500/20 shadow-2xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-2xl">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-600 dark:text-gray-400 mb-4">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary px-6 py-2 text-sm"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ThemeProvider>
      <AuthContextProvider>
        <AppErrorBoundary>
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <Dashboard />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } />
                <Route path="/assessment/:id" element={
                  <ProtectedRoute>
                    <AssessmentPage />
                  </ProtectedRoute>
                } />
                <Route path="/features" element={
                  <ProtectedRoute>
                    <FeatureHubPage />
                  </ProtectedRoute>
                } />
                <Route path="/modules" element={
                  <ProtectedRoute>
                    <StudyModulesPage />
                  </ProtectedRoute>
                } />
                <Route path="/tools" element={
                  <ProtectedRoute>
                    <LearningToolsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPage />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Router>
        </AppErrorBoundary>
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;
