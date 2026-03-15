import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';

import { assessmentService, userAssessmentService } from '../services/api';
import { Question } from '../data/assessments';
import TestHeader from '../components/assessment/TestHeader';
import QuestionCard from '../components/assessment/QuestionCard';
import ActionBar from '../components/assessment/ActionBar';
import NavigatorPanel from '../components/assessment/NavigatorPanel';
import ResultAnalytics from '../components/assessment/ResultAnalytics';
import Gamification from '../components/assessment/Gamification';

const AssessmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const testId = Number(id || 0);

  const [testMetadata, setTestMetadata] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [markedQuestions, setMarkedQuestions] = useState<number[]>([]);
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Timer State
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Gamification State
  const [streak, setStreak] = useState(0);
  const [showXP, setShowXP] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const hasSubmittedRef = useRef(false);

  const parseDurationToSeconds = (duration: string): number => {
    const raw = (duration || '').toLowerCase().trim();
    if (!raw) return 30 * 60;

    const withUnits = raw.match(/(\d+)\s*(h|hr|hrs|hour|hours|m|min|mins|minute|minutes|s|sec|secs|second|seconds)/g);
    if (withUnits && withUnits.length > 0) {
      return withUnits.reduce((total, part) => {
        const piece = part.match(/(\d+)\s*(.*)/);
        if (!piece) return total;
        const value = Number(piece[1]);
        const unit = piece[2];
        if (unit.startsWith('h')) return total + value * 3600;
        if (unit.startsWith('m')) return total + value * 60;
        return total + value;
      }, 0);
    }

    const plainNumber = raw.match(/\d+/);
    if (plainNumber) {
      return Number(plainNumber[0]) * 60;
    }

    return 30 * 60;
  };

  const formatTimer = (totalSec: number): string => {
    const safeSec = Math.max(totalSec, 0);
    const h = Math.floor(safeSec / 3600);
    const m = Math.floor((safeSec % 3600) / 60);
    const s = safeSec % 60;

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const durationSeconds = useMemo(
    () => parseDurationToSeconds(testMetadata?.duration || ''),
    [testMetadata?.duration]
  );

  const formatElapsed = (totalSec: number): string => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  const calculateScore = useCallback(() => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      const answer = answers[index];
      if (q.type === 'code-challenge' || q.type === 'text-input') {
        // For manual grading types, we assume correct if not empty for now (simulation)
        if (answer && answer.toString().trim().length > 10) {
          correctCount++;
        }
      } else {
        // MCQ
        if (answer === q.correct) {
          correctCount++;
        }
      }
    });
    return correctCount;
  }, [answers, questions]);

  const handleSubmit = useCallback(async () => {
    if (hasSubmittedRef.current || isSubmitting || questions.length === 0) {
      return;
    }

    hasSubmittedRef.current = true;
    setIsSubmitting(true);

    const finalScore = calculateScore();
    const percentage = Math.round((finalScore / questions.length) * 100);
    
    try {
      await userAssessmentService.upsertMe(testId, {
        status: 'Completed',
        score: `${percentage}%`,
        timestamp: new Date().toISOString(),
        timeTaken: formatElapsed(elapsedSeconds)
      });
      setShowResult(true);
    } catch (err) {
      hasSubmittedRef.current = false;
      console.error("Failed to save assessment to backend", err);
      alert("Failed to save assessment result. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, questions.length, testId, elapsedSeconds, calculateScore]);

  // Countdown timer — when it reaches 0, auto-submit once.
  useEffect(() => {
    if (!testMetadata || showResult || isSubmitting || questions.length === 0) return;

    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    const nextLeft = Math.max(durationSeconds - elapsed, 0);
    setElapsedSeconds(elapsed);
    setTimeLeftSeconds(nextLeft);

    const timer = setInterval(() => {
      setElapsedSeconds((prevElapsed) => {
        const updatedElapsed = prevElapsed + 1;
        const next = Math.max(durationSeconds - updatedElapsed, 0);
        setTimeLeftSeconds(next);

        if (next <= 0) {
          setIsTimeUp(true);
          clearInterval(timer);
        }
        return updatedElapsed;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [durationSeconds, isSubmitting, questions.length, showResult, startTime, testMetadata]);

  useEffect(() => {
    if (isTimeUp && !showResult) {
      handleSubmit();
    }
  }, [isTimeUp, showResult, handleSubmit]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let assessment;
        try {
          assessment = await assessmentService.getById(testId);
        } catch (err) {
           console.error('Backend API unavailable', err);
        }
        
        if (!assessment) {
          // If backend fails, we redirect or show error. 
          // For now, redirect to dashboard as we want strict backend dependency.
          navigate('/dashboard');
          return;
        }

        setTestMetadata(assessment);
        setStartTime(Date.now());
        setIsTimeUp(false);
        hasSubmittedRef.current = false;
        
        // Shuffle questions with a seed based on current session so retakes get different order
        if (assessment.questions) {
          const seed = Date.now();
          const seededRandom = (i: number) => {
            const x = Math.sin(seed + i) * 10000;
            return x - Math.floor(x);
          };
          const shuffled = [...assessment.questions]
            .map((q: Question, i: number) => ({ q, sort: seededRandom(i) }))
            .sort((a: { sort: number }, b: { sort: number }) => a.sort - b.sort)
            .map((item: { q: Question }) => item.q);
          
          // Also shuffle MCQ options (and adjust correct index) for variety
          const finalQuestions = shuffled.map((q: Question, qi: number) => {
            if (q.type !== 'code-challenge' && q.type !== 'text-input' && q.options && q.correct !== undefined) {
              const optionPairs = q.options.map((opt: string, idx: number) => ({ opt, wasCorrect: idx === q.correct }));
              // Shuffle options
              for (let i = optionPairs.length - 1; i > 0; i--) {
                const j = Math.floor(seededRandom(qi * 100 + i) * (i + 1));
                [optionPairs[i], optionPairs[j]] = [optionPairs[j], optionPairs[i]];
              }
              return {
                ...q,
                options: optionPairs.map((p: { opt: string }) => p.opt),
                correct: optionPairs.findIndex((p: { wasCorrect: boolean }) => p.wasCorrect)
              };
            }
            return q;
          });
          setQuestions(finalQuestions);
        }
      } catch (error) {
        console.error('Failed to load assessment:', error);
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [testId, navigate]);

  const handleAnswer = (answer: number | string) => {
    if (isTimeUp || isSubmitting) return;

    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));

    // Gamification: Award XP for answering (simulation)
    if (answers[currentQuestionIndex] === undefined) {
      setStreak(prev => prev + 1);
      setXpGained(10 + (streak * 5)); // Bonus for streak
      setShowXP(true);
    }
  };

  const handleNext = () => {
    if (isTimeUp || isSubmitting) return;
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowXP(false); // Hide previous XP popup
    }
  };

  const handlePrevious = () => {
    if (isTimeUp || isSubmitting) return;
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const toggleMarkForReview = () => {
    if (isTimeUp || isSubmitting) return;

    setMarkedQuestions(prev => {
      if (prev.includes(currentQuestionIndex)) {
        return prev.filter(i => i !== currentQuestionIndex);
      } else {
        return [...prev, currentQuestionIndex];
      }
    });
  };

  if (isLoading || !testMetadata) {
    return (
      <div className="app-shell flex items-center justify-center text-slate-900">
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
        timeTaken={formatElapsed(elapsedSeconds)}
        accuracy={percentage}
        percentile={85} // Mock percentile
        onRetry={() => window.location.reload()}
        onDashboard={() => navigate('/dashboard')}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="app-shell text-slate-900 flex flex-col">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-200/45 via-sky-50 to-indigo-50/70" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-400/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/15 rounded-full blur-[100px]" />
      </div>

      <TestHeader 
        title={testMetadata.title}
        timeLeft={formatTimer(timeLeftSeconds)}
        isTimeUp={isTimeUp}
        totalQuestions={questions.length}
        currentQuestion={currentQuestionIndex}
        onExit={() => navigate('/dashboard')}
      />

      <div className="flex-1 relative z-10 pt-20 pb-36 md:pb-28 px-3 sm:px-4 md:px-8 max-w-5xl mx-auto w-full overflow-x-hidden">
        {/* Mobile Navigator Toggle */}
        <button 
          onClick={() => setIsNavigatorOpen(true)}
          className="md:hidden fixed top-20 right-4 z-30 p-2 bg-white rounded-lg text-slate-900 shadow-lg border border-sky-200"
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
              type={currentQuestion?.type}
              question={currentQuestion?.question || "Loading..."}
              options={currentQuestion?.options || []}
              selectedOption={answers[currentQuestionIndex] ?? null}
              onSelect={handleAnswer}
              codeSnippet={currentQuestion?.codeSnippet}
              disabled={isTimeUp || isSubmitting}
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
        isDisabled={isTimeUp || isSubmitting}
        isSubmitting={isSubmitting}
      />

      <NavigatorPanel 
        questions={questions}
        currentIndex={currentQuestionIndex}
        answers={answers}
        markedQuestions={markedQuestions}
        onNavigate={(idx) => {
          if (isTimeUp || isSubmitting) return;
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


