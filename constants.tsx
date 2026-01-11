
import { Type } from "@google/genai";
import { Language } from "./types";

export const COURSE_BUILDER_PROMPT = (data: any) => {
  const langMap: Record<Language, string> = {
    es: "ESPAÑOL DE ESPAÑA",
    en: "ENGLISH (UK/US)",
    fr: "FRANÇAIS"
  };

  return `
Actúa como un profesor catedrático y diseñador instruccional senior experto en ${data.topic}.
Tu misión es diseñar un curso ALTAMENTE ELABORADO Y PROFUNDO para un alumno con perfil "${data.profile}", nivel "${data.level}".

REGLAS DE ELABORACIÓN Y MULTIMEDIA:
1. Nivel de Detalle: No te limites a definiciones simples. Explica los "por qué" y los "cómo" detrás de cada concepto.
2. Estructura de Lección: Cada "Idea Clave" debe ser un análisis profundo (mínimo 6-8 frases bien estructuradas).
3. Búsqueda de Video (CRÍTICO): Para CADA lección, utiliza la herramienta googleSearch para encontrar un vídeo educativo en YouTube que sea público y permita su reproducción. 
   - Prioriza canales como TED-Ed, Khan Academy, CrashCourse o similares.
   - Debes proporcionar una URL de YouTube válida y funcional en el campo videoUrl.
   - Asegúrate de que el video sea exactamente sobre el tema tratado en la lección.
4. Rigor Académico: Usa terminología técnica adecuada al nivel pero explicada con claridad.

IMPORTANTE: El idioma de todo el contenido debe ser ${langMap[data.language as Language] || "ESPAÑOL"}.

Debes incluir:
1. Título y descripción de alto impacto.
2. Objetivos de aprendizaje ambiciosos.
3. 4 a 6 Unidades con 2 a 3 lecciones cada una.
4. En cada lección: Idea Clave extensa, Ejemplo de caso real complejo, Actividad de aplicación práctica, Video ilustrativo de YouTube (URL real) y Test.
5. Evaluación final desafiante.
`;
};

export const TRANSLATIONS: Record<Language, any> = {
  es: {
    brand: "Profesor",
    slogan: "Tu Aula Virtual con IA",
    subtitle: "Diseña cursos personalizados al instante. Aprende lo que quieras, cuando quieras, con tutoría inteligente.",
    createCourse: "Crear Curso Ahora",
    designing: "Diseñando tu Aula Virtual...",
    syncing: "Sincronizando...",
    synced: "Sincronizado",
    history: "Tus Cursos Guardados",
    noHistory: "Aún no has creado ningún curso.",
    language: "Idioma",
    form: {
      topic: "¿Qué quieres aprender?",
      topicPlaceholder: "Ej. Física Cuántica para principiantes",
      level: "Tu Nivel",
      profile: "Tu Perfil",
      profilePlaceholder: "Ej. Estudiante universitario",
      objective: "Tu Objetivo Principal",
      objectivePlaceholder: "Ej. Aprobar el examen de acceso",
      time: "Tiempo Disponible",
      timePlaceholder: "Ej. 2 horas al día",
      format: "Formato de Contenido",
      levels: ["Principiante", "Intermedio", "Avanzado"],
      formats: ["Lecturas breves", "Lecturas + ejercicios", "Esquemas + problemas", "Mixto"]
    },
    classroom: {
      plan: "Plan de Estudios",
      progress: "Tu Progreso",
      lessonsOf: "de lecciones",
      unit: "Unidad",
      lesson: "Lección",
      prev: "Anterior",
      next: "Siguiente Lección",
      start: "Empezar curso ahora",
      objectives: "Objetivos de Aprendizaje",
      stats: { level: "Nivel", time: "Tiempo", units: "Unidades", lessons: "Lecciones" },
      blocks: {
        keyIdea: "Análisis Profundo",
        example: "Caso de Uso Real",
        activity: "Reto Práctico",
        video: "Soporte Visual Ilustrativo",
        videoExternal: "Ver en YouTube",
        test: "Quick Check",
        checkBtn: "Comprobar Conocimiento",
        correct: "🎯 ¡Perfecto! Has dominado los conceptos de esta lección.",
        wrong: "💡 Buen intento. Revisa las respuestas correctas antes de continuar.",
        continue: "Completar y Seguir"
      },
      final: {
        evaluation: "Evaluación Final",
        evaluationDesc: "Demuestra todo lo que has aprendido en este viaje.",
        submit: "Entregar Evaluación",
        result: "Tu Resultado",
        pass: "🏆 ¡Excelente! Has superado los objetivos del curso.",
        fail: "📚 No te rindas. Un repaso te ayudará a consolidar estos temas.",
        challenges: "Desafíos Finales",
        challengesDesc: "Pon a prueba tu aprendizaje con estos proyectos prácticos.",
        sources: "Fuentes y Referencias"
      }
    }
  },
  en: {
    brand: "Teacher",
    slogan: "Your AI Virtual Classroom",
    subtitle: "Design personalized courses instantly. Learn whatever you want, whenever you want, with intelligent tutoring.",
    createCourse: "Create Course Now",
    designing: "Designing your Virtual Classroom...",
    syncing: "Syncing...",
    synced: "Synced",
    history: "Your Saved Courses",
    noHistory: "You haven't created any courses yet.",
    language: "Language",
    form: {
      topic: "What do you want to learn?",
      topicPlaceholder: "e.g. Quantum Physics for beginners",
      level: "Your Level",
      profile: "Your Profile",
      profilePlaceholder: "e.g. University student",
      objective: "Main Objective",
      objectivePlaceholder: "e.g. Pass the entrance exam",
      time: "Available Time",
      timePlaceholder: "e.g. 2 hours per day",
      format: "Content Format",
      levels: ["Beginner", "Intermediate", "Advanced"],
      formats: ["Short readings", "Readings + exercises", "Outlines + problems", "Mixed"]
    },
    classroom: {
      plan: "Curriculum",
      progress: "Your Progress",
      lessonsOf: "of lessons",
      unit: "Unit",
      lesson: "Lesson",
      prev: "Previous",
      next: "Next Lesson",
      start: "Start course now",
      objectives: "Learning Objectives",
      stats: { level: "Level", time: "Time", units: "Units", lessons: "Lessons" },
      blocks: {
        keyIdea: "In-depth Analysis",
        example: "Real World Case",
        activity: "Practical Challenge",
        video: "Illustrative Visual Support",
        videoExternal: "Watch on YouTube",
        test: "Quick Check",
        checkBtn: "Check Knowledge",
        correct: "🎯 Perfect! You have mastered the concepts of this lesson.",
        wrong: "💡 Good try. Review the correct answers before continuing.",
        continue: "Complete and Continue"
      },
      final: {
        evaluation: "Final Evaluation",
        evaluationDesc: "Show everything you've learned on this journey.",
        submit: "Submit Evaluation",
        result: "Your Result",
        pass: "🏆 Excellent! You have exceeded the course objectives.",
        fail: "📚 Don't give up. A review will help you consolidate these topics.",
        challenges: "Final Challenges",
        challengesDesc: "Test your learning with these practical projects.",
        sources: "Sources & References"
      }
    }
  },
  fr: {
    brand: "Professeur",
    slogan: "Votre Salle de Classe IA",
    subtitle: "Concevez des cours personnalisés instantanément. Apprenez ce que vous voulez, quand vous le souhaitez.",
    createCourse: "Créer le cours maintenant",
    designing: "Conception de votre classe...",
    syncing: "Synchronisation...",
    synced: "Synchronisé",
    history: "Vos cours enregistrés",
    noHistory: "Vous n'avez pas encore créé de cours.",
    language: "Langue",
    form: {
      topic: "Que voulez-vous apprendre ?",
      topicPlaceholder: "Ex. Physique quantique pour débutants",
      level: "Votre Niveau",
      profile: "Votre Profil",
      profilePlaceholder: "Ex. Étudiant universitaire",
      objective: "Objectif Principal",
      objectivePlaceholder: "Ex. Réussir l'examen d'entrée",
      time: "Temps Disponible",
      timePlaceholder: "Ex. 2 heures par jour",
      format: "Format du Contenu",
      levels: ["Débutant", "Intermédiaire", "Avancé"],
      formats: ["Lectures courtes", "Lectures + exercices", "Schémas + problèmes", "Mixte"]
    },
    classroom: {
      plan: "Programme d'Études",
      progress: "Votre Progrès",
      lessonsOf: "de leçons",
      unit: "Unité",
      lesson: "Leçon",
      prev: "Précédent",
      next: "Leçon Suivante",
      start: "Commencer le cours",
      objectives: "Objectifs d'Apprentissage",
      stats: { level: "Niveau", time: "Temps", units: "Unités", lessons: "Leçons" },
      blocks: {
        keyIdea: "Analyse Approfondie",
        example: "Cas d'Utilisation Réel",
        activity: "Défi Pratique",
        video: "Support Visuel Illustratif",
        videoExternal: "Voir sur YouTube",
        test: "Vérification Rapide",
        checkBtn: "Vérifier les Connaissances",
        correct: "🎯 Parfait ! Vous maîtrisez les concepts de esta leçon.",
        wrong: "💡 Bon essai. Révisez les bonnes respuestas avant de continuer.",
        continue: "Terminer et Continuer"
      },
      final: {
        evaluation: "Évaluation Finale",
        evaluationDesc: "Montrez tout ce que vous avez appris au cours de ce voyage.",
        submit: "Soumettre l'Évaluation",
        result: "Votre Résultat",
        pass: "🏆 Excellent ! Vous avez dépassé les objectifs du cours.",
        fail: "📚 N'abandonnez pas. Une révision vous aidera à consolider ces sujets.",
        challenges: "Défis Finaux",
        challengesDesc: "Testez vos acquis avec ces projets pratiques.",
        sources: "Sources et Références"
      }
    }
  }
};

export const COURSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    level: { type: Type.STRING },
    targetProfile: { type: Type.STRING },
    duration: { type: Type.STRING },
    learningObjectives: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    units: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          lessons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                blocks: {
                  type: Type.OBJECT,
                  properties: {
                    keyIdea: { type: Type.STRING },
                    appliedExample: { type: Type.STRING },
                    activity: { type: Type.STRING },
                    videoUrl: { type: Type.STRING, description: "URL de un video educativo de YouTube que sea público." },
                    quickTest: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          question: { type: Type.STRING },
                          options: { type: Type.ARRAY, items: { type: Type.STRING } },
                          correctAnswer: { type: Type.STRING }
                        },
                        required: ["question", "options", "correctAnswer"]
                      }
                    }
                  },
                  required: ["keyIdea", "appliedExample", "activity", "quickTest"]
                }
              },
              required: ["id", "title", "blocks"]
            }
          }
        },
        required: ["id", "title", "summary", "lessons"]
      }
    },
    finalAssessment: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.STRING }
        },
        required: ["question", "options", "correctAnswer"]
      }
    },
    finalProjects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["title", "description"]
      }
    },
    sources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          url: { type: Type.STRING },
          type: { type: Type.STRING }
        },
        required: ["title", "url", "type"]
      }
    }
  },
  required: ["title", "description", "level", "targetProfile", "duration", "learningObjectives", "units", "finalAssessment", "finalProjects", "sources"]
};
