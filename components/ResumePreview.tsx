import React from 'react';
import { ResumeData, TemplateConfig } from '../types';
import { MapPin, Mail, Phone, Linkedin, Globe, Briefcase, GraduationCap, Award, Hash, Terminal } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  config: TemplateConfig;
  targetRef?: React.RefObject<HTMLDivElement | null>;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, config, targetRef }) => {
  const { personalInfo, experience, education, skills } = data;

  // Dynamic Styles based on Config
  const primaryColor = config.primaryColor;
  
  const fontMap: Record<string, string> = {
    sans: 'font-sans',
    serif: 'font-serif',
    poppins: 'font-poppins',
    lato: 'font-lato',
    roboto: 'font-roboto',
    opensans: 'font-opensans',
    playfair: 'font-playfair',
    montserrat: 'font-montserrat',
    oswald: 'font-oswald',
    raleway: 'font-raleway',
    lora: 'font-lora',
  };
  
  const fontClass = fontMap[config.fontFamily] || 'font-sans';

  // Common container styles for A4
  const containerStyle = {
    width: '210mm',
    minHeight: '296mm', 
    backgroundColor: 'white',
    fontSize: `${config.fontSize}pt`, // Dynamic base font size
    lineHeight: 1.5,
  };

  // Helper for rendering skills
  const SkillPill = ({ skill, style }: { skill: string, style?: React.CSSProperties, key?: React.Key }) => (
    <span className="inline-block px-2 py-1 rounded text-[0.9em] mr-2 mb-2" style={style}>
      {skill}
    </span>
  );

  // --- 1. MODERN SPLIT ---
  if (config.id === 'modern') {
    return (
      <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`flex text-gray-800 ${fontClass}`}>
        <div className="w-1/3 p-8 text-white flex flex-col gap-6" style={{ backgroundColor: primaryColor }}>
          <div className="break-words">
            <h1 className="text-3xl font-bold uppercase leading-tight mb-2">{personalInfo.fullName}</h1>
            <p className="opacity-90">{personalInfo.location}</p>
          </div>
          <div className="space-y-3 opacity-90 text-[0.9em]">
            {personalInfo.email && <div className="flex items-center gap-2"><Mail size={14} className="shrink-0"/> <span className="break-all">{personalInfo.email}</span></div>}
            {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={14} className="shrink-0"/> <span>{personalInfo.phone}</span></div>}
            {personalInfo.linkedin && <div className="flex items-center gap-2"><Linkedin size={14} className="shrink-0"/> <span className="break-all">{personalInfo.linkedin}</span></div>}
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
            <div className="flex flex-wrap">
              {skills.map((skill, i) => <SkillPill key={i} skill={skill} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />)}
            </div>
          </div>
        </div>
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

  // --- 2. CLASSIC PROFESSIONAL ---
  if (config.id === 'classic') {
    return (
      <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`p-12 text-gray-800 ${fontClass}`}>
        <header className="border-b-2 pb-6 mb-8 text-center" style={{ borderColor: primaryColor }}>
          <h1 className="text-4xl font-bold mb-3 uppercase tracking-wide" style={{ color: primaryColor }}>{personalInfo.fullName}</h1>
          <div className="flex flex-wrap justify-center gap-4 text-gray-600">
            {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin].filter(Boolean).map((item, i) => (
               <span key={i}>{i > 0 && '| '}{item}</span>
            ))}
          </div>
        </header>
        {personalInfo.summary && (
          <section className="mb-8">
            <h3 className="text-lg font-bold uppercase tracking-wider mb-3 border-b border-gray-200 pb-1">Summary</h3>
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
            <div className="flex flex-wrap">{skills.map((s, i) => <SkillPill key={i} skill={s} style={{backgroundColor: '#f3f4f6'}}/>)}</div>
          </section>
        </div>
      </div>
    );
  }

  // --- 3. MINIMALIST ---
  if (config.id === 'minimalist') {
    return (
      <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`p-10 text-gray-800 ${fontClass}`}>
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
                   {skills.map((skill, i) => <SkillPill key={i} skill={skill} style={{ border: '1px solid #e5e7eb'}} />)}
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 4. CREATIVE PORTFOLIO ---
  if (config.id === 'creative') {
    return (
      <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`flex flex-row-reverse text-gray-800 ${fontClass}`}>
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
           <div>
             <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">Skills</h2>
             <div className="flex flex-wrap">
               {skills.map((skill, i) => <SkillPill key={i} skill={skill} style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: primaryColor, border: '1px solid' }} />)}
             </div>
          </div>
        </div>
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
                   <div className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full border-2 bg-white" style={{ borderColor: primaryColor }}></div>
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

  // --- 5. EXECUTIVE SUITE ---
  if (config.id === 'executive') {
    return (
      <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`p-10 text-gray-800 ${fontClass}`}>
        <header className="text-center mb-8 border-b-4 pb-6" style={{ borderColor: primaryColor }}>
          <h1 className="text-4xl font-serif font-bold mb-2 tracking-wide uppercase text-gray-900">{personalInfo.fullName}</h1>
          <div className="flex justify-center items-center gap-4 text-gray-600 text-[0.9em] font-medium uppercase tracking-wider">
             {[personalInfo.location, personalInfo.phone, personalInfo.email].filter(Boolean).map((item, i) => (
                <React.Fragment key={i}>
                   {i > 0 && <span className="w-1 h-1 bg-gray-400 rounded-full"></span>}
                   <span>{item}</span>
                </React.Fragment>
             ))}
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

  // --- 6. CORPORATE ---
  if (config.id === 'corporate') {
    return (
      <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`p-10 text-gray-900 ${fontClass}`}>
        <div className="border-b-4 border-gray-900 pb-6 mb-6">
          <h1 className="text-4xl font-bold uppercase tracking-tighter mb-2">{personalInfo.fullName}</h1>
          <div className="flex gap-4 text-sm font-semibold uppercase tracking-wide text-gray-600">
             <span>{personalInfo.location}</span>
             <span>{personalInfo.phone}</span>
             <span className="text-brand-600" style={{ color: primaryColor }}>{personalInfo.email}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-8">
           <div className="col-span-8">
              {personalInfo.summary && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold uppercase border-b-2 border-gray-200 mb-3 pb-1" style={{ color: primaryColor }}>Profile</h3>
                  <p className="leading-relaxed">{personalInfo.summary}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-bold uppercase border-b-2 border-gray-200 mb-4 pb-1" style={{ color: primaryColor }}>Professional Experience</h3>
                <div className="space-y-6">
                   {experience.map(exp => (
                     <div key={exp.id}>
                       <div className="flex justify-between items-end mb-1">
                          <h4 className="font-bold text-lg">{exp.role}</h4>
                          <span className="font-bold text-sm bg-gray-100 px-2 py-0.5 rounded">{exp.startDate} - {exp.endDate}</span>
                       </div>
                       <div className="font-semibold text-gray-600 mb-2">{exp.company}</div>
                       <p className="text-gray-700">{exp.description}</p>
                     </div>
                   ))}
                </div>
              </div>
           </div>
           
           <div className="col-span-4 bg-gray-50 p-4 rounded-lg h-fit">
              <div className="mb-6">
                 <h3 className="text-md font-bold uppercase border-b border-gray-300 mb-3 pb-1">Education</h3>
                 <div className="space-y-4">
                   {education.map(edu => (
                     <div key={edu.id}>
                       <div className="font-bold">{edu.school}</div>
                       <div className="text-sm">{edu.degree}</div>
                       <div className="text-sm text-gray-500">{edu.year}</div>
                     </div>
                   ))}
                 </div>
              </div>
              <div>
                 <h3 className="text-md font-bold uppercase border-b border-gray-300 mb-3 pb-1">Core Competencies</h3>
                 <div className="flex flex-col gap-2">
                    {skills.map((s,i) => (
                      <span key={i} className="text-sm font-medium text-gray-700">• {s}</span>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- 7. DECONSTRUCTED ---
  if (config.id === 'deconstructed') {
    return (
      <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`p-8 bg-gray-100 ${fontClass}`}>
        <div className="bg-white p-8 shadow-sm h-full flex flex-col">
           <header className="flex justify-between items-start mb-10 border-b border-gray-200 pb-8">
              <div>
                 <h1 className="text-5xl font-light tracking-tight text-gray-900 mb-2">{personalInfo.fullName}</h1>
                 <p className="text-xl text-gray-400 font-light">{experience[0]?.role}</p>
              </div>
              <div className="text-right text-sm font-medium text-gray-500">
                 <div className="mb-1">{personalInfo.email}</div>
                 <div className="mb-1">{personalInfo.phone}</div>
                 <div className="mb-1">{personalInfo.linkedin}</div>
                 <div>{personalInfo.location}</div>
              </div>
           </header>
           
           <div className="grid grid-cols-3 gap-10 flex-grow">
              <div className="col-span-1 border-r border-gray-100 pr-6">
                 <div className="mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Education</h3>
                    {education.map(edu => (
                      <div key={edu.id} className="mb-4">
                        <div className="font-bold text-gray-800">{edu.school}</div>
                        <div className="text-sm text-gray-600">{edu.degree}</div>
                        <div className="text-xs text-gray-400 mt-1">{edu.year}</div>
                      </div>
                    ))}
                 </div>
                 
                 <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                       {skills.map((s,i) => (
                         <span key={i} className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-700 rounded-sm">
                           {s}
                         </span>
                       ))}
                    </div>
                 </div>
              </div>
              
              <div className="col-span-2">
                 {personalInfo.summary && (
                   <div className="mb-8 bg-gray-50 p-4 rounded-lg border-l-4" style={{ borderColor: primaryColor }}>
                      <p className="italic text-gray-600">{personalInfo.summary}</p>
                   </div>
                 )}
                 
                 <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Work History</h3>
                    <div className="space-y-8">
                       {experience.map(exp => (
                         <div key={exp.id}>
                           <div className="flex justify-between items-center mb-2">
                              <h4 className="font-bold text-xl">{exp.company}</h4>
                              <span className="text-sm font-mono text-gray-400">{exp.startDate} / {exp.endDate}</span>
                           </div>
                           <div className="text-brand-600 font-medium mb-2" style={{ color: primaryColor }}>{exp.role}</div>
                           <p className="text-gray-600 leading-relaxed text-sm">{exp.description}</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- 8. GLACIAL ---
  if (config.id === 'glacial') {
    return (
      <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`text-gray-800 ${fontClass}`}>
        <div className="h-32 w-full bg-gray-100 flex items-center px-10 justify-between">
           <div>
              <h1 className="text-3xl font-bold tracking-wider uppercase text-gray-800">{personalInfo.fullName}</h1>
              <p className="text-brand-500 font-medium tracking-wide" style={{ color: primaryColor }}>{personalInfo.location}</p>
           </div>
           <div className="text-right text-sm text-gray-500">
              <div>{personalInfo.email}</div>
              <div>{personalInfo.phone}</div>
           </div>
        </div>
        
        <div className="p-10 grid grid-cols-1 gap-10">
           {personalInfo.summary && (
             <div className="border-l-2 pl-4" style={{ borderColor: primaryColor }}>
               <p className="text-lg text-gray-600 font-light">{personalInfo.summary}</p>
             </div>
           )}
           
           <div>
              <h3 className="text-gray-400 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                 <span className="w-8 h-px bg-gray-300"></span> Experience
              </h3>
              <div className="space-y-8 pl-4">
                 {experience.map(exp => (
                   <div key={exp.id} className="group">
                      <div className="flex justify-between items-baseline mb-1">
                         <h4 className="text-xl font-bold text-gray-800 group-hover:text-brand-600 transition-colors" style={{ color: primaryColor }}>{exp.role}</h4>
                         <span className="text-sm text-gray-400">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <div className="text-gray-500 font-medium mb-2 uppercase tracking-wide text-xs">{exp.company}</div>
                      <p className="text-gray-600">{exp.description}</p>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-8">
              <div>
                 <h3 className="text-gray-400 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="w-8 h-px bg-gray-300"></span> Education
                 </h3>
                 <div className="space-y-4 pl-4">
                    {education.map(edu => (
                      <div key={edu.id}>
                         <div className="font-bold">{edu.school}</div>
                         <div className="text-sm">{edu.degree}</div>
                         <div className="text-xs text-gray-400">{edu.year}</div>
                      </div>
                    ))}
                 </div>
              </div>
              <div>
                 <h3 className="text-gray-400 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="w-8 h-px bg-gray-300"></span> Skills
                 </h3>
                 <div className="pl-4 flex flex-wrap gap-2">
                    {skills.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-50 rounded-full text-sm text-gray-600 border border-gray-100">{s}</span>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- 9. TIGNUM ---
  if (config.id === 'tignum') {
    return (
       <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`flex ${fontClass}`}>
          <div className="w-16 bg-gray-800 flex flex-col items-center py-10 gap-6 text-white shrink-0">
             <div className="w-1 h-16 bg-gray-600"></div>
             {personalInfo.linkedin && <Linkedin size={20} />}
             {personalInfo.email && <Mail size={20} />}
             {personalInfo.phone && <Phone size={20} />}
             <div className="flex-grow w-px bg-gray-700"></div>
          </div>
          
          <div className="flex-grow p-10 bg-white">
             <header className="mb-10">
                <h1 className="text-5xl font-bold text-gray-900 mb-2" style={{ color: primaryColor }}>{personalInfo.fullName}</h1>
                <div className="text-xl text-gray-400">{experience[0]?.role}</div>
             </header>
             
             <div className="flex gap-10">
                <div className="w-2/3">
                   <div className="mb-8">
                      <h3 className="font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-100 pb-2 mb-4">Experience</h3>
                      <div className="space-y-6">
                         {experience.map(exp => (
                           <div key={exp.id}>
                              <h4 className="font-bold text-lg">{exp.company}</h4>
                              <div className="flex justify-between items-center text-brand-600 mb-2" style={{ color: primaryColor }}>
                                 <span className="font-medium">{exp.role}</span>
                                 <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{exp.startDate} - {exp.endDate}</span>
                              </div>
                              <p className="text-sm text-gray-600">{exp.description}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
                
                <div className="w-1/3">
                   <div className="mb-8">
                      <h3 className="font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-100 pb-2 mb-4">Profile</h3>
                      <p className="text-sm text-gray-600">{personalInfo.summary}</p>
                   </div>
                   <div className="mb-8">
                      <h3 className="font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-100 pb-2 mb-4">Skills</h3>
                      <div className="flex flex-col gap-2">
                         {skills.map((s,i) => (
                           <div key={i} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                              <span className="text-sm text-gray-700">{s}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-100 pb-2 mb-4">Education</h3>
                      {education.map(edu => (
                        <div key={edu.id} className="mb-3">
                           <div className="font-bold text-sm">{edu.school}</div>
                           <div className="text-xs text-gray-500">{edu.degree}</div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
       </div>
    );
  }

  // --- 10. VANGUARD ---
  if (config.id === 'vanguard') {
     return (
        <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`bg-white ${fontClass}`}>
           <div className="h-48 flex flex-col justify-center items-center text-white" style={{ backgroundColor: primaryColor }}>
              <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">{personalInfo.fullName}</h1>
              <div className="flex gap-4 opacity-80 text-sm">
                 <span>{personalInfo.email}</span>
                 <span>•</span>
                 <span>{personalInfo.location}</span>
              </div>
           </div>
           
           <div className="max-w-[85%] mx-auto -mt-8 bg-white shadow-lg p-8 rounded-lg relative z-10">
              {personalInfo.summary && <p className="text-center text-gray-600 italic">{personalInfo.summary}</p>}
           </div>
           
           <div className="p-12 grid grid-cols-12 gap-8">
              <div className="col-span-4 space-y-8 text-right border-r border-gray-200 pr-8">
                 <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-4">Education</h3>
                    {education.map(edu => (
                       <div key={edu.id} className="mb-4">
                          <div className="font-bold">{edu.school}</div>
                          <div className="text-sm text-gray-500">{edu.degree}</div>
                          <div className="text-xs text-gray-400">{edu.year}</div>
                       </div>
                    ))}
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-4">Contact</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                       <div>{personalInfo.phone}</div>
                       <div>{personalInfo.linkedin}</div>
                    </div>
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-4">Expertise</h3>
                    <div className="flex flex-wrap justify-end gap-1">
                       {skills.map((s,i) => (
                          <span key={i} className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">{s}</span>
                       ))}
                    </div>
                 </div>
              </div>
              
              <div className="col-span-8 space-y-8 pl-4">
                 <h3 className="font-bold text-gray-900 text-2xl mb-6 flex items-center gap-3">
                    <span className="w-8 h-1 rounded-full" style={{ backgroundColor: primaryColor }}></span>
                    Experience
                 </h3>
                 {experience.map(exp => (
                    <div key={exp.id} className="relative pl-8 border-l border-gray-200 pb-8 last:pb-0">
                       <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-white border-2" style={{ borderColor: primaryColor }}></div>
                       <h4 className="font-bold text-xl">{exp.role}</h4>
                       <div className="text-gray-500 font-medium mb-2">{exp.company} <span className="text-gray-300">|</span> {exp.startDate} - {exp.endDate}</div>
                       <p className="text-gray-600">{exp.description}</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>
     );
  }

  // --- 11. ACADEMIC ---
  if (config.id === 'academic') {
     return (
        <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`p-16 text-gray-900 ${fontClass}`}>
           <header className="text-center mb-8">
              <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">{personalInfo.fullName}</h1>
              <div className="text-sm text-gray-600 space-y-1">
                 <div>{personalInfo.location} • {personalInfo.phone}</div>
                 <div>{personalInfo.email}</div>
              </div>
           </header>
           
           <hr className="border-black mb-8" />
           
           <div className="space-y-6">
              {personalInfo.summary && (
                 <section>
                    <h3 className="font-bold uppercase text-sm mb-2">Objective</h3>
                    <p className="text-sm text-justify">{personalInfo.summary}</p>
                 </section>
              )}
              
              <section>
                 <h3 className="font-bold uppercase text-sm mb-2">Education</h3>
                 <div className="space-y-2">
                    {education.map(edu => (
                       <div key={edu.id} className="flex justify-between text-sm">
                          <div><span className="font-bold">{edu.school}</span>, {edu.degree}</div>
                          <div>{edu.year}</div>
                       </div>
                    ))}
                 </div>
              </section>
              
              <section>
                 <h3 className="font-bold uppercase text-sm mb-2">Professional Experience</h3>
                 <div className="space-y-4">
                    {experience.map(exp => (
                       <div key={exp.id}>
                          <div className="flex justify-between text-sm font-bold">
                             <div>{exp.company}</div>
                             <div>{exp.startDate} – {exp.endDate}</div>
                          </div>
                          <div className="text-sm italic mb-1">{exp.role}</div>
                          <p className="text-sm text-justify">{exp.description}</p>
                       </div>
                    ))}
                 </div>
              </section>
              
              <section>
                 <h3 className="font-bold uppercase text-sm mb-2">Skills</h3>
                 <p className="text-sm text-justify">{skills.join(', ')}.</p>
              </section>
           </div>
        </div>
     );
  }

  // --- 13. IVY ---
  if (config.id === 'ivy') {
    return (
      <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`p-16 text-gray-900 ${fontClass}`}>
        <header className="text-center mb-8">
           <h1 className="text-4xl font-serif font-bold mb-2 uppercase tracking-widest">{personalInfo.fullName}</h1>
           <p className="text-sm text-gray-600 font-serif italic">{personalInfo.location} | {personalInfo.email} | {personalInfo.phone}</p>
        </header>

        <div className="space-y-6">
           {personalInfo.summary && (
             <section>
               <h3 className="text-center text-sm font-bold uppercase tracking-widest border-b border-gray-900 pb-1 mb-3">Professional Summary</h3>
               <p className="text-justify leading-relaxed text-gray-800">{personalInfo.summary}</p>
             </section>
           )}

           <section>
             <h3 className="text-center text-sm font-bold uppercase tracking-widest border-b border-gray-900 pb-1 mb-3">Experience</h3>
             {experience.map(exp => (
               <div key={exp.id} className="mb-4">
                 <div className="flex justify-between font-bold text-lg">
                    <span>{exp.company}</span>
                    <span className="text-sm font-normal">{exp.startDate} - {exp.endDate}</span>
                 </div>
                 <div className="italic text-gray-700 mb-1">{exp.role}</div>
                 <p className="text-sm text-gray-800">{exp.description}</p>
               </div>
             ))}
           </section>

           <section>
             <h3 className="text-center text-sm font-bold uppercase tracking-widest border-b border-gray-900 pb-1 mb-3">Education</h3>
             {education.map(edu => (
               <div key={edu.id} className="flex justify-between items-baseline mb-2">
                  <div>
                    <span className="font-bold block">{edu.school}</span>
                    <span className="italic text-sm">{edu.degree}</span>
                  </div>
                  <span className="text-sm">{edu.year}</span>
               </div>
             ))}
           </section>

           <section>
             <h3 className="text-center text-sm font-bold uppercase tracking-widest border-b border-gray-900 pb-1 mb-3">Skills</h3>
             <div className="text-center text-sm">{skills.join(' • ')}</div>
           </section>
        </div>
      </div>
    );
  }

  // --- 14. QUARTZ ---
  if (config.id === 'quartz') {
    return (
       <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`flex flex-col h-full ${fontClass}`}>
          <div className="p-10 pb-6 border-b" style={{ backgroundColor: `${primaryColor}15`, borderColor: primaryColor }}>
             <h1 className="text-4xl font-bold text-gray-900 mb-2">{personalInfo.fullName}</h1>
             <div className="flex gap-6 text-sm font-medium text-gray-600">
                <span>{personalInfo.email}</span>
                <span>{personalInfo.phone}</span>
                <span>{personalInfo.location}</span>
             </div>
          </div>
          
          <div className="flex-grow p-10 grid grid-cols-12 gap-10">
             <div className="col-span-8 space-y-8">
                {personalInfo.summary && (
                   <section>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Profile</h3>
                      <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
                   </section>
                )}
                
                <section>
                   <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Work Experience</h3>
                   <div className="space-y-6">
                      {experience.map(exp => (
                         <div key={exp.id}>
                            <h4 className="font-bold text-lg">{exp.role}</h4>
                            <div className="text-gray-600 font-medium text-sm mb-2">{exp.company} | {exp.startDate} - {exp.endDate}</div>
                            <p className="text-gray-700 text-sm">{exp.description}</p>
                         </div>
                      ))}
                   </div>
                </section>
             </div>
             
             <div className="col-span-4 space-y-8">
                <section>
                   <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Education</h3>
                   <div className="space-y-4">
                      {education.map(edu => (
                         <div key={edu.id}>
                            <div className="font-bold">{edu.school}</div>
                            <div className="text-sm text-gray-600">{edu.degree}</div>
                            <div className="text-xs text-gray-500 mt-1">{edu.year}</div>
                         </div>
                      ))}
                   </div>
                </section>
                
                <section>
                   <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Skills</h3>
                   <div className="flex flex-col gap-2">
                      {skills.map((s,i) => (
                         <span key={i} className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded w-fit">{s}</span>
                      ))}
                   </div>
                </section>
             </div>
          </div>
       </div>
    );
  }

  // --- 15. HORIZON ---
  if (config.id === 'horizon') {
     return (
        <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`p-12 text-gray-800 ${fontClass}`}>
           <header className="flex justify-between items-end mb-10 pb-6 border-b-2" style={{ borderColor: primaryColor }}>
              <div>
                 <h1 className="text-5xl font-light tracking-tight">{personalInfo.fullName}</h1>
                 <p className="text-xl mt-2 text-gray-500">{experience[0]?.role}</p>
              </div>
              <div className="text-right text-sm space-y-1 text-gray-600">
                 <div>{personalInfo.email}</div>
                 <div>{personalInfo.phone}</div>
                 <div>{personalInfo.location}</div>
              </div>
           </header>
           
           <div className="space-y-10">
              {experience.map(exp => (
                 <div key={exp.id} className="grid grid-cols-4 gap-4 pb-8 border-b border-gray-100 last:border-0">
                    <div className="col-span-1 text-right pr-4 pt-1">
                       <div className="font-bold text-gray-900">{exp.startDate}</div>
                       <div className="text-sm text-gray-500">{exp.endDate}</div>
                    </div>
                    <div className="col-span-3 border-l-2 pl-6" style={{ borderColor: primaryColor }}>
                       <h3 className="text-xl font-bold text-gray-900">{exp.role}</h3>
                       <div className="text-lg text-gray-600 mb-2">{exp.company}</div>
                       <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                    </div>
                 </div>
              ))}
           </div>
           
           <div className="grid grid-cols-2 gap-12 mt-8 pt-8 border-t-2" style={{ borderColor: primaryColor }}>
              <div>
                 <h3 className="uppercase tracking-widest font-bold text-gray-400 mb-4">Education</h3>
                 {education.map(edu => (
                    <div key={edu.id} className="mb-4">
                       <div className="font-bold text-lg">{edu.school}</div>
                       <div className="text-gray-600">{edu.degree}</div>
                    </div>
                 ))}
              </div>
              <div>
                 <h3 className="uppercase tracking-widest font-bold text-gray-400 mb-4">Skills</h3>
                 <div className="flex flex-wrap gap-2">
                    {skills.map((s,i) => <span key={i} className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-700">{s}</span>)}
                 </div>
              </div>
           </div>
        </div>
     );
  }

  // --- 16. PILLAR ---
  if (config.id === 'pillar') {
     return (
        <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`flex h-full ${fontClass}`}>
           <div className="w-1/3 bg-gray-50 p-8 border-r-4" style={{ borderColor: primaryColor }}>
              <div className="mb-10">
                 <h1 className="text-3xl font-bold leading-tight mb-4">{personalInfo.fullName}</h1>
                 <div className="space-y-2 text-sm text-gray-600">
                    <div>{personalInfo.email}</div>
                    <div>{personalInfo.phone}</div>
                    <div>{personalInfo.location}</div>
                 </div>
              </div>
              
              <div className="mb-8">
                 <h3 className="font-bold text-gray-900 uppercase tracking-widest mb-4">Education</h3>
                 {education.map(edu => (
                    <div key={edu.id} className="mb-4">
                       <div className="font-bold">{edu.school}</div>
                       <div className="text-sm">{edu.degree}</div>
                       <div className="text-xs text-gray-500">{edu.year}</div>
                    </div>
                 ))}
              </div>
              
              <div>
                 <h3 className="font-bold text-gray-900 uppercase tracking-widest mb-4">Skills</h3>
                 <ul className="list-disc ml-4 space-y-1 text-sm text-gray-700">
                    {skills.map((s,i) => <li key={i}>{s}</li>)}
                 </ul>
              </div>
           </div>
           
           <div className="w-2/3 p-10">
              {personalInfo.summary && (
                 <div className="mb-10">
                    <h3 className="text-xl font-bold border-b-2 pb-2 mb-4" style={{ borderColor: primaryColor }}>Profile</h3>
                    <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
                 </div>
              )}
              
              <div>
                 <h3 className="text-xl font-bold border-b-2 pb-2 mb-6" style={{ borderColor: primaryColor }}>Work Experience</h3>
                 <div className="space-y-8">
                    {experience.map(exp => (
                       <div key={exp.id}>
                          <h4 className="text-xl font-bold">{exp.role}</h4>
                          <div className="flex justify-between text-gray-600 font-medium mb-2">
                             <span>{exp.company}</span>
                             <span>{exp.startDate} - {exp.endDate}</span>
                          </div>
                          <p className="text-gray-700 text-sm">{exp.description}</p>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
     );
  }

  // --- 17. BLOCKS ---
  if (config.id === 'blocks') {
     return (
        <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`p-8 bg-white ${fontClass}`}>
           <header className="flex justify-between items-center mb-8 bg-gray-900 text-white p-6 rounded-lg">
              <div>
                 <h1 className="text-3xl font-bold">{personalInfo.fullName}</h1>
                 <p className="opacity-80">{experience[0]?.role}</p>
              </div>
              <div className="text-right text-sm space-y-1 opacity-90">
                 <div>{personalInfo.email}</div>
                 <div>{personalInfo.phone}</div>
                 <div>{personalInfo.location}</div>
              </div>
           </header>
           
           <div className="space-y-8">
              {personalInfo.summary && (
                 <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <p className="italic text-gray-700">{personalInfo.summary}</p>
                 </div>
              )}
              
              <div>
                 <div className="inline-block px-4 py-2 rounded-t-lg text-white font-bold tracking-wide uppercase" style={{ backgroundColor: primaryColor }}>
                    Experience
                 </div>
                 <div className="border-t-4 p-6 bg-white border-gray-100 shadow-sm rounded-b-lg rounded-tr-lg" style={{ borderColor: primaryColor }}>
                    <div className="space-y-8">
                       {experience.map(exp => (
                          <div key={exp.id}>
                             <div className="flex justify-between items-baseline mb-2">
                                <h3 className="font-bold text-lg">{exp.company}</h3>
                                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-600">{exp.startDate} - {exp.endDate}</span>
                             </div>
                             <div className="text-brand-600 font-medium mb-2" style={{ color: primaryColor }}>{exp.role}</div>
                             <p className="text-gray-600 text-sm">{exp.description}</p>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <div className="inline-block px-4 py-2 rounded-t-lg text-white font-bold tracking-wide uppercase" style={{ backgroundColor: primaryColor }}>
                       Education
                    </div>
                    <div className="border-t-4 p-6 bg-white border-gray-100 shadow-sm rounded-b-lg rounded-tr-lg h-full" style={{ borderColor: primaryColor }}>
                       {education.map(edu => (
                          <div key={edu.id} className="mb-4 last:mb-0">
                             <div className="font-bold">{edu.school}</div>
                             <div className="text-sm">{edu.degree}</div>
                          </div>
                       ))}
                    </div>
                 </div>
                 <div>
                    <div className="inline-block px-4 py-2 rounded-t-lg text-white font-bold tracking-wide uppercase" style={{ backgroundColor: primaryColor }}>
                       Skills
                    </div>
                    <div className="border-t-4 p-6 bg-white border-gray-100 shadow-sm rounded-b-lg rounded-tr-lg h-full" style={{ borderColor: primaryColor }}>
                       <div className="flex flex-wrap gap-2">
                          {skills.map((s,i) => (
                             <span key={i} className="text-xs font-bold border border-gray-300 px-2 py-1 rounded">{s}</span>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     );
  }

  // --- 18. CESTA ---
  if (config.id === 'cesta') {
     return (
        <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`p-10 ${fontClass}`}>
           <div className="border-2 border-gray-800 p-2 mb-8">
              <div className="border border-gray-800 p-8 text-center bg-gray-50">
                 <h1 className="text-4xl font-serif font-bold tracking-widest mb-4">{personalInfo.fullName}</h1>
                 <div className="flex justify-center gap-4 text-sm font-medium uppercase tracking-wide">
                    <span>{personalInfo.location}</span>
                    <span>/</span>
                    <span>{personalInfo.email}</span>
                 </div>
              </div>
           </div>
           
           <div className="space-y-8 px-4">
              <section>
                 <h3 className="text-center font-bold uppercase tracking-[0.2em] text-sm mb-6 relative">
                    <span className="bg-white px-4 relative z-10">Experience</span>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 -z-0"></div>
                 </h3>
                 <div className="space-y-6">
                    {experience.map(exp => (
                       <div key={exp.id} className="text-center">
                          <h4 className="font-bold text-lg">{exp.role}</h4>
                          <div className="text-sm text-gray-500 italic mb-2">{exp.company}  —  {exp.startDate} to {exp.endDate}</div>
                          <p className="text-gray-700 max-w-2xl mx-auto">{exp.description}</p>
                       </div>
                    ))}
                 </div>
              </section>
              
              <div className="grid grid-cols-2 gap-10">
                 <section>
                    <h3 className="text-center font-bold uppercase tracking-[0.2em] text-sm mb-6 relative">
                       <span className="bg-white px-4 relative z-10">Education</span>
                       <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 -z-0"></div>
                    </h3>
                    <div className="text-center space-y-4">
                       {education.map(edu => (
                          <div key={edu.id}>
                             <div className="font-bold">{edu.school}</div>
                             <div className="text-sm">{edu.degree}</div>
                          </div>
                       ))}
                    </div>
                 </section>
                 <section>
                    <h3 className="text-center font-bold uppercase tracking-[0.2em] text-sm mb-6 relative">
                       <span className="bg-white px-4 relative z-10">Skills</span>
                       <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 -z-0"></div>
                    </h3>
                    <div className="text-center text-sm leading-relaxed">
                       {skills.join('  //  ')}
                    </div>
                 </section>
              </div>
           </div>
        </div>
     );
  }

  // --- 19. URBAN ---
  if (config.id === 'urban') {
     return (
        <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`flex ${fontClass}`}>
           <div className="w-16 bg-gray-900 text-gray-400 flex flex-col items-center py-8 gap-8 shrink-0">
              <div className="writing-vertical-rl text-xs uppercase tracking-[0.3em] rotate-180 flex-grow text-center flex items-center justify-center">
                 {personalInfo.location}
              </div>
              <div className="w-8 h-px bg-gray-700"></div>
              <div className="writing-vertical-rl text-xs uppercase tracking-[0.3em] rotate-180 flex-grow text-center flex items-center justify-center">
                 {personalInfo.email}
              </div>
           </div>
           
           <div className="flex-grow p-10 bg-white">
              <header className="mb-12">
                 <h1 className="text-6xl font-black text-gray-900 leading-none mb-4 -ml-1">{personalInfo.fullName}</h1>
                 <p className="text-xl font-medium text-gray-400 uppercase tracking-widest">{experience[0]?.role}</p>
              </header>
              
              <div className="grid grid-cols-12 gap-8">
                 <div className="col-span-8">
                    <h3 className="text-sm font-black uppercase text-gray-300 mb-6">Experience</h3>
                    <div className="space-y-10">
                       {experience.map(exp => (
                          <div key={exp.id}>
                             <h4 className="text-2xl font-bold mb-1">{exp.role}</h4>
                             <div className="flex items-center gap-2 text-sm font-bold mb-3" style={{ color: primaryColor }}>
                                <span>{exp.company}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="text-gray-400">{exp.startDate} - {exp.endDate}</span>
                             </div>
                             <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                          </div>
                       ))}
                    </div>
                 </div>
                 
                 <div className="col-span-4 space-y-10">
                    <div>
                       <h3 className="text-sm font-black uppercase text-gray-300 mb-6">Education</h3>
                       {education.map(edu => (
                          <div key={edu.id} className="mb-4">
                             <div className="font-bold">{edu.school}</div>
                             <div className="text-sm text-gray-500">{edu.degree}</div>
                          </div>
                       ))}
                    </div>
                    <div>
                       <h3 className="text-sm font-black uppercase text-gray-300 mb-6">Skills</h3>
                       <div className="flex flex-col gap-2">
                          {skills.map((s,i) => (
                             <div key={i} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-200"></div>
                                <span className="font-bold text-sm text-gray-700">{s}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     );
  }

  // --- 20. SLATE ---
  if (config.id === 'slate') {
     return (
        <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`bg-white ${fontClass}`}>
           <header className="p-12 text-white" style={{ backgroundColor: primaryColor }}>
              <h1 className="text-4xl font-bold mb-4">{personalInfo.fullName}</h1>
              <div className="flex flex-wrap gap-6 text-sm opacity-90">
                 <span className="flex items-center gap-2"><Mail size={14}/> {personalInfo.email}</span>
                 <span className="flex items-center gap-2"><Phone size={14}/> {personalInfo.phone}</span>
                 <span className="flex items-center gap-2"><MapPin size={14}/> {personalInfo.location}</span>
              </div>
           </header>
           
           <div className="p-12">
              {personalInfo.summary && (
                 <div className="mb-10 pb-10 border-b border-gray-100">
                    <h3 className="text-gray-400 font-bold uppercase tracking-wider mb-4 text-sm">Professional Summary</h3>
                    <p className="text-lg leading-relaxed text-gray-800">{personalInfo.summary}</p>
                 </div>
              )}
              
              <div className="grid grid-cols-12 gap-12">
                 <div className="col-span-7">
                    <h3 className="text-gray-400 font-bold uppercase tracking-wider mb-6 text-sm">Experience</h3>
                    <div className="space-y-8">
                       {experience.map(exp => (
                          <div key={exp.id}>
                             <div className="flex justify-between items-center mb-1">
                                <h4 className="font-bold text-xl">{exp.company}</h4>
                                <span className="text-sm text-gray-500 font-medium">{exp.startDate} - {exp.endDate}</span>
                             </div>
                             <div className="text-brand-600 font-medium mb-3" style={{ color: primaryColor }}>{exp.role}</div>
                             <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                          </div>
                       ))}
                    </div>
                 </div>
                 
                 <div className="col-span-5 bg-gray-50 p-6 -mt-6 rounded-lg">
                    <div className="mb-8">
                       <h3 className="text-gray-400 font-bold uppercase tracking-wider mb-6 text-sm">Education</h3>
                       {education.map(edu => (
                          <div key={edu.id} className="mb-4">
                             <div className="font-bold">{edu.school}</div>
                             <div className="text-sm text-gray-600">{edu.degree}</div>
                             <div className="text-xs text-gray-400 mt-1">{edu.year}</div>
                          </div>
                       ))}
                    </div>
                    
                    <div>
                       <h3 className="text-gray-400 font-bold uppercase tracking-wider mb-6 text-sm">Expertise</h3>
                       <div className="flex flex-wrap gap-2">
                          {skills.map((s,i) => (
                             <span key={i} className="px-2 py-1 bg-white border border-gray-200 text-xs font-bold text-gray-600 rounded shadow-sm">
                                {s}
                             </span>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     );
  }
  
  // --- 21. NOBLE ---
  if (config.id === 'noble') {
     return (
        <div ref={targetRef} id="resume-preview-node" style={containerStyle} className={`p-10 ${fontClass}`}>
           <div className="border-4 border-double border-gray-200 h-full p-8 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-6">
                 <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl font-serif font-bold" style={{ borderColor: primaryColor, color: primaryColor }}>
                    {personalInfo.fullName.charAt(0)}
                 </div>
              </div>
              
              <div className="text-center mt-6 mb-10">
                 <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">{personalInfo.fullName}</h1>
                 <p className="text-sm text-gray-500 uppercase tracking-widest">{personalInfo.email} • {personalInfo.phone}</p>
              </div>
              
              <div className="space-y-8">
                 <section>
                    <div className="flex items-center gap-4 mb-4">
                       <h3 className="font-bold uppercase text-lg shrink-0">Profile</h3>
                       <div className="h-px bg-gray-200 flex-grow"></div>
                    </div>
                    <p className="text-gray-700 text-justify">{personalInfo.summary}</p>
                 </section>
                 
                 <section>
                    <div className="flex items-center gap-4 mb-4">
                       <h3 className="font-bold uppercase text-lg shrink-0">Experience</h3>
                       <div className="h-px bg-gray-200 flex-grow"></div>
                    </div>
                    <div className="space-y-6">
                       {experience.map(exp => (
                          <div key={exp.id}>
                             <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-bold text-lg">{exp.role}</h4>
                                <span className="italic text-sm text-gray-500">{exp.startDate} – {exp.endDate}</span>
                             </div>
                             <div className="font-serif italic text-gray-700 mb-2" style={{ color: primaryColor }}>{exp.company}</div>
                             <p className="text-sm text-gray-800">{exp.description}</p>
                          </div>
                       ))}
                    </div>
                 </section>
                 
                 <div className="grid grid-cols-2 gap-8">
                    <section>
                       <div className="flex items-center gap-4 mb-4">
                          <h3 className="font-bold uppercase text-lg shrink-0">Education</h3>
                          <div className="h-px bg-gray-200 flex-grow"></div>
                       </div>
                       {education.map(edu => (
                          <div key={edu.id} className="mb-2">
                             <div className="font-bold">{edu.school}</div>
                             <div className="text-sm">{edu.degree}</div>
                          </div>
                       ))}
                    </section>
                    <section>
                       <div className="flex items-center gap-4 mb-4">
                          <h3 className="font-bold uppercase text-lg shrink-0">Skills</h3>
                          <div className="h-px bg-gray-200 flex-grow"></div>
                       </div>
                       <div className="text-sm leading-6">
                          {skills.join(', ')}
                       </div>
                    </section>
                 </div>
              </div>
           </div>
        </div>
     );
  }

  return null;
};

export default ResumePreview;