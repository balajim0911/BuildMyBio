import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, ATSEvaluation } from "../types";

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    // Safely access import.meta.env
    const viteEnv = (import.meta as any).env;
    const apiKey = (viteEnv?.VITE_GEMINI_API_KEY) || (typeof process !== 'undefined' ? process.env.VITE_GEMINI_API_KEY : undefined);

    if (!apiKey) {
      console.warn("VITE_GEMINI_API_KEY is not set. AI features will fail.");
    }
    aiClient = new GoogleGenAI({ apiKey: apiKey || '' });
  }
  return aiClient;
};

export const parseResumeFromText = async (text: string): Promise<Partial<ResumeData>> => {
  try {
    const ai = getAiClient();
    const prompt = `
      You are an expert resume parser. Extract the following information from the provided text into a structured JSON format.
      
      Text to parse:
      "${text}"
      
      Return a JSON object with:
      - personalInfo (fullName, email, phone, linkedin, location, summary)
      - experience (array of objects with company, role, startDate, endDate, description)
      - education (array of objects with school, degree, year)
      - skills (array of strings)

      If specific fields are missing, leave them as empty strings or empty arrays. 
      Ensure dates are formatted as "Month Year" (e.g., "Jan 2023") if possible.
      Summarize the 'description' for experience into bullet points if it is a paragraph.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalInfo: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                location: { type: Type.STRING },
                summary: { type: Type.STRING },
              },
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
              },
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  school: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  year: { type: Type.STRING },
                },
              },
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    if (response.text) {
      const parsedData = JSON.parse(response.text);
      // Add IDs for React rendering stability
      if (parsedData.experience) {
        parsedData.experience = parsedData.experience.map((exp: any) => ({
          ...exp,
          id: Math.random().toString(36).substr(2, 9),
        }));
      }
      if (parsedData.education) {
        parsedData.education = parsedData.education.map((edu: any) => ({
          ...edu,
          id: Math.random().toString(36).substr(2, 9),
        }));
      }
      return parsedData;
    }
    throw new Error("No data returned from AI");
  } catch (error) {
    console.error("Error parsing resume with Gemini:", error);
    throw error;
  }
};

export const evaluateResumeATS = async (
  data: ResumeData | string | { base64: string; mimeType: string }, 
  jobDescription?: string
): Promise<ATSEvaluation> => {
  try {
    const ai = getAiClient();
    const jdContext = jobDescription 
      ? `JOB DESCRIPTION TO MATCH AGAINST:\n"${jobDescription}"\n\nPerform a strict gap analysis between the Resume and this Job Description.` 
      : `NO JOB DESCRIPTION PROVIDED.\nEvaluate based on general ATS best practices for a generic role suitable for this candidate's experience level. Mention in feedback that providing a Job Description would improve accuracy.`;

    const parts: any[] = [];

    // 1. Instructions
    const instructions = `
      You are an advanced ATS (Applicant Tracking System) Score Checker. 
      Your task is to evaluate a resume based on a specific set of rigorous conditions and calculate a score.

      ${jdContext}

      EVALUATION CONDITIONS & SCORING MODEL:
      Use the following weighted criteria to calculate the score. The total raw points sum to 115. You must normalize the final score to a 0-100 scale.

      1. Keyword Matching (40 points) [CRITICAL]
         - Extract keywords from JD (if provided). Check for exact and partial matches.
         - Check for synonyms and frequency.
         - If no JD, score based on presence of industry-standard keywords for the role implied by the resume.

      2. Skills Match (25 points)
         - Check skills section and mentions in experience.
         - Hard/Technical skills vs Soft skills.
         - Penalize missing mandatory skills (if JD provided).

      3. Experience Match (15 points)
         - Years of experience vs required (if JD provided).
         - Relevant domain experience.
         - Progression and career path.

      4. Job Title Similarity (8 points)
         - Past titles vs Target title (if JD provided, otherwise infer target).

      5. Education Match (6 points)
         - Degree relevance and level.

      6. Certifications (6 points)
         - Presence of relevant certifications.

      7. Resume Structure & Formatting (5 points)
         - Clear standard sections (Skills, Experience, Education).
         - Data is structured (JSON provided implies structure is readable).

      8. Action Verbs & Achievements (4 points)
         - Usage of strong action verbs (Spearheaded, Architected, etc.).
         - Quantified achievements (numbers, percentages, $ savings).

      9. Grammar & Readability (3 points)
         - Spelling, grammar, sentence clarity.

      10. Length & Density (3 points)
          - Content density appropriate for 1-2 pages.
          - No keyword stuffing.

      OUTPUT INSTRUCTIONS:
      - Calculate the raw score based on the above (max ~115).
      - Normalize to 0-100.
      - Return a JSON object with:
        - "score" (integer 0-100)
        - "feedback" (array of 3-5 strings). Feedback must be specific. If JD is provided, mention missing keywords or skills explicitly. If score is low, explain why based on the criteria above.
    `;

    parts.push({ text: instructions });

    // 2. Resume Content (Text or File)
    if (typeof data === 'string') {
        parts.push({ text: `RESUME TEXT CONTENT:\n"${data}"` });
    } else if ('base64' in data) {
        // PDF File Support
        parts.push({ text: "RESUME FILE (PDF) - Evaluate the content of this file:" });
        parts.push({
            inlineData: {
                data: data.base64,
                mimeType: data.mimeType
            }
        });
    } else {
        parts.push({ text: `RESUME DATA (JSON):\n${JSON.stringify(data)}` });
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ATSEvaluation;
    }
    throw new Error("No ATS evaluation returned");
  } catch (error) {
    console.error("Error evaluating ATS score:", error);
    throw error;
  }
};
