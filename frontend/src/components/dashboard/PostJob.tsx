import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Briefcase, MapPin, DollarSign, Trash2, Edit2 } from 'lucide-react';
import { jobService, type Job } from '../../services/api';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'] as const;

const PostJob: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<string>('Full-time');
  const [description, setDescription] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [requirements, setRequirements] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await jobService.mine();
      setJobs(data.jobs);
    } catch {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await jobService.create({
        title,
        companyName,
        location,
        type,
        description,
        salaryRange,
        requirements: requirements.split('\n').map(r => r.trim()).filter(Boolean)
      });

      setSuccess('Job posted successfully!');
      setShowForm(false);
      resetForm();
      fetchJobs();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to deactivate this job listing?')) return;
    try {
      await jobService.remove(jobId);
      setJobs(jobs.filter(j => j._id !== jobId));
      setSuccess('Job deactivated');
    } catch {
      setError('Failed to deactivate job');
    }
  };

  const resetForm = () => {
    setTitle('');
    setCompanyName('');
    setLocation('');
    setType('Full-time');
    setDescription('');
    setSalaryRange('');
    setRequirements('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Job Listings</h2>
          <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">Manage your job postings</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          Post New Job
        </button>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm font-medium border border-red-500/30 bg-red-500/10 text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl px-4 py-3 text-sm font-medium border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          {success}
        </div>
      )}

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-4"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Job Listing</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Job Title *</span>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Frontend Developer" className="dark-input mt-1" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Company Name</span>
              <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                placeholder="Your company name" className="dark-input mt-1" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Location</span>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                placeholder="e.g. New York, NY / Remote" className="dark-input mt-1" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Job Type</span>
              <select value={type} onChange={e => setType(e.target.value)}
                className="dark-input mt-1">
                {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Salary Range</span>
              <input type="text" value={salaryRange} onChange={e => setSalaryRange(e.target.value)}
                placeholder="e.g. $80,000 - $120,000" className="dark-input mt-1" />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Description</span>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              rows={4} placeholder="Describe the role, responsibilities, and team..."
              className="dark-input mt-1" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Requirements (one per line)</span>
            <textarea value={requirements} onChange={e => setRequirements(e.target.value)}
              rows={3} placeholder="3+ years React experience&#10;TypeScript proficiency&#10;REST API experience"
              className="dark-input mt-1" />
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className={`btn-primary px-6 py-2 text-sm ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {saving ? 'Posting...' : 'Post Job'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
              className="px-6 py-2 text-sm rounded-lg border border-black/10 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5">
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl p-12 text-center bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10">
          <Briefcase className="h-12 w-12 mx-auto text-slate-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No job listings yet</h3>
          <p className="text-sm text-slate-600 dark:text-gray-400">Click "Post New Job" to create your first listing.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map(job => (
            <motion.div key={job._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-xl p-5 bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 ${!job.isActive ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-600 dark:text-gray-400">
                    {job.location && (
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{job.type}</span>
                    {job.salaryRange && (
                      <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{job.salaryRange}</span>
                    )}
                    {!job.isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-medium">Inactive</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDelete(job._id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 dark:text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {job.description && (
                <p className="mt-3 text-sm text-slate-600 dark:text-gray-400 line-clamp-2">{job.description}</p>
              )}
              <p className="mt-2 text-xs text-slate-500 dark:text-gray-500">
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostJob;
