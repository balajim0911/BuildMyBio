import React, { useState, useRef, useEffect } from 'react';
import { ResumeData, TemplateConfig, ATSEvaluation, TemplateId } from './types';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import AIBuilder from './components/AIBuilder';
import Logo from './components/Logo';
import { evaluateResumeATS } from './services/geminiService';
import { 
  FileText, 
  Download, 
  Settings, 
  Sparkles, 
  Layout, 
  Palette, 
  Type as TypeIcon,
  Loader2,
  Minimize,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileInput,
  Upload,
  X,
  Grid,
  Paintbrush,
  ChevronDown
} from 'lucide-react';

// Declaring html2pdf as it's loaded via CDN
declare const html2pdf: any;

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: 'Alex Anderson',
    email: 'alex.anderson@example.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'linkedin.com/in/alexanderson',
    location: 'San Francisco, CA',
    summary: 'Experienced software engineer with a passion for building scalable web applications and intuitive user experiences. Proven track record in full-stack development and technical leadership.',
  },
  experience: [
    {
      id: '1',
      company: 'Tech Solutions Inc.',
      role: 'Senior Developer',
      startDate: 'Jan 2021',
      endDate: 'Present',
      description: '• Led a team of 5 engineers to redesign the core product architecture.\n• Improved system performance by 40% through code optimization.\n• Mentored junior developers and conducted code reviews.',
    },
    {
      id: '2',
      company: 'WebCreate LLC',
      role: 'Frontend Developer',
      startDate: 'Jun 2018',
      endDate: 'Dec 2020',
      description: '• Developed responsive user interfaces using React and Tailwind CSS.\n• Collaborated with UX designers to implement pixel-perfect designs.\n• Integrated RESTful APIs and managed application state.',
    }
  ],
  education: [
    {
      id: '1',
      school: 'University of California, Berkeley',
      degree: 'B.S. Computer Science',
      year: '2018',
    }
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'UI/UX Design'],
};

const templates: { id: TemplateId; name: string; category: string }[] = [
  { id: 'modern', name: 'Modern Split', category: 'Modern' },
  { id: 'classic', name: 'Classic Professional', category: 'Traditional' },
  { id: 'minimalist', name: 'Clean Minimalist', category: 'Modern' },
  { id: 'creative', name: 'Creative Portfolio', category: 'Creative' },
  { id: 'executive', name: 'Executive Suite', category: 'Traditional' },
  { id: 'corporate', name: 'Corporate Bold', category: 'Traditional' },
  { id: 'deconstructed', name: 'Deconstructed', category: 'Modern' },
  { id: 'glacial', name: 'Glacial', category: 'Modern' },
  { id: 'tignum', name: 'Tignum', category: 'Creative' },
  { id: 'vanguard', name: 'Vanguard', category: 'Creative' },
  { id: 'academic', name: 'Academic', category: 'Traditional' },
  { id: 'ivy', name: 'Ivy League', category: 'Traditional' },
  { id: 'quartz', name: 'Quartz', category: 'Professional' },
  { id: 'horizon', name: 'Horizon', category: 'Professional' },
  { id: 'pillar', name: 'Pillar', category: 'Modern' },
  { id: 'blocks', name: 'Blocks', category: 'Professional' },
  { id: 'cesta', name: 'Cesta', category: 'Elegant' },
  { id: 'urban', name: 'Urban', category: 'Modern' },
  { id: 'slate', name: 'Slate', category: 'Bold' },
  { id: 'noble', name: 'Noble', category: 'Elegant' },
];

