
import { GoogleGenAI } from "@google/genai";
import { COURSE_BUILDER_PROMPT, COURSE_SCHEMA } from "./constants";
import { CourseFormData, Course, Source } from "./types";

export const generateCourse = async (formData: CourseFormData): Promise<Course> => {
  // Correctly initialize GoogleGenAI using process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    // Prepare initial parts with the prompt
    const parts: any[] = [{ text: COURSE_BUILDER_PROMPT(formData) }];

    // If there are attachments, add them as inlineData parts
    if (formData.attachments && formData.attachments.length > 0) {
      formData.attachments.forEach(file => {
        parts.push({
          inlineData: {
            data: file.data,
            mimeType: file.mimeType
          }
        });
      });
      
      // Add a directive to prioritize the attached files
      parts.push({
        text: "IMPORTANTE: Utiliza EXCLUSIVAMENTE o PRIORITARIAMENTE la información contenida en los archivos adjuntos para diseñar este curso. Si el archivo es un PDF o documento, analízalo a fondo y extrae los conceptos clave."
      });
    }

    const response = await ai.models.generateContent({
      // Switched to gemini-3-flash-preview for significantly faster course generation (low latency)
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: COURSE_SCHEMA,
        tools: [{ googleSearch: {} }],
        // Disabling thinking budget for immediate response since the structure is fixed by the schema
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    
    const course = JSON.parse(text) as Course;

    // Rule: Extract grounding metadata URLs when using Google Search and add them to the course sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      const searchSources: Source[] = groundingChunks
        .filter((chunk: any) => chunk && chunk.web)
        .map((chunk: any) => ({
          title: chunk.web.title || "Web Reference",
          url: chunk.web.uri,
          type: "web"
        }));
      
      if (searchSources.length > 0) {
        course.sources = [...(course.sources || []), ...searchSources];
      }
    }

    return course;
  } catch (error) {
    console.error("Error generating course:", error);
    throw error;
  }
};
