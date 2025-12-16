import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

// Initialize lazily to prevent crash on load if API key is missing
let ai: GoogleGenAI | null = null;
const getAIClient = () => {
  if (!ai) {
     // Use a dummy key if not present to allow app to load,
     // but actual requests will fail gracefully later.
     // Or better: throw if called without key.
     const key = process.env.API_KEY;
     if (!key) {
        throw new Error("Gemini API Key is missing");
     }
     ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
};

export const parseResumeFromText = async (text: string): Promise<Partial<ResumeData>> => {
  try {
    const client = getAIClient();
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

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
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
