import React from 'react';
import { ResumeData, TemplateConfig } from '../types';
import { MapPin, Mail, Phone, Linkedin } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  config: TemplateConfig;
  targetRef?: React.RefObject<HTMLDivElement | null>;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, config, targetRef }) => {
  const { personalInfo, experience, education, skills } = data;

  // Dynamic Styles based on Config
  const primaryColor = config.primaryColor;
  const fontClass = config.fontFamily === 'serif' 
    ? 'font-serif' 
    : config.fontFamily === 'poppins' 
      ? 'font-poppins' 
      : 'font-sans';

  // Common container styles for A4
  // 210mm x 297mm is standard A4.
  // We use 296mm for minHeight to provide a 1mm buffer.
  // This prevents html2pdf from creating a second blank page due to sub-pixel rounding errors.
  const containerStyle = {
    width: '210mm',
    minHeight: '296mm', 
    backgroundColor: 'white',
  };

  // --- MODERN TEMPLATE ---
  if (config.id === 'modern') {
    return (
      <div 
        ref={targetRef} 
        id="resume-preview-node"
        style={containerStyle}
        className={`flex text-gray-800 ${fontClass}`}
      >
        {/* Sidebar */}
        <div className="w-1/3 p-8 text-white" style={{ backgroundColor: primaryColor }}>
          <div className="mb-8 break-words">
            <h1 className="text-3xl font-bold uppercase leading-tight">{personalInfo.fullName}</h1>
            <p className="opacity-90 mt-2">{personalInfo.location}</p>
          </div>

          <div className="space-y-4 text-sm opacity-90 mb-8 break-words">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail size={14} className="shrink-0" /> <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="shrink-0" /> <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin size={14} className="shrink-0" /> <span>{personalInfo.linkedin}</span>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold border-b border-white/40 pb-1 mb-3">Education</h3>
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id}>
                  <p className="font-semibold">{edu.school}</p>
                  <p className="text-sm">{edu.degree}</p>
                  <p className="text-xs opacity-75">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold border-b border-white/40 pb-1 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className="text-sm bg-white/20 px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-8 bg-white">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800" style={{ color: primaryColor }}>Profile</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{personalInfo.summary}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800" style={{ color: primaryColor }}>Experience</h2>
            <div className="space-y-6">
              {experience.map(exp => (
                <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: primaryColor }}>
                  <div className="mb-1">
                    <h3 className="text-lg font-bold text-gray-800">{exp.role}</h3>
                    <div className="flex justify-between items-center text-sm text-gray-500 font-medium">
                      <span>{exp.company}</span>
                      <span>{exp.startDate} - {exp.endDate}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm whitespace-pre-line mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- CLASSIC TEMPLATE ---
  if (config.id === 'classic') {
    return (
      <div 
        ref={targetRef}
        id="resume-preview-node"
        style={containerStyle}
        className={`p-12 text-gray-800 ${fontClass}`}
      >
        <header className="border-b-2 pb-6 mb-8 text-center" style={{ borderColor: primaryColor }}>
          <h1 className="text-4xl font-bold mb-2 uppercase tracking-wide" style={{ color: primaryColor }}>{personalInfo.fullName}</h1>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>| {personalInfo.phone}</span>}
            {personalInfo.location && <span>| {personalInfo.location}</span>}
            {personalInfo.linkedin && <span>| {personalInfo.linkedin}</span>}
          </div>
        </header>

        {personalInfo.summary && (
          <section className="mb-6">
            <h3 className="text-lg font-bold uppercase tracking-wider mb-3 border-b border-gray-200 pb-1">Professional Summary</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{personalInfo.summary}</p>
          </section>
        )}

        <section className="mb-6">
          <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">Experience</h3>
          <div className="space-y-5">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-lg">{exp.role}</h4>
                  <span className="text-sm font-semibold text-gray-600">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="text-gray-700 font-medium mb-2">{exp.company}</div>
                <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex gap-8">
          <section className="flex-1">
            <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">Education</h3>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="font-bold">{edu.school}</div>
                  <div className="text-sm">{edu.degree}</div>
                  <div className="text-sm text-gray-500">{edu.year}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex-1">
            <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">Skills</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 grid grid-cols-2 gap-1">
              {skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    );
  }

  // --- MINIMALIST TEMPLATE ---
  return (
    <div 
      ref={targetRef}
      id="resume-preview-node"
      style={containerStyle}
      className={`p-10 text-gray-800 ${fontClass}`}
    >
      <div className="flex justify-between items-end mb-12 border-b pb-4">
        <div>
          <h1 className="text-5xl font-light mb-2 text-gray-900">{personalInfo.fullName}</h1>
          <p className="text-xl font-light text-gray-500">{experience[0]?.role || 'Professional'}</p>
        </div>
        <div className="text-right text-sm text-gray-500 space-y-1">
          <p>{personalInfo.email}</p>
          <p>{personalInfo.phone}</p>
          <p>{personalInfo.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8">
          {personalInfo.summary && (
             <div className="mb-10">
               <h3 className="uppercase tracking-widest text-xs font-bold text-gray-400 mb-4">Profile</h3>
               <p className="text-gray-700 leading-relaxed whitespace-pre-line">{personalInfo.summary}</p>
             </div>
          )}

          <div>
             <h3 className="uppercase tracking-widest text-xs font-bold text-gray-400 mb-6">Experience</h3>
             <div className="space-y-8">
                {experience.map(exp => (
                  <div key={exp.id}>
                    <h4 className="font-bold text-lg text-gray-800">{exp.company}</h4>
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                       <span className="italic">{exp.role}</span>
                       <span>{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="col-span-4 border-l pl-8 border-gray-100">
           <div className="mb-10">
              <h3 className="uppercase tracking-widest text-xs font-bold text-gray-400 mb-4">Education</h3>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id}>
                    <p className="font-bold text-sm text-gray-800">{edu.school}</p>
                    <p className="text-sm text-gray-600">{edu.degree}</p>
                    <p className="text-xs text-gray-400">{edu.year}</p>
                  </div>
                ))}
              </div>
           </div>

           <div>
              <h3 className="uppercase tracking-widest text-xs font-bold text-gray-400 mb-4">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                 {skills.map((skill, i) => (
                   <span key={i} className="text-sm text-gray-600 border border-gray-200 px-2 py-1 rounded-full">
                     {skill}
                   </span>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;