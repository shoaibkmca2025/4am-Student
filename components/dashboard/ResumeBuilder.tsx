import React, { useState } from 'react';
import { Save, Download, Plus, Trash2, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResumeHeader {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
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

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3">
          <div className="saas-card p-2 sticky top-24 space-y-1">
            {['Header', 'Experience', 'Education', 'Projects', 'Skills'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section.toLowerCase())}
                className={`w-full text-left px-4 py-2.5 rounded-md transition-all duration-200 text-sm font-medium flex items-center justify-between group ${
                  activeSection === section.toLowerCase()
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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
        <div className="lg:col-span-9 space-y-6">
          <motion.div 
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="saas-card p-8"
          >
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-slate-200 capitalize">{activeSection}</h3>
              <button 
                onClick={handleAIEnhance}
                className="flex items-center space-x-2 text-primary hover:text-white hover:bg-primary text-xs font-medium bg-primary/10 px-3 py-1.5 rounded-md border border-primary/20 transition-all shadow-sm active:scale-95"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>AI Enhance</span>
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
      </div>
    </div>
  );
};

export default ResumeBuilder;
