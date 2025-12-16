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

export type TemplateId = 'modern' | 'classic' | 'minimalist';

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  primaryColor: string; // User adjustable override
  fontFamily: 'sans' | 'serif' | 'poppins'; // User adjustable override
}
