import React, { useState, useRef } from 'react';
import { ResumeData, TemplateConfig } from './types';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import AIBuilder from './components/AIBuilder';
import { 
  FileText, 
  Download, 
  Settings, 
  Sparkles, 
  Layout, 
  Palette, 
  Type as TypeIcon,
  Loader2,
  Maximize,
  Minimize
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

const templates: { id: TemplateConfig['id']; name: string }[] = [
  { id: 'modern', name: 'Modern Split' },
  { id: 'classic', name: 'Classic Professional' },
  { id: 'minimalist', name: 'Clean Minimalist' },
  { id: 'creative', name: 'Creative Portfolio' },
  { id: 'executive', name: 'Executive Suite' },
];

const colors = ['#0ea5e9', '#2563eb', '#7c3aed', '#db2777', '#dc2626', '#059669', '#1e293b', '#4b5563', '#000000'];
const fonts = [
  { id: 'sans', name: 'Inter (Sans)' },
  { id: 'serif', name: 'Merriweather (Serif)' },
  { id: 'poppins', name: 'Poppins (Modern)' },
];

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig>({
    id: 'modern',
    name: 'Modern Split',
    primaryColor: '#0ea5e9',
    fontFamily: 'sans',
    fontSize: 10.5, // Default font size in pt
  });
  
  const resumeRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'design'>('editor');

  const handleAIDataParsed = (newData: Partial<ResumeData>) => {
    setResumeData(prev => ({
      ...prev,
      ...newData,
      personalInfo: { ...prev.personalInfo, ...(newData.personalInfo || {}) },
      experience: newData.experience || prev.experience,
      education: newData.education || prev.education,
      skills: newData.skills || prev.skills,
    }));
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

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-2 rounded text-white">
              <FileText size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-purple-600">
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
          
          {/* LEFT COLUMN: Editor & Config */}
          <div className="lg:col-span-5 flex flex-col h-full gap-6">
            
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
                <FileText size={16} /> Content Editor
              </button>
              <button
                onClick={() => setActiveTab('design')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'design' 
                    ? 'bg-brand-50 text-brand-700 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Settings size={16} /> Design & Customize
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {activeTab === 'editor' ? (
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
              ) : (
                <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-right-2 duration-300">
                  
                  {/* Template Selection */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Layout size={16} /> Select Template
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {templates.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTemplateConfig({ ...templateConfig, id: t.id })}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${
                            templateConfig.id === t.id
                              ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className="font-medium text-gray-800">{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                   {/* Font Settings */}
                   <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <TypeIcon size={16} /> Typography & Sizing
                    </h3>
                    
                    {/* Font Family */}
                    <div className="space-y-2 mb-6">
                      {fonts.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setTemplateConfig({ ...templateConfig, fontFamily: f.id as any })}
                          className={`w-full p-3 rounded-lg border text-left transition-all ${
                            templateConfig.fontFamily === f.id
                              ? 'border-brand-500 bg-brand-50 text-brand-700'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <span className={`text-base ${
                            f.id === 'serif' ? 'font-serif' : f.id === 'poppins' ? 'font-poppins' : 'font-sans'
                          }`}>
                            {f.name}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Font Size Slider */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Minimize size={14} /> Base Size
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
                        <span>Compact</span>
                        <span>Normal</span>
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
                          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                            templateConfig.primaryColor === c ? 'border-gray-400 ring-2 ring-offset-2 ring-gray-300' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <div className="relative group">
                         <input 
                            type="color" 
                            className="w-8 h-8 opacity-0 absolute cursor-pointer"
                            onChange={(e) => setTemplateConfig({...templateConfig, primaryColor: e.target.value})}
                         />
                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500 border-2 border-gray-200 flex items-center justify-center">
                           <span className="text-[10px] text-white font-bold">+</span>
                         </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Preview */}
          <div className="lg:col-span-7 bg-gray-200/50 rounded-xl border border-gray-200 p-4 sm:p-8 flex justify-center items-start overflow-auto h-[calc(100vh-8rem)] sticky top-24">
            <div className="scale-[0.6] sm:scale-[0.7] md:scale-[0.85] lg:scale-[0.9] origin-top transition-transform duration-300 shadow-2xl">
              <ResumePreview 
                data={resumeData} 
                config={templateConfig} 
                targetRef={resumeRef}
              />
            </div>
          </div>

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