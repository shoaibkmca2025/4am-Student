import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Gamepad2, Brain, Timer, ShieldAlert, Users, Store,
  Flame, Trophy, Target, Clock, Video, Plus, Send, Tag, Loader2, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import extensionApi from '../services/extensions/extensionApi';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' as const },
  }),
};

const ModuleCard: React.FC<{
  icon: React.ElementType;
  title: string;
  gradient: string;
  children: React.ReactNode;
  index: number;
}> = ({ icon: Icon, title, gradient, children, index }) => (
  <motion.section
    custom={index}
    initial="hidden"
    animate="visible"
    variants={fadeUp}
    className="rounded-2xl bg-white dark:bg-slate-800/60 border border-black/5 dark:border-white/5 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
  >
    <div className={`h-1 bg-gradient-to-r ${gradient}`} />
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </div>
  </motion.section>
);

const inputCls = "w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-black/5 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors";
const btnPrimary = "px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2";
const btnSecondary = "px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 active:scale-[0.98] transition-all flex items-center gap-2";

const StudyModulesPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState<any>(null);
  const [mirror, setMirror] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [confessions, setConfessions] = useState<any[]>([]);
  const [marketplace, setMarketplace] = useState<any[]>([]);

  const [studyMinutes, setStudyMinutes] = useState(30);
  const [roomName, setRoomName] = useState('Silent Sprint Room');
  const [allowCamera, setAllowCamera] = useState(false);
  const [confessionText, setConfessionText] = useState('');
  const [listing, setListing] = useState({ title: '', description: '', category: 'notes', price: 20 });

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const [a, b, c, d, e, f] = await Promise.all([
        extensionApi.gamifiedOverview(),
        extensionApi.studyMirrorAnalytics(14),
        extensionApi.listPomodoroRooms(),
        extensionApi.distractionReport(14),
        extensionApi.listConfessions(),
        extensionApi.marketplaceListings()
      ]);
      setOverview(a); setMirror(b); setRooms(c.rooms || []);
      setReport(d); setConfessions(e.posts || []); setMarketplace(f.listings || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Extension modules are not available yet. They will appear once the backend routes are configured.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const leaderboard = useMemo(() => overview?.leaderboard || [], [overview]);

  const logStudy = async () => { await extensionApi.logStudy({ minutes: studyMinutes, source: 'manual' }); await refresh(); };
  const createRoom = async () => { await extensionApi.createPomodoroRoom({ name: roomName, allowCamera, type: 'silent' }); await refresh(); };
  const completeSession = async () => { await extensionApi.completePomodoroSession(25); await refresh(); };
  const addConfession = async () => {
    if (!confessionText.trim()) return;
    await extensionApi.createConfession({ message: confessionText, mood: 'stressed' });
    setConfessionText(''); await refresh();
  };
  const createListing = async () => {
    await extensionApi.createListing({ title: listing.title, description: listing.description, category: listing.category as any, price: Number(listing.price) });
    setListing({ title: '', description: '', category: 'notes', price: 20 }); await refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:text-primary hover:bg-primary/5 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Study Modules</h1>
              <p className="text-sm text-slate-500 dark:text-slate-300">Optional plug-and-play modules alongside your dashboard.</p>
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Error / Loading */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="flex items-center justify-center gap-3 py-12 text-slate-500 dark:text-slate-300">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading modules...</span>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Module 1: Gamified Learning */}
            <ModuleCard icon={Gamepad2} title="Gamified Learning" gradient="from-indigo-500 to-purple-500" index={0}>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full font-semibold">
                  <Flame className="w-3.5 h-3.5" /> {overview?.profile?.streakDays || 0} Day Streak
                </div>
                <div className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-500 px-2.5 py-1 rounded-full font-semibold">
                  <Trophy className="w-3.5 h-3.5" /> {overview?.profile?.totalPoints || 0} Points
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" value={studyMinutes} onChange={(e) => setStudyMinutes(Number(e.target.value || 0))} className={inputCls} style={{ maxWidth: 120 }} />
                <button onClick={logStudy} className={btnPrimary}><Plus className="w-4 h-4" /> Log Study</button>
              </div>
              {(overview?.challenges || []).length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Challenges</p>
                  {(overview?.challenges || []).map((c: any) => (
                    <div key={c.challengeId} className="flex items-center justify-between text-sm px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/30">
                      <span className="text-slate-700 dark:text-gray-300">{c.title}</span>
                      <span className={`font-bold text-xs ${c.completed ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-300'}`}>{c.progress}/{c.target} {c.completed ? '✓' : ''}</span>
                    </div>
                  ))}
                </div>
              )}
              {leaderboard.length > 0 && (
                <div className="text-xs text-slate-500 dark:text-slate-300">
                  🏆 {leaderboard.slice(0, 3).map((u: any) => `${u.rank}. ${u.userName} (${u.points})`).join(' • ')}
                </div>
              )}
            </ModuleCard>

            {/* Module 2: Study Mirror */}
            <ModuleCard icon={Brain} title="AI Study Mirror" gradient="from-cyan-500 to-teal-500" index={1}>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Study Hours', value: mirror?.summary?.totalStudyHours || 0, icon: Clock },
                  { label: 'Focus Score', value: mirror?.summary?.averageFocusScore || 0, icon: Target },
                  { label: 'Productivity', value: mirror?.summary?.productivityIndex || 0, icon: Brain },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                    <stat.icon className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-300 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </ModuleCard>

            {/* Module 3: Pomodoro */}
            <ModuleCard icon={Timer} title="Pomodoro Virtual Study Room" gradient="from-emerald-500 to-green-500" index={2}>
              <div className="flex flex-wrap items-center gap-2">
                <input value={roomName} onChange={(e) => setRoomName(e.target.value)} className={inputCls} placeholder="Room name" style={{ flex: '1 1 160px' }} />
                <label className="text-xs text-slate-500 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer select-none">
                  <input type="checkbox" checked={allowCamera} onChange={(e) => setAllowCamera(e.target.checked)} className="rounded" /> <Video className="w-3 h-3" /> Camera
                </label>
              </div>
              <div className="flex gap-2">
                <button onClick={createRoom} className={btnPrimary}><Plus className="w-4 h-4" /> Create</button>
                <button onClick={completeSession} className={btnSecondary}><Timer className="w-4 h-4" /> Complete 25m</button>
              </div>
              {rooms.length > 0 && (
                <div className="space-y-1.5">
                  {rooms.slice(0, 5).map((room) => (
                    <div key={room._id || room.id} className="flex items-center justify-between text-sm px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/30">
                      <span className="text-slate-700 dark:text-gray-300 font-medium">{room.name}</span>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">{room.currentPhase}</span>
                        <span>{room.activeUsers} online</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ModuleCard>

            {/* Module 4: Distraction Tracker */}
            <ModuleCard icon={ShieldAlert} title="Study vs Distraction Tracker" gradient="from-rose-500 to-orange-500" index={3}>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Study Hours', value: report?.summary?.studyHours || 0, color: 'text-emerald-500' },
                  { label: 'Social Hours', value: report?.summary?.socialHours || 0, color: 'text-rose-500' },
                  { label: 'Focus Score', value: report?.summary?.focusScore || 0, color: 'text-indigo-500' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                    <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-300 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </ModuleCard>

            {/* Module 5: Community */}
            <ModuleCard icon={Users} title="Community Features" gradient="from-violet-500 to-fuchsia-500" index={4}>
              <div className="flex items-center gap-2">
                <input value={confessionText} onChange={(e) => setConfessionText(e.target.value)} placeholder="Share anonymously..." className={inputCls} style={{ flex: 1 }} />
                <button onClick={addConfession} className={btnPrimary}><Send className="w-4 h-4" /></button>
              </div>
              {confessions.length > 0 && (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {confessions.slice(0, 5).map((post) => (
                    <div key={post.id} className="text-sm px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/30 text-slate-700 dark:text-gray-300 italic">
                      "{post.message}"
                    </div>
                  ))}
                </div>
              )}
            </ModuleCard>

            {/* Module 6: Marketplace */}
            <ModuleCard icon={Store} title="Student Marketplace" gradient="from-amber-500 to-yellow-500" index={5}>
              <div className="grid grid-cols-2 gap-2">
                <input value={listing.title} onChange={(e) => setListing({ ...listing, title: e.target.value })} placeholder="Product title" className={inputCls} />
                <input value={listing.price} type="number" onChange={(e) => setListing({ ...listing, price: Number(e.target.value || 0) })} placeholder="Price" className={inputCls} />
              </div>
              <div className="flex gap-2">
                <select value={listing.category} onChange={(e) => setListing({ ...listing, category: e.target.value })} className={inputCls} style={{ flex: 1 }}>
                  <option value="notes">Notes</option>
                  <option value="ppt-template">PPT Templates</option>
                  <option value="design">Designs</option>
                  <option value="study-guide">Study Guides</option>
                </select>
                <button onClick={createListing} className={btnPrimary}><Tag className="w-4 h-4" /> List</button>
              </div>
              <textarea value={listing.description} onChange={(e) => setListing({ ...listing, description: e.target.value })} placeholder="Description..." className={inputCls + " resize-none"} rows={2} />
              {marketplace.length > 0 && (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {marketplace.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/30">
                      <span className="text-slate-700 dark:text-gray-300 font-medium">{item.title}</span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-emerald-500 font-bold">${item.price}</span>
                        <span className="text-slate-500 dark:text-slate-300">{item.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ModuleCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyModulesPage;
