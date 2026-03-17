import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowLeft, Code2, Play, RotateCw, CheckCircle, XCircle, Timer, Filter, Trophy, Flame, BookOpen, Sun, Moon
} from 'lucide-react';
import { codingChallenges, CodingChallenge } from '../data/codingChallenges';

const btnPrimary = "px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2";
const inputCls = "w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-black/5 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors";

const difficultyColors: Record<string, string> = {
  Easy: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  Medium: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  Hard: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
};

type TestResult = {
  id: string;
  passed: boolean;
  expected: any;
  received: any;
  error?: string;
};

type RunResult = {
  passed: number;
  total: number;
  results: TestResult[];
  timeMs: number;
};

const safeStringify = (val: any) => {
  try { return JSON.stringify(val); } catch { return String(val); }
};

const runUserCode = (challenge: CodingChallenge, code: string): RunResult => {
  const start = performance.now();
  let fn: any = null;
  try {
    // eslint-disable-next-line no-new-func
    const factory = new Function(`${code}; return typeof ${challenge.functionName} === 'function' ? ${challenge.functionName} : null;`);
    fn = factory();
  } catch (err: any) {
    const timeMs = Math.round(performance.now() - start);
    return {
      passed: 0,
      total: challenge.testCases.length,
      timeMs,
      results: [{ id: 'compile', passed: false, expected: 'function', received: 'error', error: err?.message || 'Compilation failed' }]
    };
  }

  if (typeof fn !== 'function') {
    const timeMs = Math.round(performance.now() - start);
    return {
      passed: 0,
      total: challenge.testCases.length,
      timeMs,
      results: [{ id: 'missing-fn', passed: false, expected: `${challenge.functionName} to be defined`, received: 'not found' }]
    };
  }

  const results: TestResult[] = [];
  let passed = 0;

  for (const tc of challenge.testCases) {
    try {
      const output = fn(...tc.args);
      const ok = safeStringify(output) === safeStringify(tc.expected);
      if (ok) passed += 1;
      results.push({ id: tc.id, passed: ok, expected: tc.expected, received: output });
    } catch (err: any) {
      results.push({ id: tc.id, passed: false, expected: tc.expected, received: 'error', error: err?.message || 'Runtime error' });
    }
  }

  const timeMs = Math.round(performance.now() - start);
  return { passed, total: challenge.testCases.length, results, timeMs };
};

const CodingChallengesPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [selectedId, setSelectedId] = useState(codingChallenges[0].id);
  const [code, setCode] = useState<string>(codingChallenges[0].starterCode);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

  const selected = useMemo(
    () => codingChallenges.find((c) => c.id === selectedId) || codingChallenges[0],
    [selectedId]
  );

  const filtered = useMemo(() => {
    if (filter === 'All') return codingChallenges;
    return codingChallenges.filter((c) => c.difficulty === filter);
  }, [filter]);

  const onSelect = (challenge: CodingChallenge) => {
    setSelectedId(challenge.id);
    setCode(challenge.starterCode);
    setRunResult(null);
  };

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => {
      const result = runUserCode(selected, code);
      setRunResult(result);
      setRunning(false);
    }, 0);
  };

  const handleReset = () => {
    setCode(selected.starterCode);
    setRunResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:text-primary hover:bg-primary/5 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Coding Challenges</h1>
              <p className="text-sm text-slate-500 dark:text-slate-300">Practice like HackerRank/LeetCode with instant tests.</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:text-primary hover:bg-primary/5 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <Filter className="w-4 h-4" /> Filter
              </div>
              <div className="flex gap-2 text-xs">
                {(['All', 'Easy', 'Medium', 'Hard'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setFilter(lvl)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition ${filter === lvl ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-black/5 dark:border-white/5'}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filtered.map((challenge) => (
                <button
                  key={challenge.id}
                  onClick={() => onSelect(challenge)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${selected.id === challenge.id ? 'border-primary/30 bg-primary/5 shadow-sm' : 'border-black/5 dark:border-white/5 bg-white dark:bg-slate-800/60'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{challenge.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-300">{challenge.tags.join(' • ')}</p>
                      </div>
                    </div>
                    <span className={`text-[11px] px-2 py-1 rounded-full border ${difficultyColors[challenge.difficulty]}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-slate-800/60 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Challenge</p>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">{selected.title}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">{selected.description}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                  <Trophy className="w-4 h-4" />
                  <span>{selected.testCases.length} tests</span>
                  <span>•</span>
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>{selected.difficulty}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-300">
                {selected.constraints.map((c) => (
                  <span key={c} className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700/50 border border-black/5 dark:border-white/10">{c}</span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-slate-800/60 shadow-sm overflow-hidden">
              <div className="border-b border-black/5 dark:border-white/5 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  <Code2 className="w-4 h-4" /> Editor
                </div>
                <div className="flex gap-2">
                  <button onClick={handleReset} className="px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button onClick={handleRun} disabled={running} className={`${btnPrimary} ${running ? 'opacity-70 cursor-wait' : ''}`}>
                    <Play className="w-4 h-4" /> {running ? 'Running...' : 'Run Tests'}
                  </button>
                </div>
              </div>
              <textarea
                className={`${inputCls} font-mono text-sm rounded-none border-0 border-b border-black/5 dark:border-white/5 min-h-[260px] bg-slate-900/5 dark:bg-slate-900/50`}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
            </div>

            <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-slate-800/60 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {runResult?.passed === runResult?.total ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-rose-500" />}
                  <span>Results</span>
                </div>
                {runResult && (
                  <div className="text-xs text-slate-500 dark:text-slate-300 flex items-center gap-2">
                    <Timer className="w-4 h-4" /> {runResult.timeMs} ms
                  </div>
                )}
              </div>

              {!runResult && (
                <div className="text-sm text-slate-500 dark:text-slate-300">Run tests to see feedback.</div>
              )}

              <div className="space-y-2">
                {runResult?.results.map((r) => (
                  <div key={r.id} className={`p-3 rounded-xl border text-sm ${r.passed ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-200' : 'border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold">
                        {r.passed ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        <span>Test {r.id.toUpperCase()}</span>
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-300">expect {safeStringify(r.expected)}</span>
                    </div>
                    <div className="text-xs mt-1 text-slate-700 dark:text-slate-200">got {safeStringify(r.received)}</div>
                    {r.error && <div className="text-xs text-rose-500 mt-1">{r.error}</div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-800/40 p-4 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <BookOpen className="w-4 h-4 text-primary" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">Tips</p>
                <ul className="list-disc ml-4 text-xs space-y-1">
                  <li>Keep solutions pure (no network/DOM) so tests run instantly.</li>
                  <li>Use the provided function name: <span className="font-mono">{selected.functionName}</span>.</li>
                  <li>Edge cases matter: empty arrays, repeated chars, negative numbers.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingChallengesPage;
