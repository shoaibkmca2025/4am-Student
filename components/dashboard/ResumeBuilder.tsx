import React, { useState, useEffect } from 'react';
import { Save, Download, Plus, Trash2, Wand2, Lightbulb, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResumeHeader {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
}

interface Suggestion {
  id: string;
  message: string;
  type: 'improvement' | 'warning' | 'success';
  applyFix?: () => void;
  fixed?: boolean;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string;
}

interface Skills {
  technical: string;
  soft: string;
}

interface ResumeData {
  header: ResumeHeader;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skills;
}

const initialResumeState: ResumeData = {
  header: {
    fullName: 'Alex Johnson',
    title: 'Computer Science Student | Full Stack Developer',
    email: 'alex.johnson@university.edu',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    website: 'linkedin.com/in/alexjohnson',
    summary: 'Motivated Computer Science senior with a strong foundation in React, Node.js, and cloud technologies. Passionate about building scalable web applications and solving complex problems. Proven track record of delivering high-quality code in hackathons and internships.',
  },
  experience: [
    {
      id: '1',
      company: 'TechFlow Solutions',
      role: 'Software Engineering Intern',
      startDate: '2024-06-01',
      endDate: '2024-08-30',
      current: false,
      description: 'Developed a new feature for the company\'s flagship SaaS product using React and Redux. Optimized API endpoints, reducing response time by 20%. Collaborated with a team of 5 engineers in an Agile environment.',
    },
    {
      id: '2',
      company: 'University AI Lab',
      role: 'Research Assistant',
      startDate: '2023-09-01',
      endDate: '2024-05-15',
      current: false,
      description: 'Assisted in data preprocessing and model training for a natural language processing project. Implemented Python scripts to automate data collection from various sources.',
    }
  ],
  education: [
    {
      id: '1',
      school: 'State University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2021-09-01',
      endDate: '2025-05-30',
      current: true,
      description: 'GPA: 3.8/4.0. Relevant Coursework: Data Structures, Algorithms, Database Systems, Web Development, Artificial Intelligence.',
    }
  ],
  projects: [
    {
      id: '1',
      name: 'StudyBuddy',
      description: 'A real-time collaboration platform for students to share notes and study together.',
      url: 'github.com/alexjohnson/studybuddy',
      technologies: 'React, Node.js, Socket.io, MongoDB',
    },
    {
      id: '2',
      name: 'EcoTrack',
      description: 'A mobile-responsive web app for tracking personal carbon footprint and suggesting eco-friendly habits.',
      url: 'github.com/alexjohnson/ecotrack',
      technologies: 'Vue.js, Firebase, Chart.js',
    }
  ],
  skills: {
    technical: 'JavaScript, TypeScript, React, Node.js, Python, SQL, Git, AWS, Docker, HTML/CSS',
    soft: 'Problem Solving, Team Collaboration, Agile Methodology, Communication, Time Management',
  },
};

const ResumeBuilder: React.FC = () => {
  const [activeSection, setActiveSection] = useState('header');
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeState);
  const [isSaving, setIsSaving] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // Simulated AI Analysis
  useEffect(() => {
    analyzeResume();
  }, [resumeData, activeSection]);

  const analyzeResume = () => {
    const newSuggestions: Suggestion[] = [];

    if (activeSection === 'header') {
      if (resumeData.header.summary.length > 300) {
        newSuggestions.push({
          id: 'summary-length',
          message: 'Summary is too long. Keep it under 3 lines for better readability.',
          type: 'warning',
          applyFix: () => {
             setResumeData(prev => ({
               ...prev,
               header: { ...prev.header, summary: prev.header.summary.substring(0, 250) + '.' }
             }));
          }
        });
      }
      if (!resumeData.header.summary.includes('passionate') && !resumeData.header.summary.includes('proven')) {
         newSuggestions.push({
            id: 'summary-power-words',
            message: 'Use power words like "Passionate" or "Proven track record".',
            type: 'improvement',
            applyFix: () => {
               setResumeData(prev => ({
                  ...prev,
                  header: { ...prev.header, summary: 'Passionate ' + prev.header.summary.charAt(0).toLowerCase() + prev.header.summary.slice(1) }
               }));
            }
         });
      }
    }

    if (activeSection === 'experience') {
       resumeData.experience.forEach((exp, idx) => {
          if (exp.description && !exp.description.match(/\d+%/)) {
             newSuggestions.push({
                id: `exp-metrics-${idx}`,
                message: `Add specific metrics to ${exp.company} role (e.g., "improved by 20%").`,
                type: 'improvement',
                applyFix: () => {
                   updateExperience(exp.id, 'description', exp.description + ' Resulted in a 15% improvement in overall efficiency.');
                }
             });
          }
          if (exp.description && exp.description.startsWith('Worked on')) {
             newSuggestions.push({
                id: `exp-verb-${idx}`,
                message: `Replace weak verb "Worked on" with "Architected" or "Developed".`,
                type: 'warning',
                applyFix: () => {
                   updateExperience(exp.id, 'description', exp.description.replace('Worked on', 'Architected'));
                }
             });
          }
       });
    }

    setSuggestions(newSuggestions);
  };

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    setTimeout(() => setIsSaving(false), 1500);
  };

  const handleExport = () => {
    window.print();
  };

  const handleAIEnhance = () => {
    if (activeSection === 'header') {
      const enhancements = [
        " Experienced in building scalable applications.",
        " Proficient in modern web technologies.",
        " Strong problem-solving skills.",
        " Dedicated to writing clean, maintainable code."
      ];
      const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
      
      setResumeData(prev => ({
        ...prev,
        header: {
          ...prev.header,
          summary: prev.header.summary + randomEnhancement
        }
      }));
    } else {
      // For other sections, we'll just simulate an enhancement effect
      // In a real app, this would call an API
    }
  };

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      header: { ...prev.header, [name]: value },
    }));
  };

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: crypto.randomUUID(),
          company: '',
          role: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: crypto.randomUUID(),
          school: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: crypto.randomUUID(),
          name: '',
          description: '',
          url: '',
          technologies: '',
        },
      ],
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const removeProject = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  };

  const handleSkillsChange = (field: keyof Skills, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-200">Resume Builder</h2>
          <p className="text-slate-400 mt-1">Create an ATS-optimized resume with AI assistance</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleSave}
            className="saas-button-secondary flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saved!' : 'Save Draft'}</span>
          </button>
          <button 
            onClick={handleExport}
            className="saas-button-primary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-2">
          <div className="saas-card p-2 sticky top-24 space-y-1">
            {['Header', 'Experience', 'Education', 'Projects', 'Skills'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section.toLowerCase())}
                className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 text-xs font-medium flex items-center justify-between group ${
                  activeSection === section.toLowerCase()
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <span>{section}</span>
                {activeSection === section.toLowerCase() && (
                  <motion.div
                    layoutId="active-pill"
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Form Area */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="saas-card p-6 min-h-[500px]"
          >
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-slate-200 capitalize flex items-center gap-2">
                 {activeSection}
                 <span className="text-[10px] font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                    AI Optimized
                 </span>
              </h3>
              <button 
                onClick={handleAIEnhance}
                className="flex items-center space-x-2 text-white bg-indigo-600 hover:bg-indigo-500 text-xs font-bold px-3 py-1.5 rounded-md transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Auto-Enhance</span>
              </button>
            </div>

            {activeSection === 'header' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={resumeData.header.fullName}
                    onChange={handleHeaderChange}
                    className="saas-input w-full"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Job Title</label>
                  <input
                    type="text"
                    name="title"
                    value={resumeData.header.title}
                    onChange={handleHeaderChange}
                    className="saas-input w-full"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={resumeData.header.email}
                    onChange={handleHeaderChange}
                    className="saas-input w-full"
                    placeholder="e.g. john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={resumeData.header.phone}
                    onChange={handleHeaderChange}
                    className="saas-input w-full"
                    placeholder="e.g. +1 234 567 890"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-slate-400">Professional Summary</label>
                  <textarea
                    name="summary"
                    value={resumeData.header.summary}
                    onChange={handleHeaderChange}
                    className="saas-input w-full h-32 resize-none"
                    placeholder="Briefly describe your professional background and goals..."
                  />
                </div>
              </div>
            )}

            {activeSection === 'experience' && (
              <div className="space-y-6">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id} className="p-6 rounded-lg bg-slate-800/30 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors group">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Role</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                          className="saas-input w-full"
                          placeholder="Job Title"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          className="saas-input w-full"
                          placeholder="Company Name"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          className="saas-input w-full"
                          placeholder="e.g. Jan 2022"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          className="saas-input w-full"
                          placeholder="Present or e.g. Dec 2023"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Description</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        className="saas-input w-full h-24 resize-none"
                        placeholder="Describe your responsibilities and achievements..."
                      />
                    </div>
                    <div className="flex justify-end pt-2 border-t border-slate-800/50 mt-4">
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-slate-500 hover:text-error text-xs font-medium flex items-center space-x-1.5 px-3 py-1.5 rounded hover:bg-error/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addExperience}
                  className="w-full py-3 rounded-lg border border-dashed border-slate-700 text-slate-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Add Experience</span>
                </button>
              </div>
            )}

            {activeSection === 'education' && (
              <div className="space-y-6">
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="p-6 rounded-lg bg-slate-800/30 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors group">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">School</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                          className="saas-input w-full"
                          placeholder="University / School"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          className="saas-input w-full"
                          placeholder="Degree / Certificate"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Field of Study</label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                          className="saas-input w-full"
                          placeholder="Major / Field"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Start</label>
                          <input
                            type="text"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                            className="saas-input w-full"
                            placeholder="Year"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">End</label>
                          <input
                            type="text"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                            className="saas-input w-full"
                            placeholder="Year"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2 border-t border-slate-800/50 mt-4">
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="text-slate-500 hover:text-error text-xs font-medium flex items-center space-x-1.5 px-3 py-1.5 rounded hover:bg-error/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addEducation}
                  className="w-full py-3 rounded-lg border border-dashed border-slate-700 text-slate-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Add Education</span>
                </button>
              </div>
            )}

            {activeSection === 'projects' && (
              <div className="space-y-6">
                {resumeData.projects.map((proj) => (
                  <div key={proj.id} className="p-6 rounded-lg bg-slate-800/30 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors group">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Project Name</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                          className="saas-input w-full"
                          placeholder="Name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">URL</label>
                        <input
                          type="text"
                          value={proj.url}
                          onChange={(e) => updateProject(proj.id, 'url', e.target.value)}
                          className="saas-input w-full"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Technologies</label>
                      <input
                        type="text"
                        value={proj.technologies}
                        onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                        className="saas-input w-full"
                        placeholder="React, Node.js, etc."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Description</label>
                      <textarea
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                        className="saas-input w-full h-24 resize-none"
                        placeholder="Describe the project..."
                      />
                    </div>
                    <div className="flex justify-end pt-2 border-t border-slate-800/50 mt-4">
                      <button
                        onClick={() => removeProject(proj.id)}
                        className="text-slate-500 hover:text-error text-xs font-medium flex items-center space-x-1.5 px-3 py-1.5 rounded hover:bg-error/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addProject}
                  className="w-full py-3 rounded-lg border border-dashed border-slate-700 text-slate-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Add Project</span>
                </button>
              </div>
            )}

            {activeSection === 'skills' && (
              <div className="space-y-6">
                <div className="p-6 rounded-lg bg-slate-800/30 border border-slate-800 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Technical Skills</label>
                    <textarea
                      value={resumeData.skills.technical}
                      onChange={(e) => handleSkillsChange('technical', e.target.value)}
                      className="saas-input w-full h-32 resize-none"
                      placeholder="e.g. React, TypeScript, Node.js, Python, AWS..."
                    />
                    <p className="text-xs text-slate-500">Separate skills with commas</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Soft Skills</label>
                    <textarea
                      value={resumeData.skills.soft}
                      onChange={(e) => handleSkillsChange('soft', e.target.value)}
                      className="saas-input w-full h-32 resize-none"
                      placeholder="e.g. Leadership, Communication, Problem Solving..."
                    />
                    <p className="text-xs text-slate-500">Separate skills with commas</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
        {/* AI Feedback Sidebar */}
        <div className="lg:col-span-3 space-y-4">
            <div className="sticky top-24">
                <div className="saas-card p-4 border-indigo-500/20 bg-indigo-500/5">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                            <Lightbulb className="w-4 h-4 text-indigo-400" />
                        </div>
                        <h4 className="font-bold text-slate-200 text-sm">AI Suggestions</h4>
                    </div>

                    <div className="space-y-3">
                        <AnimatePresence mode='popLayout'>
                            {suggestions.length > 0 ? (
                                suggestions.map((suggestion) => (
                                    <motion.div
                                        key={suggestion.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className={`p-3 rounded-lg border text-xs ${
                                            suggestion.type === 'warning' 
                                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' 
                                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                                        }`}
                                    >
                                        <div className="flex gap-2 items-start">
                                            {suggestion.type === 'warning' ? (
                                                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
                                            ) : (
                                                <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-400" />
                                            )}
                                            <div>
                                                <p className="leading-snug mb-2">{suggestion.message}</p>
                                                {suggestion.applyFix && (
                                                    <button 
                                                        onClick={() => {
                                                            suggestion.applyFix?.();
                                                            // Optimistically remove suggestion
                                                            setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
                                                        }}
                                                        className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                                            suggestion.type === 'warning'
                                                            ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300'
                                                            : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300'
                                                        }`}
                                                    >
                                                        <Wand2 className="w-3 h-3" />
                                                        Apply Fix
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-500">
                                    <Check className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    <p className="text-xs">Great job! No suggestions for this section.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="saas-card p-4 bg-slate-900/50">
                    <h4 className="font-bold text-slate-300 text-xs mb-3 uppercase tracking-wider">ATS Strength</h4>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-400">Keywords</span>
                                <span className="text-emerald-400 font-bold">Good</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-emerald-500 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-400">Formatting</span>
                                <span className="text-indigo-400 font-bold">Excellent</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full w-[95%] bg-indigo-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
