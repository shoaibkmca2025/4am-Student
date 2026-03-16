import React, { useEffect, useMemo, useState } from 'react';
import extensionApi from '../services/extensions/extensionApi';

const StudyModulesPage: React.FC = () => {
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
      setOverview(a);
      setMirror(b);
      setRooms(c.rooms || []);
      setReport(d);
      setConfessions(e.posts || []);
      setMarketplace(f.listings || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load extension modules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const leaderboard = useMemo(() => overview?.leaderboard || [], [overview]);

  const logStudy = async () => {
    await extensionApi.logStudy({ minutes: studyMinutes, source: 'manual' });
    await refresh();
  };

  const createRoom = async () => {
    await extensionApi.createPomodoroRoom({ name: roomName, allowCamera, type: 'silent' });
    await refresh();
  };

  const completeSession = async () => {
    await extensionApi.completePomodoroSession(25);
    await refresh();
  };

  const addConfession = async () => {
    if (!confessionText.trim()) return;
    await extensionApi.createConfession({ message: confessionText, mood: 'stressed' });
    setConfessionText('');
    await refresh();
  };

  const createListing = async () => {
    await extensionApi.createListing({
      title: listing.title,
      description: listing.description,
      category: listing.category as any,
      price: Number(listing.price)
    });
    setListing({ title: '', description: '', category: 'notes', price: 20 });
    await refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Modules</h1>
          <p className="text-slate-600">Optional plug-and-play modules. Existing dashboard remains untouched.</p>
        </header>

        {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</div>}
        {loading && <div className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-600">Loading modules...</div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="rounded-2xl border border-sky-200 bg-white p-5 space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Module 1: Gamified Learning</h2>
            <p className="text-sm text-slate-600">Streak: {overview?.profile?.streakDays || 0} days | Points: {overview?.profile?.totalPoints || 0}</p>
            <div className="flex items-center gap-2">
              <input type="number" value={studyMinutes} onChange={(e) => setStudyMinutes(Number(e.target.value || 0))} className="px-3 py-2 rounded-lg border border-sky-200 text-sm" />
              <button onClick={logStudy} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">Log Study</button>
            </div>
            <ul className="text-sm text-slate-700 space-y-1">
              {(overview?.challenges || []).map((c: any) => (
                <li key={c.challengeId}>{c.title}: {c.progress}/{c.target} {c.completed ? '✓' : ''}</li>
              ))}
            </ul>
            <div className="text-sm text-slate-700">Leaderboard: {leaderboard.slice(0, 3).map((u: any) => `${u.rank}. ${u.userName} (${u.points})`).join(' | ') || 'No entries yet'}</div>
          </section>

          <section className="rounded-2xl border border-sky-200 bg-white p-5 space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Module 2: AI Study Mirror</h2>
            <p className="text-sm text-slate-600">Total Study Hours: {mirror?.summary?.totalStudyHours || 0}</p>
            <p className="text-sm text-slate-600">Average Focus Score: {mirror?.summary?.averageFocusScore || 0}</p>
            <p className="text-sm text-slate-600">Productivity Index: {mirror?.summary?.productivityIndex || 0}</p>
          </section>

          <section className="rounded-2xl border border-sky-200 bg-white p-5 space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Module 3: Pomodoro Virtual Study Room</h2>
            <div className="flex flex-wrap items-center gap-2">
              <input value={roomName} onChange={(e) => setRoomName(e.target.value)} className="px-3 py-2 rounded-lg border border-sky-200 text-sm" />
              <label className="text-xs text-slate-600 flex items-center gap-1"><input type="checkbox" checked={allowCamera} onChange={(e) => setAllowCamera(e.target.checked)} /> Allow Camera</label>
              <button onClick={createRoom} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">Create Room</button>
              <button onClick={completeSession} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm">Complete 25m Session</button>
            </div>
            <ul className="text-sm text-slate-700 space-y-1">
              {rooms.slice(0, 6).map((room) => (
                <li key={room._id || room.id}>{room.name} | {room.currentPhase} | {room.activeUsers} online</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-sky-200 bg-white p-5 space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Module 4: Study vs Distraction Tracker</h2>
            <p className="text-sm text-slate-600">Study Hours: {report?.summary?.studyHours || 0}</p>
            <p className="text-sm text-slate-600">Social Hours: {report?.summary?.socialHours || 0}</p>
            <p className="text-sm text-slate-600">Focus Score: {report?.summary?.focusScore || 0}</p>
          </section>

          <section className="rounded-2xl border border-sky-200 bg-white p-5 space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Module 7: Community Features</h2>
            <div className="flex items-center gap-2">
              <input value={confessionText} onChange={(e) => setConfessionText(e.target.value)} placeholder="Anonymous confession..." className="flex-1 px-3 py-2 rounded-lg border border-sky-200 text-sm" />
              <button onClick={addConfession} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">Post</button>
            </div>
            <ul className="text-sm text-slate-700 space-y-1">
              {confessions.slice(0, 5).map((post) => (
                <li key={post.id}>{post.message}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-sky-200 bg-white p-5 space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Module 8: Student Marketplace</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input value={listing.title} onChange={(e) => setListing({ ...listing, title: e.target.value })} placeholder="Product title" className="px-3 py-2 rounded-lg border border-sky-200 text-sm" />
              <input value={listing.price} type="number" onChange={(e) => setListing({ ...listing, price: Number(e.target.value || 0) })} placeholder="Price" className="px-3 py-2 rounded-lg border border-sky-200 text-sm" />
              <select value={listing.category} onChange={(e) => setListing({ ...listing, category: e.target.value })} className="px-3 py-2 rounded-lg border border-sky-200 text-sm">
                <option value="notes">Notes</option>
                <option value="ppt-template">PPT Templates</option>
                <option value="design">Designs</option>
                <option value="study-guide">Study Guides</option>
              </select>
              <button onClick={createListing} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">Create Listing</button>
            </div>
            <textarea value={listing.description} onChange={(e) => setListing({ ...listing, description: e.target.value })} placeholder="Description" className="w-full px-3 py-2 rounded-lg border border-sky-200 text-sm" />
            <ul className="text-sm text-slate-700 space-y-1">
              {marketplace.slice(0, 5).map((item) => (
                <li key={item.id}>{item.title} - ${item.price} ({item.category})</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudyModulesPage;
