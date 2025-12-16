import React from 'react';
import { ResumeData, TemplateConfig } from '../types';
import { MapPin, Mail, Phone, Linkedin, Globe, Briefcase, GraduationCap, Award } from 'lucide-react';

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
  const containerStyle = {
    width: '210mm',
    minHeight: '296mm', 
    backgroundColor: 'white',
    fontSize: `${config.fontSize}pt`, // Dynamic base font size
    lineHeight: 1.5,
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
        <div className="w-1/3 p-8 text-white flex flex-col gap-6" style={{ backgroundColor: primaryColor }}>
          <div className="break-words">
            <h1 className="text-3xl font-bold uppercase leading-tight mb-2">{personalInfo.fullName}</h1>
            <p className="opacity-90">{personalInfo.location}</p>
          </div>

          <div className="space-y-3 opacity-90 break-words">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail size={14} className="shrink-0" /> <span className="text-inherit">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="shrink-0" /> <span className="text-inherit">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin size={14} className="shrink-0" /> <span className="text-inherit">{personalInfo.linkedin}</span>
              </div>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-bold border-b border-white/40 pb-1 mb-3">Education</h3>
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id}>
                  <p className="font-semibold">{edu.school}</p>
                  <p>{edu.degree}</p>
                  <p className="opacity-75 text-[0.9em]">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold border-b border-white/40 pb-1 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className="bg-white/20 px-2 py-1 rounded text-[0.9em]">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-8 bg-white">
          {personalInfo.summary && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3 uppercase tracking-wider" style={{ color: primaryColor }}>Profile</h2>
              <p className="text-gray-600 whitespace-pre-line">{personalInfo.summary}</p>
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: primaryColor }}>Experience</h2>
            <div className="space-y-6">
              {experience.map(exp => (
                <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: primaryColor }}>
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{exp.role}</h3>
                    <div className="flex justify-between items-center text-gray-500 font-medium">
                      <span>{exp.company}</span>
                      <span className="text-[0.9em]">{exp.startDate} - {exp.endDate}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 whitespace-pre-line mt-2">{exp.description}</p>
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
          <h1 className="text-4xl font-bold mb-3 uppercase tracking-wide" style={{ color: primaryColor }}>{personalInfo.fullName}</h1>
          <div className="flex flex-wrap justify-center gap-4 text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>| {personalInfo.phone}</span>}
            {personalInfo.location && <span>| {personalInfo.location}</span>}
            {personalInfo.linkedin && <span>| {personalInfo.linkedin}</span>}
          </div>
        </header>

        {personalInfo.summary && (
          <section className="mb-8">
            <h3 className="text-lg font-bold uppercase tracking-wider mb-3 border-b border-gray-200 pb-1">Professional Summary</h3>
            <p className="text-gray-700 whitespace-pre-line">{personalInfo.summary}</p>
          </section>
        )}

        <section className="mb-8">
          <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">Experience</h3>
          <div className="space-y-6">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-lg">{exp.role}</h4>
                  <span className="font-semibold text-gray-600 text-[0.9em]">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="text-gray-700 font-medium mb-2">{exp.company}</div>
                <p className="text-gray-600 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex gap-8">
          <section className="flex-1">
            <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">Education</h3>
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="font-bold">{edu.school}</div>
                  <div>{edu.degree}</div>
                  <div className="text-gray-500 text-[0.9em]">{edu.year}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex-1">
            <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">Skills</h3>
            <ul className="list-disc list-inside text-gray-700 grid grid-cols-2 gap-x-4 gap-y-1">
              {skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    );
  }

  // --- CREATIVE PORTFOLIO TEMPLATE ---
  if (config.id === 'creative') {
    return (
      <div 
        ref={targetRef}
        id="resume-preview-node"
        style={containerStyle}
        className={`flex flex-row-reverse text-gray-800 ${fontClass}`}
      >
        {/* Right Sidebar (Dark/Color) */}
        <div className="w-1/3 p-6 text-white flex flex-col gap-8" style={{ backgroundColor: '#1f2937' }}>
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4 text-4xl font-bold">
              {personalInfo.fullName.charAt(0)}
            </div>
            <h2 className="text-xl font-bold mb-4">Contact</h2>
            <div className="space-y-3 text-[0.9em] text-gray-300 text-left">
              {personalInfo.email && <div className="flex gap-2 items-center"><Mail size={14}/> <span className="break-all">{personalInfo.email}</span></div>}
              {personalInfo.phone && <div className="flex gap-2 items-center"><Phone size={14}/> <span>{personalInfo.phone}</span></div>}
              {personalInfo.location && <div className="flex gap-2 items-center"><MapPin size={14}/> <span>{personalInfo.location}</span></div>}
              {personalInfo.linkedin && <div className="flex gap-2 items-center"><Globe size={14}/> <span className="break-all">{personalInfo.linkedin}</span></div>}
            </div>
          </div>

          <div>
             <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">Skills</h2>
             <div className="flex flex-wrap gap-2">
               {skills.map((skill, i) => (
                 <span key={i} className="bg-brand-500/20 border border-brand-500/30 px-2 py-1 rounded text-[0.9em]" style={{ borderColor: primaryColor }}>
                   {skill}
                 </span>
               ))}
             </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">Education</h2>
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id}>
                  <p className="font-bold text-white">{edu.school}</p>
                  <p className="text-gray-300 text-[0.9em]">{edu.degree}</p>
                  <p className="text-gray-400 text-[0.8em]">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Left Main Content */}
        <div className="w-2/3 p-8 bg-white">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold uppercase tracking-tighter mb-2" style={{ color: primaryColor }}>
              {personalInfo.fullName.split(' ')[0]} <span className="text-gray-800">{personalInfo.fullName.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-xl text-gray-400 tracking-widest uppercase">{experience[0]?.role || 'Professional'}</p>
          </header>

          {personalInfo.summary && (
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full text-white" style={{ backgroundColor: primaryColor }}><Briefcase size={16} /></div>
                <h3 className="text-xl font-bold uppercase tracking-wider">Profile</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full text-white" style={{ backgroundColor: primaryColor }}><Award size={16} /></div>
              <h3 className="text-xl font-bold uppercase tracking-wider">Experience</h3>
            </div>
            
            <div className="border-l-2 ml-3 space-y-8 pl-8 relative" style={{ borderColor: '#f3f4f6' }}>
               {experience.map(exp => (
                 <div key={exp.id} className="relative">
                   {/* Timeline Dot */}
                   <div 
                      className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full border-2 bg-white" 
                      style={{ borderColor: primaryColor }}
                   ></div>
                   
                   <h4 className="text-lg font-bold">{exp.role}</h4>
                   <div className="text-brand-600 font-semibold mb-2" style={{ color: primaryColor }}>{exp.company}</div>
                   <div className="text-gray-400 text-[0.85em] mb-3 uppercase tracking-wide">{exp.startDate} - {exp.endDate}</div>
                   <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- EXECUTIVE SUITE TEMPLATE ---
  if (config.id === 'executive') {
    return (
      <div 
        ref={targetRef}
        id="resume-preview-node"
        style={containerStyle}
        className={`p-10 text-gray-800 ${fontClass}`}
      >
        <header className="text-center mb-8 border-b-4 pb-6" style={{ borderColor: primaryColor }}>
          <h1 className="text-4xl font-serif font-bold mb-2 tracking-wide uppercase text-gray-900">{personalInfo.fullName}</h1>
          <div className="flex justify-center items-center gap-4 text-gray-600 text-[0.9em] font-medium uppercase tracking-wider">
             {personalInfo.location && <span>{personalInfo.location}</span>}
             {personalInfo.phone && <span className="w-1 h-1 bg-gray-400 rounded-full"></span>}
             {personalInfo.phone && <span>{personalInfo.phone}</span>}
             {personalInfo.email && <span className="w-1 h-1 bg-gray-400 rounded-full"></span>}
             {personalInfo.email && <span>{personalInfo.email}</span>}
          </div>
        </header>

        {personalInfo.summary && (
          <section className="mb-8 text-center px-8">
             <p className="italic text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        <section className="mb-8">
          <div className="flex items-center mb-6">
            <h3 className="text-lg font-bold uppercase tracking-widest pr-4 bg-white z-10">Experience</h3>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
          
          <div className="space-y-6">
            {experience.map(exp => (
              <div key={exp.id} className="grid grid-cols-12 gap-4">
                 <div className="col-span-3 text-right">
                    <p className="font-bold text-gray-900">{exp.startDate}</p>
                    <p className="text-gray-500 text-[0.9em]">{exp.endDate}</p>
                 </div>
                 <div className="col-span-9 border-l pl-6 border-gray-200">
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{exp.role}</h4>
                    <div className="text-lg text-gray-600 font-serif italic mb-2" style={{ color: primaryColor }}>{exp.company}</div>
                    <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                 </div>
              </div>
            ))}
          </div>
        </section>
        
        <div className="grid grid-cols-2 gap-10">
           <section>
              <div className="flex items-center mb-6">
                <h3 className="text-lg font-bold uppercase tracking-widest pr-4 bg-white z-10">Education</h3>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id}>
                    <h4 className="font-bold text-gray-900">{edu.school}</h4>
                    <p className="text-gray-700">{edu.degree}</p>
                    <p className="text-gray-500 italic text-[0.9em]">{edu.year}</p>
                  </div>
                ))}
              </div>
           </section>

           <section>
              <div className="flex items-center mb-6">
                <h3 className="text-lg font-bold uppercase tracking-widest pr-4 bg-white z-10">Expertise</h3>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></span>
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
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
        <div className="text-right text-gray-500 space-y-1 text-[0.9em]">
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
                    <div className="flex justify-between text-gray-500 mb-2 text-[0.9em]">
                       <span className="italic">{exp.role}</span>
                       <span>{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-gray-600 whitespace-pre-line">{exp.description}</p>
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
                    <p className="font-bold text-gray-800">{edu.school}</p>
                    <p className="text-gray-600 text-[0.9em]">{edu.degree}</p>
                    <p className="text-gray-400 text-[0.8em]">{edu.year}</p>
                  </div>
                ))}
              </div>
           </div>

           <div>
              <h3 className="uppercase tracking-widest text-xs font-bold text-gray-400 mb-4">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                 {skills.map((skill, i) => (
                   <span key={i} className="text-gray-600 border border-gray-200 px-2 py-1 rounded-full text-[0.9em]">
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