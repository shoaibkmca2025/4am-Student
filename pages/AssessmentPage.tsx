import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';

import { ASSESSMENT_QUESTIONS, TESTS_METADATA, Question } from '../data/assessments';
import TestHeader from '../components/assessment/TestHeader';
import QuestionCard from '../components/assessment/QuestionCard';
import ActionBar from '../components/assessment/ActionBar';
import NavigatorPanel from '../components/assessment/NavigatorPanel';
import ResultAnalytics from '../components/assessment/ResultAnalytics';
import Gamification from '../components/assessment/Gamification';

const AssessmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const testId = Number(id);
  const testMetadata = TESTS_METADATA.find(t => t.id === testId);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedQuestions, setMarkedQuestions] = useState<number[]>([]);
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Gamification State
  const [streak, setStreak] = useState(0);
  const [showXP, setShowXP] = useState(false);
  const [xpGained, setXpGained] = useState(0);

  useEffect(() => {
    if (!testMetadata) {
      navigate('/dashboard');
      return;
    }

    // Load questions
    const testQuestions = ASSESSMENT_QUESTIONS[testId];
    if (testQuestions) {
      // For a real app, we might shuffle here, but let's keep it stable for now or shuffle
      const shuffled = [...testQuestions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
    }
    setIsLoading(false);
  }, [testId, testMetadata, navigate]);

  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));

    // Gamification: Award XP for answering (simulation)
    if (answers[currentQuestionIndex] === undefined) {
      setStreak(prev => prev + 1);
      setXpGained(10 + (streak * 5)); // Bonus for streak
      setShowXP(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowXP(false); // Hide previous XP popup
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const toggleMarkForReview = () => {
    setMarkedQuestions(prev => {
      if (prev.includes(currentQuestionIndex)) {
        return prev.filter(i => i !== currentQuestionIndex);
      } else {
        return [...prev, currentQuestionIndex];
      }
    });
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        correctCount++;
      }
    });
    return correctCount;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    const percentage = Math.round((finalScore / questions.length) * 100);
    
    // Save to localStorage
    const savedAssessments = JSON.parse(localStorage.getItem('user_assessments') || '{}');
    savedAssessments[testId] = {
      status: 'Completed',
      score: `${percentage}%`,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('user_assessments', JSON.stringify(savedAssessments));
    
    setShowResult(true);
  };

  if (isLoading || !testMetadata) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (showResult) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <ResultAnalytics 
        score={score}
        totalQuestions={questions.length}
        timeTaken="15m 20s" // Mock time for now
        accuracy={percentage}
        percentile={85} // Mock percentile
        onRetry={() => window.location.reload()}
        onDashboard={() => navigate('/dashboard')}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white flex flex-col">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-[#0B0F1A] to-[#0B0F1A]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <TestHeader 
        title={testMetadata.title}
        duration={testMetadata.duration}
        totalQuestions={questions.length}
        currentQuestion={currentQuestionIndex}
        onExit={() => navigate('/dashboard')}
      />

      <div className="flex-1 relative z-10 pt-20 pb-24 px-4 md:px-8 max-w-5xl mx-auto w-full">
        {/* Mobile Navigator Toggle */}
        <button 
          onClick={() => setIsNavigatorOpen(true)}
          className="md:hidden fixed top-20 right-4 z-30 p-2 bg-slate-800 rounded-lg text-white shadow-lg border border-white/10"
        >
          <Menu className="w-5 h-5" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionCard 
              question={currentQuestion?.question || "Loading..."}
              options={currentQuestion?.options || []}
              selectedOption={answers[currentQuestionIndex] ?? null}
              onSelect={handleAnswer}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <ActionBar 
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
        onMarkForReview={toggleMarkForReview}
        isFirst={currentQuestionIndex === 0}
        isLast={currentQuestionIndex === questions.length - 1}
        isMarked={markedQuestions.includes(currentQuestionIndex)}
        canNext={answers[currentQuestionIndex] !== undefined} // Require answer to proceed? Optional.
      />

      <NavigatorPanel 
        questions={questions}
        currentIndex={currentQuestionIndex}
        answers={answers}
        markedQuestions={markedQuestions}
        onNavigate={(idx) => {
          setCurrentQuestionIndex(idx);
          setIsNavigatorOpen(false);
        }}
        isOpen={isNavigatorOpen}
        onClose={() => setIsNavigatorOpen(false)}
      />

      <Gamification 
        streak={streak}
        xpGained={xpGained}
        show={showXP}
        onHide={() => setShowXP(false)}
      />
    </div>
  );
};

export default AssessmentPage;
