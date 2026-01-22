
import { Type } from "@google/genai";
import { Language } from "./types";

export const COURSE_BUILDER_PROMPT = (data: any) => {
  const langMap: Record<Language, string> = {
    fr: "FRANÇAIS",
    es: "ESPAÑOL DE ESPAÑA",
    en: "ENGLISH (UK/US)"
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
4. Rigor Académico: Usa terminología técnica adecuada al nivel pero explicada con claridad.

IMPORTANTE: El idioma de todo el contenido debe ser ${langMap[data.language as Language] || "FRANÇAIS"}.
`;
};

export const TRANSLATIONS: Record<Language, any> = {
  fr: {
    brand: "Professeur",
    nav: {
      home: "Accueil",
      classroom: "Aula Sami",
      about: "À Propos",
      blog: "Blog"
    },
    slogan: "Votre Salle de Classe IA",
    subtitle: "Concevez des cours personnalisés instantanément. Apprenez ce que vous voulez, quand vous le souhaitez, avec un tutorat intelligent.",
    createCourse: "Créer le cours maintenant",
    designing: "Conception de votre classe...",
    syncing: "Synchronisation...",
    synced: "Synchronisé",
    history: "Vos cours enregistrés",
    noHistory: "Vous n'avez pas encore créé de cours.",
    language: "Langue",
    about: {
      title: "Notre Vision",
      desc: "ProfesseurIA est né pour démocratiser l'éducation de haut niveau. Nous utilisons des modèles de langage de pointe pour créer des expériences d'apprentissage qui s'adaptent à vous, et non l'inverse.",
      stats: ["+10k Cours Générés", "Apprentissage 24h/7", "Précision Académique"]
    },
    blog: {
      title: "Actualités Éducatives",
      posts: [
        { title: "L'avenir de l'IA dans les salles de classe", date: "15 Oct", desc: "Comment les enseignants utilisent les agents IA pour personnaliser l'étude." },
        { title: "Deep Learning et Neurosciences", date: "10 Oct", desc: "Pourquoi l'apprentissage actif est plus efficace que la simple mémorisation." },
        { title: "Guide d'étude efficace avec l'IA", date: "05 Oct", desc: "Techniques modernes pour maximiser votre temps avec ProfesseurIA." }
      ]
    },
    form: {
      topic: "Que voulez-vous apprendre ?",
      topicPlaceholder: "Ex. Physique Quantique pour débutants",
      level: "Votre Niveau",
      profile: "Votre Profil",
      profilePlaceholder: "Ex. Étudiant universitaire",
      objective: "Objectif Principal",
      objectivePlaceholder: "Ex. Réussir un examen",
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
        correct: "🎯 Parfait ! Vous maîtrisez les concepts de cette leçon.",
        wrong: "💡 Bon essai. Révisez les bonnes réponses avant de continuer.",
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
  },
  es: {
    brand: "Profesor",
    nav: {
      home: "Inicio",
      classroom: "Aula Sami",
      about: "A propos",
      blog: "Blog"
    },
    slogan: "Tu Aula Virtual con IA",
    subtitle: "Diseña cursos personalizados al instante. Aprende lo que quieras, cuando quieras.",
    createCourse: "Crear Curso Ahora",
    designing: "Diseñando tu Aula Virtual...",
    syncing: "Sincronizando...",
    synced: "Sincronizado",
    history: "Tus Cursos Guardados",
    noHistory: "Aún no has creado ningún curso.",
    language: "Idioma",
    about: {
      title: "Nuestra Visión",
      desc: "ProfesorIA nació para democratizar la educación de alto nivel.",
      stats: ["+10k Cursos Generados", "Aprendizaje 24/7", "Precisión Académica"]
    },
    blog: {
      title: "Actualidad Educativa",
      posts: [
        { title: "El futuro de la IA", date: "15 Oct", desc: "IA en las aulas." },
        { title: "Neurociencia", date: "10 Oct", desc: "Aprendizaje activo." },
        { title: "Guía eficiente", date: "05 Oct", desc: "Maximiza tu tiempo." }
      ]
    },
    form: {
      topic: "¿Qué quieres aprender?",
      topicPlaceholder: "Ej. Física Cuántica",
      level: "Tu Nivel",
      profile: "Tu Perfil",
      profilePlaceholder: "Ej. Estudiante",
      objective: "Tu Objetivo",
      objectivePlaceholder: "Ej. Aprobar examen",
      time: "Tiempo",
      timePlaceholder: "Ej. 2 horas",
      format: "Formato",
      levels: ["Principiante", "Intermedio", "Avanzado"],
      formats: ["Lecturas breves", "Lecturas + ejercicios", "Esquemas", "Mixto"]
    },
    classroom: {
      plan: "Plan de Estudios",
      progress: "Tu Progreso",
      lessonsOf: "de lecciones",
      unit: "Unidad",
      lesson: "Lección",
      prev: "Anterior",
      next: "Siguiente Lección",
      start: "Empezar curso",
      objectives: "Objetivos de Aprendizaje",
      stats: { level: "Nivel", time: "Tiempo", units: "Unidades", lessons: "Lecciones" },
      blocks: {
        keyIdea: "Análisis Profundo",
        example: "Caso de Uso Real",
        activity: "Reto Práctico",
        video: "Soporte Visual",
        videoExternal: "Ver en YouTube",
        test: "Quick Check",
        checkBtn: "Comprobar",
        correct: "🎯 ¡Perfecto!",
        wrong: "💡 Buen intento.",
        continue: "Continuar"
      },
      final: {
        evaluation: "Evaluación Final",
        evaluationDesc: "Demuestra lo aprendido.",
        submit: "Entregar",
        result: "Resultado",
        pass: "🏆 ¡Excelente!",
        fail: "📚 Repasa un poco.",
        challenges: "Proyectos",
        challengesDesc: "Proyectos prácticos.",
        sources: "Fuentes"
      }
    }
  },
  en: {
    brand: "Teacher",
    nav: {
      home: "Home",
      classroom: "Sami Classroom",
      about: "About Us",
      blog: "Blog"
    },
    slogan: "Your AI Virtual Classroom",
    subtitle: "Design personalized courses instantly. Learn what you want.",
    createCourse: "Create Course Now",
    about: {
      title: "Our Vision",
      desc: "TeacherAI democratizes education.",
      stats: ["+10k Courses", "24/7 Learning", "Academic Precision"]
    },
    blog: {
      title: "Educational News",
      posts: [
        { title: "AI Future", date: "Oct 15", desc: "AI agents in class." },
        { title: "Neuroscience", date: "Oct 10", desc: "Active learning." },
        { title: "Study Guide", date: "Oct 05", desc: "Maximize time." }
      ]
    },
    form: {
      topic: "Topic",
      topicPlaceholder: "e.g. Quantum Physics",
      level: "Level",
      profile: "Profile",
      profilePlaceholder: "e.g. Student",
      objective: "Objective",
      objectivePlaceholder: "e.g. Pass exam",
      time: "Time",
      timePlaceholder: "e.g. 2 hours",
      format: "Format",
      levels: ["Beginner", "Intermediate", "Advanced"],
      formats: ["Short", "Exercises", "Outlines", "Mixed"]
    },
    classroom: {
      plan: "Curriculum",
      progress: "Progress",
      lessonsOf: "of lessons",
      unit: "Unit",
      lesson: "Lesson",
      prev: "Previous",
      next: "Next",
      start: "Start now",
      objectives: "Objectives",
      stats: { level: "Level", time: "Time", units: "Units", lessons: "Lessons" },
      blocks: {
        keyIdea: "In-depth Analysis",
        example: "Real Case",
        activity: "Challenge",
        video: "Video Support",
        videoExternal: "YouTube",
        test: "Check",
        checkBtn: "Check",
        correct: "🎯 Perfect!",
        wrong: "💡 Try again.",
        continue: "Continue"
      },
      final: {
        evaluation: "Final Evaluation",
        evaluationDesc: "Show knowledge.",
        submit: "Submit",
        result: "Result",
        pass: "🏆 Excellent!",
        fail: "📚 Review.",
        challenges: "Challenges",
        challengesDesc: "Projects.",
        sources: "Sources"
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
                    videoUrl: { type: Type.STRING },
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
