import React from 'react';
import { Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';

const Jobs: React.FC = () => {
  const jobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      location: 'Remote',
      salary: '$120k - $150k',
      type: 'Full-time',
      posted: '2 days ago',
      match: 95
    },
    {
      id: 2,
      title: 'Frontend Engineer',
      company: 'StartupX',
      location: 'New York, NY',
      salary: '$100k - $130k',
      type: 'Hybrid',
      posted: '1 week ago',
      match: 88
    },
    {
      id: 3,
      title: 'UI/UX Developer',
      company: 'DesignStudio',
      location: 'San Francisco, CA',
      salary: '$110k - $140k',
      type: 'Contract',
      posted: '3 days ago',
      match: 75
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Job Recommendations</h2>
          <p className="text-slate-400">Curated opportunities based on your profile and skills.</p>
        </div>
        <div className="flex space-x-2">
          <button className="saas-button-secondary">Filters</button>
          <button className="saas-button-primary">Saved Jobs</button>
        </div>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="saas-card p-6 hover:border-primary/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${
                job.match >= 90 ? 'bg-success/10 text-success border-success/20' :
                job.match >= 80 ? 'bg-primary/10 text-primary border-primary/20' : 'bg-warning/10 text-warning border-warning/20'
              }`}>
                {job.match}% Match
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-800/50 rounded-lg flex items-center justify-center text-slate-200 font-bold text-xl border border-slate-700/50 group-hover:scale-110 transition-transform shadow-none">
                {job.company.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-200 group-hover:text-primary transition-colors">{job.title}</h3>
                <p className="text-slate-400 text-sm mb-3">{job.company}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
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
              
              <button className="self-center saas-button-secondary opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-300">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
