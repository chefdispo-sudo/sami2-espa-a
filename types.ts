
export type Language = 'es' | 'en' | 'fr';

export interface UserData {
  name: string;
  email: string;
  sessionId: string;
}

export interface FilePart {
  data: string;
  mimeType: string;
  name?: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Lesson {
  id: string;
  title: string;
  blocks: {
    keyIdea: string;
    appliedExample: string;
    activity: string;
    videoUrl?: string;
    quickTest: Question[];
  };
}

export interface Unit {
  id: string;
  title: string;
  summary: string;
  lessons: Lesson[];
}

export interface ProjectProposal {
  title: string;
  description: string;
}

export interface Source {
  title: string;
  url: string;
  type: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  targetProfile: string;
  duration: string;
  learningObjectives: string[];
  units: Unit[];
  finalAssessment: Question[];
  finalProjects: ProjectProposal[];
  sources: Source[];
  createdAt: number;
}

export interface CourseFormData {
  topic: string;
  level: string;
  profile: string;
  objective: string;
  time: string;
  format: string;
  language: Language;
  attachments?: FilePart[];
}
