import React, { useEffect, useMemo, useState } from 'react';
import { Assessment, TopStudent, assessmentService } from '../services/api';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

const initialForm = {
  title: '',
  category: '',
  duration: '30 minutes',
  questionsCount: 10,
  difficulty: 'Medium' as Difficulty,
  color: 'blue'
};

const AdminPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const sortedAssessments = useMemo(
    () => [...assessments].sort((a, b) => a.id - b.id),
    [assessments]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [assessmentRows, topStudentRows] = await Promise.all([
        assessmentService.getAll(),
        assessmentService.getTopStudents(5)
      ]);

      setAssessments(assessmentRows || []);
      setTopStudents(topStudentRows || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      setError('');
      setSuccess('');

      const created = await assessmentService.create({
        title: form.title.trim(),
        category: form.category.trim(),
        duration: form.duration.trim(),
        questionsCount: Number(form.questionsCount),
        difficulty: form.difficulty,
        color: form.color.trim() || 'blue'
      });

      setAssessments((prev) => [...prev, created]);
      setForm(initialForm);
      setSuccess('Assessment created successfully');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to create assessment');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAssessment = async (assessmentId: number, title: string) => {
    const shouldDelete = window.confirm(`Delete assessment "${title}" (ID: ${assessmentId})?`);
    if (!shouldDelete) return;

    try {
      setDeletingId(assessmentId);
      setError('');
      setSuccess('');

      await assessmentService.remove(assessmentId);
      setAssessments((prev) => prev.filter((item) => item.id !== assessmentId));
      setSuccess('Assessment deleted successfully');
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to delete assessment');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 sm:p-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 text-slate-600">Manage assessments and track top student performance.</p>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}
        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-1">
            <h2 className="text-xl font-semibold text-slate-900">Add Assessment</h2>

            <form className="mt-4 space-y-3" onSubmit={handleCreateAssessment}>
              <input
                required
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Assessment title"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
              />
              <input
                required
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="Category"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
              />
              <input
                required
                value={form.duration}
                onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                placeholder="Duration (e.g. 45 minutes)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
              />
              <input
                required
                min={1}
                type="number"
                value={form.questionsCount}
                onChange={(e) => setForm((prev) => ({ ...prev, questionsCount: Number(e.target.value) || 0 }))}
                placeholder="Question count"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
              />

              <select
                value={form.difficulty}
                onChange={(e) => setForm((prev) => ({ ...prev, difficulty: e.target.value as Difficulty }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <input
                value={form.color}
                onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
                placeholder="Color (optional)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
              />

              <button
                type="submit"
                disabled={creating}
                className="w-full rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? 'Adding...' : 'Add Assessment'}
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
            <h2 className="text-xl font-semibold text-slate-900">Assessments</h2>
            <p className="mt-1 text-sm text-slate-500">Create and remove assessments from here.</p>

            {loading ? (
              <div className="mt-4 text-sm text-slate-500">Loading assessments...</div>
            ) : sortedAssessments.length === 0 ? (
              <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                No assessments available.
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="px-3 py-2 font-medium">ID</th>
                      <th className="px-3 py-2 font-medium">Title</th>
                      <th className="px-3 py-2 font-medium">Category</th>
                      <th className="px-3 py-2 font-medium">Difficulty</th>
                      <th className="px-3 py-2 font-medium">Questions</th>
                      <th className="px-3 py-2 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAssessments.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 text-slate-700">
                        <td className="px-3 py-3">{item.id}</td>
                        <td className="px-3 py-3 font-medium text-slate-900">{item.title}</td>
                        <td className="px-3 py-3">{item.category}</td>
                        <td className="px-3 py-3">{item.difficulty}</td>
                        <td className="px-3 py-3">{item.questionsCount}</td>
                        <td className="px-3 py-3">
                          <button
                            type="button"
                            disabled={deletingId === item.id}
                            onClick={() => handleDeleteAssessment(item.id, item.title)}
                            className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === item.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-3">
            <h2 className="text-xl font-semibold text-slate-900">Top Students</h2>
            <p className="mt-1 text-sm text-slate-500">Students with the best average assessment scores.</p>

            {loading ? (
              <div className="mt-4 text-sm text-slate-500">Loading student rankings...</div>
            ) : topStudents.length === 0 ? (
              <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                No completed assessment scores yet.
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="px-3 py-2 font-medium">Rank</th>
                      <th className="px-3 py-2 font-medium">Student</th>
                      <th className="px-3 py-2 font-medium">Email</th>
                      <th className="px-3 py-2 font-medium">Avg Score</th>
                      <th className="px-3 py-2 font-medium">Best Score</th>
                      <th className="px-3 py-2 font-medium">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topStudents.map((student, index) => (
                      <tr key={student.userId} className="border-b border-slate-100 text-slate-700">
                        <td className="px-3 py-3 font-semibold text-slate-900">#{index + 1}</td>
                        <td className="px-3 py-3">{student.name || 'Unknown Student'}</td>
                        <td className="px-3 py-3">{student.email || '-'}</td>
                        <td className="px-3 py-3">{student.averageScore}%</td>
                        <td className="px-3 py-3">{student.bestScore}%</td>
                        <td className="px-3 py-3">{student.completedAssessments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
