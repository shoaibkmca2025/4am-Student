import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Assessment, TopStudent, assessmentService } from '../services/api';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

const initialForm = {
  title: '',
  category: '',
  duration: '30 minutes',
  questionsCount: 10,
  difficulty: 'Medium' as Difficulty,
  color: 'blue',
  questionsJson: '[]'
};

interface AdminPageProps {
  embedded?: boolean;
}

const AdminPage: React.FC<AdminPageProps> = ({ embedded = false }) => {
  const addFormRef = useRef<HTMLElement | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const sortedAssessments = useMemo(
    () => [...assessments].sort((a, b) => a.id - b.id),
    [assessments]
  );

  const parseQuestions = (): any[] => {
    const raw = form.questionsJson.trim();
    if (!raw) return [];

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error('Questions must be valid JSON.');
    }

    if (!Array.isArray(parsed)) {
      throw new Error('Questions JSON must be an array.');
    }

    const normalized = parsed.map((item: any, index: number) => {
      const type = item?.type || 'multiple-choice';
      if (!item?.question || typeof item.question !== 'string') {
        throw new Error(`Question ${index + 1} must include a valid question text.`);
      }

      const base = {
        id: Number.isFinite(Number(item?.id)) ? Number(item.id) : index + 1,
        type,
        question: item.question.trim(),
        explanation: typeof item?.explanation === 'string' ? item.explanation : undefined
      };

      if (type === 'multiple-choice') {
        if (!Array.isArray(item?.options) || item.options.length < 2) {
          throw new Error(`MCQ question ${index + 1} must include at least 2 options.`);
        }
        if (!Number.isFinite(Number(item?.correct))) {
          throw new Error(`MCQ question ${index + 1} must include a numeric correct index.`);
        }

        return {
          ...base,
          options: item.options.map((opt: any) => String(opt)),
          correct: Number(item.correct)
        };
      }

      if (type === 'code-challenge') {
        return {
          ...base,
          codeSnippet: typeof item?.codeSnippet === 'string' ? item.codeSnippet : '',
          correctAnswer: typeof item?.correctAnswer === 'string' ? item.correctAnswer : ''
        };
      }

      return {
        ...base,
        correctAnswer: typeof item?.correctAnswer === 'string' ? item.correctAnswer : ''
      };
    });

    return normalized;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const [assessmentResult, topStudentsResult] = await Promise.allSettled([
        assessmentService.getAll(),
        assessmentService.getTopStudents(5)
      ]);

      if (assessmentResult.status === 'fulfilled') {
        setAssessments(assessmentResult.value || []);
      } else {
        setAssessments([]);
        setError(
          assessmentResult.reason?.response?.data?.message ||
          'Failed to load assessments data'
        );
      }

      if (topStudentsResult.status === 'fulfilled') {
        setTopStudents(topStudentsResult.value || []);
      } else {
        setTopStudents([]);
        if (assessmentResult.status === 'fulfilled') {
          setSuccess('Assessments loaded. Student rankings are currently unavailable.');
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleAddSkillTestClick = () => {
    resetForm();
    addFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      setError('');
      setSuccess('');

      const questions = parseQuestions();

      const created = await assessmentService.create({
        title: form.title.trim(),
        category: form.category.trim(),
        duration: form.duration.trim(),
        questionsCount: questions.length > 0 ? questions.length : Number(form.questionsCount),
        difficulty: form.difficulty,
        color: form.color.trim() || 'blue',
        questions
      });

      setAssessments((prev) => [...prev, created]);
      resetForm();
      setSuccess('Skill test created successfully');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to create assessment');
    } finally {
      setCreating(false);
    }
  };

  const handleStartEdit = async (assessment: Assessment) => {
    if (!Number.isFinite(Number(assessment.id))) {
      setError('Assessment identifier missing.');
      return;
    }

    try {
      setError('');
      setSuccess('');

      const details = await assessmentService.getById(Number(assessment.id));
      setEditingId(details.id);
      setForm({
        title: details.title || '',
        category: details.category || '',
        duration: details.duration || '30 minutes',
        questionsCount: Number(details.questionsCount) || 1,
        difficulty: (details.difficulty || 'Medium') as Difficulty,
        color: details.color || 'blue',
        questionsJson: JSON.stringify(details.questions || [], null, 2)
      });
      addFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to load assessment questions');
    }
  };

  const handleUpdateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId === null) return;

    try {
      setUpdating(true);
      setError('');
      setSuccess('');

      const questions = parseQuestions();

      const updated = await assessmentService.update(editingId, {
        title: form.title.trim(),
        category: form.category.trim(),
        duration: form.duration.trim(),
        questionsCount: questions.length > 0 ? questions.length : Number(form.questionsCount),
        difficulty: form.difficulty,
        color: form.color.trim() || 'blue',
        questions
      });

      setAssessments((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
      setSuccess('Skill test updated successfully');
      resetForm();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to update assessment');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAssessment = async (assessment: Assessment) => {
    const lookupId = assessment.id ?? assessment._id;
    if (!lookupId) {
      setError('Assessment identifier missing. Unable to delete.');
      return;
    }

    const label = assessment.id ? `ID: ${assessment.id}` : `Doc ID: ${assessment._id}`;
    const shouldDelete = window.confirm(`Delete assessment "${assessment.title}" (${label})?`);
    if (!shouldDelete) return;

    try {
      setDeletingId(Number(assessment.id) || -1);
      setError('');
      setSuccess('');

      await assessmentService.remove(lookupId);
      setAssessments((prev) => prev.filter((item) => item.id !== assessment.id && item._id !== assessment._id));
      setSuccess('Skill test deleted successfully');
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to delete assessment');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={embedded ? '' : 'app-shell p-6 sm:p-10'}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="app-panel p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="mt-2 text-slate-600">Add and manage skill tests, then track top student performance.</p>
            </div>
            <button
              type="button"
              onClick={handleAddSkillTestClick}
              className="inline-flex items-center justify-center rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              Add Assessment / Skill Test
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}
        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section ref={addFormRef} className="app-panel p-6 xl:col-span-1">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingId === null ? 'Add Skill Test' : `Edit Skill Test #${editingId}`}
              </h2>
              {editingId !== null ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              ) : null}
            </div>

            <form className="mt-4 space-y-3" onSubmit={editingId === null ? handleCreateAssessment : handleUpdateAssessment}>
              <input
                required
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Skill test title"
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

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Questions JSON
                </label>
                <textarea
                  value={form.questionsJson}
                  onChange={(e) => setForm((prev) => ({ ...prev, questionsJson: e.target.value }))}
                  rows={10}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono outline-none transition focus:border-cyan-500"
                  placeholder='[{"id":1,"type":"multiple-choice","question":"...","options":["A","B"],"correct":0}]'
                />
                <p className="mt-1 text-xs text-slate-500">
                  Use valid JSON array. Supported types: multiple-choice, code-challenge, text-input.
                </p>
              </div>

              <button
                type="submit"
                disabled={creating || updating}
                className="w-full rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingId === null ? (creating ? 'Adding...' : 'Add Skill Test') : (updating ? 'Updating...' : 'Update Skill Test')}
              </button>
            </form>
          </section>

          <section className="app-panel p-6 xl:col-span-2">
            <h2 className="text-xl font-semibold text-slate-900">Manage Skill Tests</h2>
            <p className="mt-1 text-sm text-slate-500">Edit or remove existing tests from here.</p>

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
                      <tr key={item.id ?? item._id} className="border-b border-slate-100 text-slate-700">
                        <td className="px-3 py-3">{item.id ?? '-'}</td>
                        <td className="px-3 py-3 font-medium text-slate-900">{item.title}</td>
                        <td className="px-3 py-3">{item.category}</td>
                        <td className="px-3 py-3">{item.difficulty}</td>
                        <td className="px-3 py-3">{item.questionsCount}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(item)}
                              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              disabled={deletingId === item.id}
                              onClick={() => handleDeleteAssessment(item)}
                              className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deletingId === item.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="app-panel p-6 xl:col-span-3">
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
