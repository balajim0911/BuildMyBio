import React from 'react';
import { ResumeData, Experience, Education } from '../types';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ data, onChange }) => {
  const [activeSection, setActiveSection] = React.useState<string | null>('personal');

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Math.random().toString(36).substr(2, 9),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    onChange({ ...data, experience: [...data.experience, newExp] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    const updatedExp = data.experience.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onChange({ ...data, experience: updatedExp });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter((e) => e.id !== id) });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Math.random().toString(36).substr(2, 9),
      school: '',
      degree: '',
      year: '',
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    const updatedEdu = data.education.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onChange({ ...data, education: updatedEdu });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter((e) => e.id !== id) });
  };

  const updateSkills = (value: string) => {
    // Split by comma and filter empty
    const skillsArray = value.split(',').map(s => s.trim()).filter(s => s !== '');
    onChange({ ...data, skills: skillsArray });
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Common styles for all inputs
  const inputClasses = "p-2 border border-gray-200 rounded bg-[#f5f5f5] focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all w-full";

  return (
    <div className="space-y-4">
      
      {/* Personal Info */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <button
          onClick={() => toggleSection('personal')}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="font-semibold text-gray-700">Personal Information</span>
          {activeSection === 'personal' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {activeSection === 'personal' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className={inputClasses}
              value={data.personalInfo.fullName}
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className={inputClasses}
              value={data.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone"
              className={inputClasses}
              value={data.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            />
            <input
              type="text"
              placeholder="LinkedIn / Website"
              className={inputClasses}
              value={data.personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
            />
            <input
              type="text"
              placeholder="Location (City, Country)"
              className={`${inputClasses} md:col-span-2`}
              value={data.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
            />
            <textarea
              placeholder="Professional Summary"
              className={`${inputClasses} md:col-span-2 h-24 resize-y`}
              value={data.personalInfo.summary}
              onChange={(e) => updatePersonalInfo('summary', e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Experience */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <button
          onClick={() => toggleSection('experience')}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="font-semibold text-gray-700">Experience</span>
          {activeSection === 'experience' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {activeSection === 'experience' && (
          <div className="p-4 space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="p-4 border border-gray-100 rounded bg-gray-50 relative group">
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    placeholder="Company"
                    className={inputClasses}
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  />
                  <input
                    placeholder="Role"
                    className={inputClasses}
                    value={exp.role}
                    onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                  />
                  <input
                    placeholder="Start Date"
                    className={inputClasses}
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  />
                  <input
                    placeholder="End Date"
                    className={inputClasses}
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  />
                  <textarea
                    placeholder="Description (Bullet points recommended)"
                    className={`${inputClasses} md:col-span-2 h-20 resize-y`}
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addExperience}
              className="flex items-center text-brand-600 hover:text-brand-700 font-medium text-sm mt-2"
            >
              <Plus size={16} className="mr-1" /> Add Experience
            </button>
          </div>
        )}
      </div>

      {/* Education */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <button
          onClick={() => toggleSection('education')}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="font-semibold text-gray-700">Education</span>
          {activeSection === 'education' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {activeSection === 'education' && (
          <div className="p-4 space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id} className="p-4 border border-gray-100 rounded bg-gray-50 relative group">
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    placeholder="School / University"
                    className={inputClasses}
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                  />
                  <input
                    placeholder="Degree"
                    className={inputClasses}
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  />
                  <input
                    placeholder="Year"
                    className={inputClasses}
                    value={edu.year}
                    onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addEducation}
              className="flex items-center text-brand-600 hover:text-brand-700 font-medium text-sm mt-2"
            >
              <Plus size={16} className="mr-1" /> Add Education
            </button>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <button
          onClick={() => toggleSection('skills')}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="font-semibold text-gray-700">Skills</span>
          {activeSection === 'skills' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {activeSection === 'skills' && (
          <div className="p-4">
            <p className="text-xs text-gray-500 mb-2">Separate skills with commas</p>
            <textarea
              placeholder="Java, React, Team Leadership, Project Management..."
              className={`${inputClasses} h-24`}
              value={data.skills.join(', ')}
              onChange={(e) => updateSkills(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeForm;