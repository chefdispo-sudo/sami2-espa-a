
import { GoogleGenAI } from "@google/genai";
import { COURSE_BUILDER_PROMPT, COURSE_SCHEMA, CHATBOT_SYSTEM_INSTRUCTION } from "./constants";
import { CourseFormData, Course, Source, ChatMessage, Language } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCourse = async (formData: CourseFormData): Promise<Course> => {
  try {
    const parts: any[] = [{ text: COURSE_BUILDER_PROMPT(formData) }];

    if (formData.attachments && formData.attachments.length > 0) {
      formData.attachments.forEach(file => {
        parts.push({
          inlineData: {
            data: file.data,
            mimeType: file.mimeType
          }
        });
      });
      
      parts.push({
        text: "IMPORTANTE: Utiliza EXCLUSIVAMENTE o PRIORITARIAMENTE la información contenida en los archivos adjuntos para diseñar este curso. Si el archivo es un PDF o documento, analízalo a fondo y extrae los conceptos clave."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: COURSE_SCHEMA,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    
    const course = JSON.parse(text) as Course;

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

export const streamChatResponse = async (
  messages: ChatMessage[],
  courseTitle: string,
  lessonTitle: string,
  userName: string,
  language: Language,
  onChunk: (chunk: string) => void
) => {
  try {
    const contents = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: CHATBOT_SYSTEM_INSTRUCTION(courseTitle, lessonTitle, userName, language),
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });

    for await (const chunk of response) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Chat error:", error);
    onChunk("Désolé, j'ai rencontré une erreur technique. Veuillez réessayer.");
  }
};
