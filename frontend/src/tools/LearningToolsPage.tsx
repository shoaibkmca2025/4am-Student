import React, { useState } from 'react';
import extensionApi from '../services/extensions/extensionApi';

const LearningToolsPage: React.FC = () => {
  const [topic, setTopic] = useState('Data Structures');
  const [subject, setSubject] = useState('Computer Science');
  const [question, setQuestion] = useState('How do I solve dynamic programming problems faster?');
  const [result, setResult] = useState<any>(null);
  const [knowledge, setKnowledge] = useState('');
  const [alarmMinutes, setAlarmMinutes] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runTool = async (runner: () => Promise<any>) => {
    setLoading(true);
    setError('');
    try {
      const data = await runner();
      setResult(data.result || data.quickRevisionSheet || data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Tool execution failed.');
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

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Tools</h1>
          <p className="text-slate-600">AI Learning Tools and Viral Student Engagement Utilities.</p>
        </header>

        {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="rounded-2xl border border-sky-200 bg-white p-5 space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Module 5: AI Learning Tools</h2>
            <input value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-sky-200 text-sm" placeholder="Topic" />
            <textarea value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-sky-200 text-sm" placeholder="Homework question" />
            <div className="flex flex-wrap gap-2">
              <button onClick={() => runTool(() => extensionApi.assignmentGenerator({ topic, level: 'Undergraduate', length: 900 }))} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">Assignment Generator</button>
              <button onClick={() => runTool(() => extensionApi.notesGenerator({ topic }))} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">Notes Generator</button>
              <button onClick={() => runTool(() => extensionApi.presentationGenerator({ topic }))} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">Presentation Generator</button>
              <button onClick={() => runTool(() => extensionApi.homeworkHelper({ question }))} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">Homework Helper</button>
            </div>
          </section>

          <section className="rounded-2xl border border-sky-200 bg-white p-5 space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Module 6: Viral Engagement Tools</h2>
            <div className="flex flex-wrap gap-2">
              <button onClick={getRandomKnowledge} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm">Random Knowledge Button</button>
              <button onClick={() => runTool(() => extensionApi.examPanicSheet({ subject }))} className="px-3 py-2 rounded-lg bg-amber-600 text-white text-sm">Exam Panic Button</button>
              <button onClick={() => runTool(() => extensionApi.procrastinationAlarm({ minutes: alarmMinutes, message: 'Time to resume focused study.' }))} className="px-3 py-2 rounded-lg bg-rose-600 text-white text-sm">Procrastination Alarm</button>
            </div>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-sky-200 text-sm" placeholder="Subject for panic sheet" />
            <input type="number" value={alarmMinutes} onChange={(e) => setAlarmMinutes(Number(e.target.value || 0))} className="w-full px-3 py-2 rounded-lg border border-sky-200 text-sm" placeholder="Alarm minutes" />
            {knowledge && <p className="text-sm text-slate-700 border border-sky-200 rounded-lg bg-sky-50 px-3 py-2">{knowledge}</p>}
          </section>
        </div>

        <section className="rounded-2xl border border-sky-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Tool Output</h2>
          {loading ? (
            <p className="text-sm text-slate-600">Generating...</p>
          ) : (
            <pre className="text-xs whitespace-pre-wrap break-words bg-slate-50 border border-sky-200 rounded-lg p-3 overflow-auto max-h-[400px]">
              {result ? JSON.stringify(result, null, 2) : 'Run any tool to see output.'}
            </pre>
          )}
        </section>
      </div>
    </div>
  );
};

export default LearningToolsPage;
