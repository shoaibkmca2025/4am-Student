import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Zap, FileText, Presentation, HelpCircle,
  Lightbulb, AlarmClock, BookCheck, Loader2, Copy, Check, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import extensionApi from '../services/extensions/extensionApi';

const inputCls = "w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-black/5 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors";

const ToolButton: React.FC<{
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  gradient: string;
  disabled?: boolean;
}> = ({ onClick, icon: Icon, label, gradient, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2.5 rounded-xl bg-gradient-to-r ${gradient} text-white text-sm font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    <Icon className="w-4 h-4" /> {label}
  </button>
);

const LearningToolsPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [topic, setTopic] = useState('Data Structures');
  const [subject, setSubject] = useState('Computer Science');
  const [question, setQuestion] = useState('How do I solve dynamic programming problems faster?');
  const [result, setResult] = useState<any>(null);
  const [knowledge, setKnowledge] = useState('');
  const [alarmMinutes, setAlarmMinutes] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const runTool = async (runner: () => Promise<any>) => {
    setLoading(true);
    setError('');
    try {
      const data = await runner();
      setResult(data.result || data.quickRevisionSheet || data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Tool execution failed. Make sure extension backend routes are configured.');
    } finally {
      setLoading(false);
    }
  };

  const getRandomKnowledge = async () => {
    try {
      const data = await extensionApi.randomKnowledge();
      setKnowledge(data.fact || 'No fact available right now.');
    } catch (err: any) {
      setKnowledge(err?.response?.data?.message || 'Unable to fetch a knowledge tip right now.');
    }
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-black/5 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:text-primary hover:bg-primary/5 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Learning Tools</h1>
              <p className="text-sm text-slate-500 dark:text-slate-300">AI-powered tools and viral student engagement utilities.</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:text-primary hover:bg-primary/5 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
              <Zap className="w-4 h-4 flex-shrink-0" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Learning Tools */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl bg-white dark:bg-slate-800/60 border border-black/5 dark:border-white/5 shadow-sm overflow-hidden"
          >
            <div className="h-1 bg-gradient-to-r from-indigo-500 to-blue-500" />
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 shadow-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">AI Learning Tools</h2>
              </div>

              <input value={topic} onChange={(e) => setTopic(e.target.value)} className={inputCls} placeholder="Topic (e.g. Data Structures)" />
              <textarea value={question} onChange={(e) => setQuestion(e.target.value)} className={inputCls + " resize-none"} rows={2} placeholder="Homework question..." />

              <div className="flex flex-wrap gap-2">
                <ToolButton onClick={() => runTool(() => extensionApi.assignmentGenerator({ topic, level: 'Undergraduate', length: 900 }))} icon={FileText} label="Assignment" gradient="from-indigo-500 to-blue-500" disabled={loading} />
                <ToolButton onClick={() => runTool(() => extensionApi.notesGenerator({ topic }))} icon={BookCheck} label="Notes" gradient="from-teal-500 to-cyan-500" disabled={loading} />
                <ToolButton onClick={() => runTool(() => extensionApi.presentationGenerator({ topic }))} icon={Presentation} label="Slides" gradient="from-purple-500 to-pink-500" disabled={loading} />
                <ToolButton onClick={() => runTool(() => extensionApi.homeworkHelper({ question }))} icon={HelpCircle} label="Help" gradient="from-emerald-500 to-green-500" disabled={loading} />
              </div>
            </div>
          </motion.section>

          {/* Viral Engagement Tools */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl bg-white dark:bg-slate-800/60 border border-black/5 dark:border-white/5 shadow-sm overflow-hidden"
          >
            <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Viral Engagement Tools</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <ToolButton onClick={getRandomKnowledge} icon={Lightbulb} label="Random Fact" gradient="from-emerald-500 to-teal-500" />
                <ToolButton onClick={() => runTool(() => extensionApi.examPanicSheet({ subject }))} icon={BookCheck} label="Panic Sheet" gradient="from-amber-500 to-orange-500" disabled={loading} />
                <ToolButton onClick={() => runTool(() => extensionApi.procrastinationAlarm({ minutes: alarmMinutes, message: 'Time to resume focused study.' }))} icon={AlarmClock} label="Alarm" gradient="from-rose-500 to-red-500" disabled={loading} />
              </div>

              <input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} placeholder="Subject for panic sheet" />
              <div className="flex items-center gap-2">
                <input type="number" value={alarmMinutes} onChange={(e) => setAlarmMinutes(Number(e.target.value || 0))} className={inputCls} placeholder="Alarm minutes" style={{ maxWidth: 140 }} />
                <span className="text-xs text-slate-500 dark:text-slate-300">min timer</span>
              </div>

              <AnimatePresence>
                {knowledge && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                    <Lightbulb className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">{knowledge}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </div>

        {/* Output Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl bg-white dark:bg-slate-800/60 border border-black/5 dark:border-white/5 shadow-sm overflow-hidden"
        >
          <div className="h-1 bg-gradient-to-r from-slate-400 to-slate-600" />
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Tool Output</h2>
              {result && (
                <button onClick={copyResult} className="text-xs text-slate-500 dark:text-slate-300 hover:text-primary flex items-center gap-1 transition-colors">
                  {copied ? <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                </button>
              )}
            </div>
            {loading ? (
              <div className="flex items-center gap-3 py-8 justify-center text-slate-500 dark:text-slate-300">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Generating...</span>
              </div>
            ) : (
              <pre className="text-xs whitespace-pre-wrap break-words bg-slate-50 dark:bg-slate-900/50 border border-black/5 dark:border-white/5 rounded-xl p-4 overflow-auto max-h-[400px] text-slate-700 dark:text-slate-200 font-mono">
                {result ? (typeof result === 'string' ? result : JSON.stringify(result, null, 2)) : 'Run any tool to see output here.'}
              </pre>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default LearningToolsPage;