const colors = ['#0ea5e9', '#2563eb', '#7c3aed', '#db2777', '#dc2626', '#059669', '#1e293b', '#4b5563', '#000000'];
const fonts = [
  { id: 'sans', name: 'Inter (Standard)' },
  { id: 'serif', name: 'Merriweather (Serif)' },
  { id: 'poppins', name: 'Poppins (Modern)' },
  { id: 'lato', name: 'Lato (Humanist)' },
  { id: 'roboto', name: 'Roboto (Geometric)' },
  { id: 'opensans', name: 'Open Sans (Neutral)' },
  { id: 'playfair', name: 'Playfair (Elegant)' },
  { id: 'montserrat', name: 'Montserrat (Clean)' },
  { id: 'oswald', name: 'Oswald (Strong)' },
  { id: 'raleway', name: 'Raleway (Stylish)' },
  { id: 'lora', name: 'Lora (Contemporary)' },
];

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsEvaluation, setAtsEvaluation] = useState<ATSEvaluation | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  
  // ATS Mode State
  const [atsMode, setAtsMode] = useState<'builder' | 'external'>('builder');
  const [externalInputType, setExternalInputType] = useState<'text' | 'file'>('text');
  const [externalResumeText, setExternalResumeText] = useState('');
  const [externalFile, setExternalFile] = useState<{name: string, base64: string, mimeType: string} | null>(null);

  const [templateConfig, setTemplateConfig] = useState<TemplateConfig>({
    id: 'modern',
    name: 'Modern Split',
    primaryColor: '#0ea5e9',
    fontFamily: 'sans',
    fontSize: 10.5, // Default font size in pt
  });
  
  const resumeRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.8);

  const [activeTab, setActiveTab] = useState<'editor' | 'design' | 'ats'>('editor');
  const [designSubTab, setDesignSubTab] = useState<'templates' | 'style'>('templates');

  // Effect to calculate dynamic scale based on container width
  useEffect(() => {
    const calculateScale = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth;
        // A4 width in pixels (approx 794px at 96 DPI) + padding margin
        const a4WidthPx = 794; 
        const padding = 32; // Reduced padding for better fit
        
        const availableWidth = Math.max(containerWidth - padding, 200);
        
        // Calculate scale ratio
        let scale = availableWidth / a4WidthPx;
        
        // Clamp scale to reasonable limits
        scale = Math.min(Math.max(scale, 0.2), 1.5);
        
        setPreviewScale(scale);
      }
    };

    // Initial calculation
    calculateScale();

    // Listen for window resize
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result as string;
        // remove data:application/pdf;base64, prefix
        const base64Content = base64String.split(',')[1];
        setExternalFile({
            name: file.name,
            base64: base64Content,
            mimeType: file.type
        });
        setAtsEvaluation(null); // Reset score on new file
    };
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setExternalFile(null);
    setAtsEvaluation(null);
  };

  const handleAnalyzeATS = async (overrideData?: ResumeData) => {
    setIsAnalyzing(true);
    setAtsEvaluation(null);
    try {
      let payload: ResumeData | string | { base64: string; mimeType: string };

      if (overrideData) {
        payload = overrideData;
      } else if (atsMode === 'builder') {
        payload = resumeData;
      } else {
        // External Mode
        if (externalInputType === 'text') {
            payload = externalResumeText;
            // Accessing externalResumeText.trim() directly to avoid TS error with union type 'payload'
            if (!externalResumeText.trim()) {
              alert('Please paste resume content to analyze.');
              setIsAnalyzing(false);
              return;
            }
        } else {
            // File Mode
            if (!externalFile) {
                alert('Please upload a resume PDF.');
                setIsAnalyzing(false);
                return;
            }
            payload = { base64: externalFile.base64, mimeType: externalFile.mimeType };
        }
      }

      const evaluation = await evaluateResumeATS(payload, jobDescription);
      setAtsEvaluation(evaluation);
    } catch (error) {
      console.error("Failed to analyze ATS:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAIDataParsed = async (newData: Partial<ResumeData>) => {
    const mergedData = {
      ...resumeData,
      ...newData,
      personalInfo: { ...resumeData.personalInfo, ...(newData.personalInfo || {}) },
      experience: newData.experience || resumeData.experience,
      education: newData.education || resumeData.education,
      skills: newData.skills || resumeData.skills,
    };
    
    setResumeData(mergedData);
    
    // Switch to ATS tab, ensure builder mode, and auto-analyze
    setActiveTab('ats');
    setAtsMode('builder');
    await handleAnalyzeATS(mergedData);
  };

  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setJobDescription(newVal);
    // If user clears the JD, reset the evaluation so the main button reappears
    // allowing them to run a general health check instead.
    if (newVal.trim() === '') {
      setAtsEvaluation(null);
    }
  };

  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    
    setIsDownloading(true);
    
    // Increased delay to 800ms to ensure Tailwind CDN styles are fully calculated
    // before the PDF engine captures the DOM.
    await new Promise(resolve => setTimeout(resolve, 800));

    const element = resumeRef.current;
    
    const opt = {
      margin: 0,
      filename: `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setIsDownloading(false);
    }).catch((err: any) => {
      console.error("PDF generation failed:", err);
      setIsDownloading(false);
    });
  };

  // Determine if we are in External ATS Mode to adjust layout
  const isExternalAtsMode = activeTab === 'ats' && atsMode === 'external';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-0 group cursor-pointer">
            <div className="flex-shrink-0 transition-transform group-hover:scale-105 duration-300">
               <Logo className="h-12 w-auto" />
            </div>
            <h1 
              className="text-4xl font-caveat font-bold pt-2 tracking-wide -rotate-2 -ml-4"
              style={{ color: '#4A657D' }}
            >
              BuildMyBio
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAIModalOpen(true)}
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-brand-600 bg-brand-50 px-3 py-2 rounded-lg hover:bg-brand-100 transition-colors"
            >
              <Sparkles size={16} /> Auto-Create with AI
            </button>
            <button
              onClick={downloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Download size={16} /> Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* LEFT COLUMN: Editor & Config & ATS */}
          {/* Dynamically adjust width based on ATS mode */}
          <div className={`${isExternalAtsMode ? 'lg:col-span-8 lg:col-start-3' : 'lg:col-span-5'} flex flex-col h-full gap-6 transition-all duration-300`}>
            
            {/* Control Tabs */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex">
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'editor' 
                    ? 'bg-brand-50 text-brand-700 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText size={16} /> Content
              </button>
              <button
                onClick={() => setActiveTab('design')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'design' 
                    ? 'bg-brand-50 text-brand-700 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Settings size={16} /> Design
              </button>
              <button
                onClick={() => setActiveTab('ats')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'ats' 
                    ? 'bg-brand-50 text-brand-700 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Activity size={16} /> ATS Score
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              
              {/* --- EDITOR TAB --- */}
              {activeTab === 'editor' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 mb-4 sm:hidden">
                    <button 
                      onClick={() => setIsAIModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 text-brand-700 font-bold"
                    >
                      <Sparkles size={16} /> Auto-Fill with AI
                    </button>
                  </div>
                  <ResumeForm data={resumeData} onChange={setResumeData} />
                </div>
              )}

              {/* --- DESIGN TAB --- */}
              {activeTab === 'design' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full animate-in fade-in slide-in-from-right-2 duration-300 overflow-hidden">
                  
                  {/* Design Sub-Tabs */}
                  <div className="flex border-b border-gray-100">
                    <button
                      onClick={() => setDesignSubTab('templates')}
                      className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                        designSubTab === 'templates' ? 'text-brand-600 bg-brand-50/50 border-b-2 border-brand-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                       <Grid size={16} /> Templates
                    </button>
                    <button
                      onClick={() => setDesignSubTab('style')}
                      className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                        designSubTab === 'style' ? 'text-brand-600 bg-brand-50/50 border-b-2 border-brand-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                       <Paintbrush size={16} /> Formatting
                    </button>
                  </div>

                  <div className="p-6 overflow-y-auto flex-1">
                    
                    {/* SUB-TAB: TEMPLATES */}
                    {designSubTab === 'templates' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                          {templates.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => setTemplateConfig({ ...templateConfig, id: t.id })}
                              className={`group relative rounded-lg overflow-hidden border-2 transition-all aspect-[210/297] hover:shadow-lg ${
                                templateConfig.id === t.id
                                  ? 'border-brand-500 ring-2 ring-brand-200 ring-offset-1'
                                  : 'border-gray-200 hover:border-brand-300'
                              }`}
                            >
                               {/* Miniature Preview Rendering */}
                               <div className="absolute inset-0 w-[210mm] h-[297mm] origin-top-left transform scale-[0.12] bg-white pointer-events-none select-none overflow-hidden">
                                  <ResumePreview 
                                    data={resumeData} 
                                    config={{ ...templateConfig, id: t.id }} 
                                  />
                               </div>
                               
                               {/* Overlay for Name */}
                               <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 pt-6 flex flex-col justify-end">
                                  <span className="text-white text-[9px] font-bold shadow-sm leading-tight text-left truncate">{t.name}</span>
                                  <span className="text-white/70 text-[8px] text-left truncate">{t.category}</span>
                               </div>
                               
                               {/* Selected Indicator */}
                               {templateConfig.id === t.id && (
                                 <div className="absolute top-1.5 right-1.5 bg-brand-500 text-white rounded-full p-0.5 shadow-md">
                                   <CheckCircle2 size={10} />
                                 </div>
                               )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB: STYLE */}
                    {designSubTab === 'style' && (
                       <div className="space-y-8">
                         {/* Font Settings */}
                         <div>
                          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <TypeIcon size={16} /> Typography
                          </h3>
                          
                          <div className="grid grid-cols-1 gap-2 mb-6">
                            <div className="relative">
                              <select
                                value={templateConfig.fontFamily}
                                onChange={(e) => setTemplateConfig({ ...templateConfig, fontFamily: e.target.value as any })}
                                className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-brand-500 transition-colors"
                              >
                                {fonts.map((f) => (
                                  <option key={f.id} value={f.id}>
                                    {f.name}
                                  </option>
                                ))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <ChevronDown size={16} />
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Minimize size={14} /> Font Size
                              </span>
                              <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200 text-gray-500">
                                {templateConfig.fontSize}pt
                              </span>
                            </div>
                            <input
                              type="range"
                              min="8"
                              max="14"
                              step="0.5"
                              value={templateConfig.fontSize}
                              onChange={(e) => setTemplateConfig({ ...templateConfig, fontSize: parseFloat(e.target.value) })}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                              <span>Small</span>
                              <span>Medium</span>
                              <span>Large</span>
                            </div>
                          </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Color Selection */}
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Palette size={16} /> Accent Color
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {colors.map((c) => (
                              <button
                                key={c}
                                onClick={() => setTemplateConfig({ ...templateConfig, primaryColor: c })}
                                className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                                  templateConfig.primaryColor === c ? 'border-gray-400 ring-2 ring-offset-2 ring-gray-300' : 'border-transparent'
                                }`}
                                style={{ backgroundColor: c }}
                              >
                                {templateConfig.primaryColor === c && <CheckCircle2 size={16} className="text-white drop-shadow-md" />}
                              </button>
                            ))}
                            <div className="relative group w-10 h-10">
                               <input 
                                  type="color" 
                                  className="w-full h-full opacity-0 absolute cursor-pointer z-10"
                                  onChange={(e) => setTemplateConfig({...templateConfig, primaryColor: e.target.value})}
                               />
                               <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500 border-2 border-gray-200 flex items-center justify-center">
                                 <span className="text-lg text-white font-bold drop-shadow-md">+</span>
                               </div>
                            </div>
                          </div>
                        </div>
                       </div>
                    )}

                  </div>
                </div>
              )}

              {/* --- ATS TAB --- */}
              {activeTab === 'ats' && (
                <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-right-2 duration-300">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
                      <Activity size={20} className="text-brand-600" /> ATS Compatibility Score
                    </h3>
                    <p className="text-sm text-gray-500">
                      See how well your resume performs against automated tracking systems.
                    </p>
                  </div>

                  {/* Mode Toggle */}
                  <div className="bg-gray-100 p-1 rounded-lg flex mb-6">
                    <button
                      onClick={() => { setAtsMode('builder'); setAtsEvaluation(null); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                        atsMode === 'builder' 
                          ? 'bg-white text-brand-700 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Layout size={14} /> Builder Resume
                    </button>
                    <button
                      onClick={() => { setAtsMode('external'); setAtsEvaluation(null); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                        atsMode === 'external' 
                          ? 'bg-white text-brand-700 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <FileInput size={14} /> External Resume
                    </button>
                  </div>

                  {/* External Mode Content */}
                  {atsMode === 'external' && (
                    <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* Sub-tabs for Text vs PDF */}
                      <div className="flex gap-4 mb-4 border-b border-gray-200">
                         <button
                           onClick={() => { setExternalInputType('text'); setAtsEvaluation(null); }}
                           className={`pb-2 text-sm font-medium transition-colors relative ${
                             externalInputType === 'text' 
                               ? 'text-brand-600 border-b-2 border-brand-600' 
                               : 'text-gray-500 hover:text-gray-700'
                           }`}
                         >
                           Paste Text
                         </button>
                         <button
                           onClick={() => { setExternalInputType('file'); setAtsEvaluation(null); }}
                           className={`pb-2 text-sm font-medium transition-colors relative ${
                             externalInputType === 'file' 
                               ? 'text-brand-600 border-b-2 border-brand-600' 
                               : 'text-gray-500 hover:text-gray-700'
                           }`}
                         >
                           Upload PDF
                         </button>
                      </div>

                      {externalInputType === 'text' ? (
                        <div className="animate-in fade-in duration-200">
                           <label className="block text-sm font-bold text-gray-700 mb-2">
                             Resume Content
                           </label>
                           <textarea
                             className="w-full h-48 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none resize-none text-sm bg-white font-mono"
                             placeholder="Paste the full text content of your resume here to check its score..."
                             value={externalResumeText}
                             onChange={(e) => setExternalResumeText(e.target.value)}
                           />
                        </div>
                      ) : (
                        <div className="animate-in fade-in duration-200">
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                             Resume PDF
                           </label>
                           {!externalFile ? (
                             <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                                <input 
                                  type="file" 
                                  accept="application/pdf"
                                  onChange={handleFileUpload}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <div className="flex flex-col items-center gap-2 text-gray-500">
                                   <Upload size={32} className="text-gray-400" />
                                   <span className="font-medium text-gray-700">Click to upload PDF</span>
                                   <span className="text-xs">Supported format: .pdf</span>
                                </div>
                             </div>
                           ) : (
                             <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg">
                                <div className="flex items-center gap-3">
                                   <div className="p-2 bg-blue-100 rounded text-blue-600">
                                     <FileText size={20} />
                                   </div>
                                   <div>
                                     <p className="text-sm font-bold text-gray-800">{externalFile.name}</p>
                                     <p className="text-xs text-gray-500">PDF Document</p>
                                   </div>
                                </div>
                                <button 
                                  onClick={clearFile}
                                  className="p-1 hover:bg-blue-100 rounded-full text-gray-500 hover:text-red-500 transition-colors"
                                >
                                  <X size={18} />
                                </button>
                             </div>
                           )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Job Description Input */}
                  <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
                      <span>Target Job Description</span>
                      <span className="text-xs font-normal text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">Optional</span>
                    </label>
                    <textarea
                      className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none resize-none text-sm bg-white"
                      placeholder="Paste the job description here to check keyword matching and relevance (Recommended for accurate scoring)..."
                      value={jobDescription}
                      onChange={handleJobDescriptionChange}
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                       <CheckCircle2 size={12} className="text-green-600"/> 
                       Adding a JD enables keyword, skills, and experience gap analysis.
                    </p>
                  </div>

                  {!atsEvaluation && !isAnalyzing && (
                      <div className="text-center py-2">
                          <button 
                              onClick={() => handleAnalyzeATS()}
                              className="bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30 w-full sm:w-auto"
                          >
                              {jobDescription.trim() ? 'Analyze Against JD' : 'Analyze General Health'}
                          </button>
                      </div>
                  )}

                  {isAnalyzing && (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                          <Loader2 size={40} className="animate-spin mb-4 text-brand-500" />
                          <p>Scanning resume against criteria...</p>
                      </div>
                  )}

                  {atsEvaluation && !isAnalyzing && (
                      <>
                          {/* Score Gauge */}
                          <div className="relative w-48 h-48 mx-auto mb-8">
                             {/* SVG Gauge Implementation */}
                             <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path
                                  className="text-gray-100"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                />
                                <path
                                  className={`${
                                      atsEvaluation.score >= 75 ? 'text-green-500' : 
                                      atsEvaluation.score >= 50 ? 'text-yellow-500' : 'text-red-500'
                                  }`}
                                  strokeDasharray={`${atsEvaluation.score}, 100`}
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                />
                             </svg>
                             <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-4xl font-bold ${
                                      atsEvaluation.score >= 75 ? 'text-green-600' : 
                                      atsEvaluation.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                    {atsEvaluation.score}
                                </span>
                                <span className="text-xs uppercase font-bold text-gray-400">Score</span>
                             </div>
                          </div>

                          {/* Feedback List */}
                          <div>
                              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                  <Sparkles size={16} className="text-yellow-500" /> AI Feedback
                              </h4>
                              <div className="space-y-3">
                                  {atsEvaluation.feedback.map((item, i) => (
                                      <div key={i} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                                          {atsEvaluation.score >= 75 ? (
                                              <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                                          ) : (
                                              <AlertCircle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                                          )}
                                          <p className="text-sm text-gray-700">{item}</p>
                                      </div>
                                  ))}
                              </div>
                          </div>
                          
                          <button 
                              onClick={() => handleAnalyzeATS()}
                              className="w-full mt-6 py-2 text-sm text-gray-500 hover:text-gray-900 underline"
                          >
                              Refresh Analysis
                          </button>
                      </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Preview */}
          {/* Conditionally render: Hide if in External ATS Mode */}
          {!isExternalAtsMode && (
            <div 
              ref={previewContainerRef}
              className="lg:col-span-7 bg-gray-200/50 rounded-xl border border-gray-200 p-4 sm:p-8 flex justify-center items-start overflow-y-auto overflow-x-hidden h-[calc(100vh-8rem)] sticky top-24"
            >
              <div 
                style={{ 
                  transform: `scale(${previewScale})`,
                  marginBottom: `-${(1 - previewScale) * 297 * 3.78}px` 
                }}
                className="origin-top transition-transform duration-300 shadow-2xl mb-20"
              >
                <ResumePreview 
                  data={resumeData} 
                  config={templateConfig} 
                  targetRef={resumeRef}
                />
              </div>
            </div>
          )}

        </div>
      </main>

      <AIBuilder 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        onDataParsed={handleAIDataParsed} 
      />
    </div>
  );
};

export default App;