import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { applicationService, type Application } from '../../services/api';

const STATUS_COLORS: Record<string, string> = {
  Submitted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Reviewed: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Interview: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  Offered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
};

const STATUS_OPTIONS: Application['status'][] = ['Reviewed', 'Interview', 'Rejected', 'Offered'];

const ManageApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await applicationService.companyRecent();
      setApplications(data.applications);
    } catch {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId: string, status: Application['status']) => {
    setError('');
    setSuccess('');
    try {
      const data = await applicationService.updateStatus(appId, status);
      setApplications(apps => apps.map(a => a._id === appId ? { ...a, status: data.application.status } : a));
      setSuccess(`Application marked as ${status}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Applications</h2>
        <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">Review and manage candidate applications</p>
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-2xl p-12 text-center bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10">
          <Users className="h-12 w-12 mx-auto text-slate-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No applications yet</h3>
          <p className="text-sm text-slate-600 dark:text-gray-400">Applications will appear here when students apply to your jobs.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map(app => {
            const jobTitle = typeof app.jobId === 'object' && app.jobId !== null
              ? (app.jobId as any).title || 'Unknown Job'
              : 'Job';
            const isExpanded = expandedId === app._id;

            return (
              <motion.div key={app._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 overflow-hidden"
              >
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : app._id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{jobTitle}</p>
                      <p className="text-xs text-slate-500 dark:text-gray-500">
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[app.status] || ''}`}>
                      {app.status}
                    </span>
                    <Eye className="h-4 w-4 text-slate-400 dark:text-gray-500" />
                  </div>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-black/10 dark:border-white/10 p-4 space-y-4"
                  >
                    {app.coverLetter && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase mb-1">Cover Letter</p>
                        <p className="text-sm text-slate-700 dark:text-gray-300 whitespace-pre-wrap">{app.coverLetter}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase mb-2">Update Status</p>
                      <div className="flex flex-wrap gap-2">
                        {STATUS_OPTIONS.map(status => (
                          <button
                            key={status}
                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(app._id, status); }}
                            disabled={app.status === status}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                              app.status === status
                                ? 'opacity-50 cursor-not-allowed border-black/10 dark:border-white/10'
                                : 'hover:bg-primary/10 hover:text-primary hover:border-primary/30 border-black/10 dark:border-white/10 text-slate-600 dark:text-gray-400'
                            }`}
                          >
                            {status === 'Interview' && <Clock className="inline h-3 w-3 mr-1" />}
                            {status === 'Offered' && <CheckCircle className="inline h-3 w-3 mr-1" />}
                            {status === 'Rejected' && <XCircle className="inline h-3 w-3 mr-1" />}
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageApplications;
