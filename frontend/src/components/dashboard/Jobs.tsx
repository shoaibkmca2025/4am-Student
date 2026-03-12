import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Bookmark, Filter } from 'lucide-react';
import { jobService, userService } from '../../services/api';

interface JobsProps {
  setActiveTab?: (tab: string) => void;
}

const Jobs: React.FC<JobsProps> = ({ setActiveTab }) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<string>('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsData, userData] = await Promise.all([
          jobService.list(),
          userService.me().catch(() => ({ user: { savedJobs: [] } }))
        ]);

        const normalizedJobs = (jobsData.jobs || []).map((job: any) => {
          const posted = job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently posted';
          return {
            ...job,
            _id: job._id || job.id,
            id: job.id || job._id,
            title: job.title || job.role || 'Untitled role',
            company: job.company || job.companyName || 'Company',
            location: job.location || 'Remote',
            salary: job.salary || job.salaryRange || 'Competitive',
            posted,
            match: Number.isFinite(job.match) ? Number(job.match) : 82
          };
        });

        setJobs(normalizedJobs);
        setSavedJobIds((userData.user?.savedJobs || []).map((id: any) => String(id)));
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApply = async (jobId: string) => {
    try {
      await jobService.apply(jobId, {});
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Failed to apply for job", error);
      alert("Failed to apply for job.");
    }
  };

  const toggleSaveJob = async (jobId: string) => {
    try {
      if (savedJobIds.includes(jobId)) {
        await userService.unsaveJob(jobId);
        setSavedJobIds(prev => prev.filter(id => id !== jobId));
      } else {
        await userService.saveJob(jobId);
        setSavedJobIds(prev => [...prev, jobId]);
      }
    } catch (error) {
      console.error("Failed to toggle save job", error);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (showSavedOnly && !savedJobIds.includes(job._id || job.id)) return false;
    if (filterType !== 'All' && job.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {showSavedOnly ? 'Saved Jobs' : 'Job Recommendations'}
          </h2>
          <p className="text-slate-600">
            {showSavedOnly ? 'Your bookmarked opportunities.' : 'Curated opportunities will appear here.'}
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`saas-button-secondary flex items-center gap-2 ${showFilters ? 'bg-sky-200 text-slate-900' : ''}`}
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button 
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`saas-button-primary flex items-center gap-2 ${showSavedOnly ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
          >
            <Bookmark className={`w-4 h-4 ${showSavedOnly ? 'fill-current' : ''}`} />
            {showSavedOnly ? 'Show All' : 'Saved Jobs'}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-sky-100/50 p-4 rounded-xl border border-sky-200/50 mb-6 flex gap-4 animate-in slide-in-from-top-2">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-sky-200 text-slate-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
          >
            <option value="All">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      )}

      {filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-sky-100/30 rounded-2xl border border-sky-200/50">
            <Briefcase className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Jobs Found</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              {showSavedOnly 
                ? "You haven't saved any jobs yet." 
                : "Try adjusting your filters or complete your profile to see more matches."}
            </p>
            {!showSavedOnly && (
              <button 
                onClick={() => setActiveTab && setActiveTab('resume')}
                className="saas-button-primary"
              >
                Complete Profile
              </button>
            )}
        </div>
      ) : (
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const isSaved = savedJobIds.includes(job._id || job.id);
          return (
          <div key={job._id || job.id} className="saas-card p-6 hover:border-primary/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 flex gap-2 z-10">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${
                job.match >= 90 ? 'bg-success/10 text-success border-success/20' :
                job.match >= 80 ? 'bg-primary/10 text-primary border-primary/20' : 'bg-warning/10 text-warning border-warning/20'
              }`}>
                {job.match}% Match
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveJob(job._id || job.id);
                }}
                className={`p-1.5 rounded-full transition-all ${
                  isSaved 
                    ? 'text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-sky-200'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-sky-100/50 rounded-lg flex items-center justify-center text-slate-800 font-bold text-xl border border-sky-200/50 group-hover:scale-110 transition-transform shadow-none">
                {job.company.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">{job.title}</h3>
                <p className="text-slate-600 text-sm mb-3">{job.company}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    {job.type}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {job.posted}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => handleApply(job._id || job.id)}
                className="self-center saas-button-secondary opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-300"
              >
                Apply Now
              </button>
            </div>
          </div>
        )})}
      </div>
      )}
    </div>
  );
};

export default Jobs;


