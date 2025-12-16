export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    location: string;
    summary: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
}

export type TemplateId = 
  | 'modern' 
  | 'classic' 
  | 'minimalist' 
  | 'creative' 
  | 'executive'
  | 'corporate'
  | 'deconstructed'
  | 'glacial'
  | 'tignum'
  | 'vanguard'
  | 'academic'
  | 'ivy'
  | 'quartz'
  | 'horizon'
  | 'pillar'
  | 'blocks'
  | 'cesta'
  | 'urban'
  | 'slate'
  | 'noble';

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  primaryColor: string; // User adjustable override
  fontFamily: 'sans' | 'serif' | 'poppins'; // User adjustable override
  fontSize: number; // User adjustable base font size in pt
}

export interface ATSEvaluation {
  score: number;
  feedback: string[];
}