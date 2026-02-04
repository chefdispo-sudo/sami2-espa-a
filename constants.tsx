
import { Type } from "@google/genai";
import { Language } from "./types";

export const COURSE_BUILDER_PROMPT = (data: any) => {
  const langMap: Record<Language, string> = {
    fr: "FRANÇAIS",
    es: "ESPAÑOL",
    en: "ENGLISH"
  };

  const selectedLang = langMap[data.language as Language] || "FRANÇAIS";

  return `
Agissez en tant que professeur titulaire de chaire et concepteur pédagogique senior. Votre expertise porte sur : ${data.topic}.
Votre mission est de concevoir un cours magistral d'une PROFONDEUR ACADÉMIQUE EXCEPTIONNELLE pour un profil "${data.profile}", niveau "${data.level}".

RÈGLES DE RÉDACTION ET QUALITÉ :
1. Rigueur et Détail : Fournissez des explications théoriques denses, des nuances historiques, techniques et conceptuelles. CHAQUE "Idée Clé" doit faire entre 15 et 20 phrases structurées. Ne soyez pas superficiel.
2. Structure : Chaque leçon doit être un voyage intellectuel complet, allant des fondamentaux aux débats contemporains.
3. MOMENTS LIVE : À la fin de chaque Module (Unit), suggérez un sujet de débat ou de réflexion profonde pour une "Session en Direct" via Google Meet.

IMPORTANT : Tout le contenu doit être rédigé en ${selectedLang}.
`;
};

export const CHATBOT_SYSTEM_INSTRUCTION = (courseTitle: string, lessonTitle: string, userName: string, language: Language) => {
  return `Vous êtes le "Tuteur Sami", un assistant pédagogique IA intégré à la plateforme ProfesseurIA.
Votre mission actuelle est d'aider ${userName} qui étudie le cours "${courseTitle}", spécifiquement la leçon "${lessonTitle}".
RÈGLES :
1. Répondez de manière concise mais académiquement rigoureuse.
2. Soyez encourageant et utilisez la méthode socratique : si l'élève pose une question sur un concept, expliquez-le puis posez une question courte pour vérifier sa compréhension.
3. Répondez exclusivement en ${language === 'fr' ? 'français' : language === 'es' ? 'espagnol' : 'anglais'}.
4. Ne donnez jamais les réponses aux tests directement, guidez l'apprenant vers la solution.`;
};

export const TRANSLATIONS: Record<Language, any> = {
  fr: {
    brand: "Professeur",
    nav: {
      home: "Accueil",
      classroom: "Aula Sami",
      live: "En Direct",
      about: "À Propos",
      blog: "Blog",
      logout: "Quitter"
    },
    chatbot: {
      title: "Tuteur Sami",
      placeholder: "Posez votre question...",
      welcome: "Bonjour ! Je suis votre tuteur. Comment puis-je vous aider sur cette leçon ?",
    },
    slogan: "L'Excellence Académique Augmentée",
    subtitle: "Concevez des parcours de masterclass avec support IA et sessions synchrones en direct.",
    createCourse: "Lancer la Masterclass",
    designing: "Élaboration du cursus magistral...",
    syncing: "Synchronisation...",
    synced: "Session sécurisée",
    history: "Ma Bibliothèque",
    noHistory: "Votre bibliothèque est vide.",
    language: "Langue",
    logoutConfirm: "Souhaitez-vous fermer votre session ? Votre progression est sauvegardée.",
    form: {
      topic: "Sujet de la Masterclass",
      topicPlaceholder: "Ex: Économie Comportementale ou Physique Quantique",
      level: "Niveau Académique",
      levels: ["Débutant", "Intermédiaire", "Avancé", "Expert / Master"],
      profile: "Profil de l'Apprenant",
      profilePlaceholder: "Ex: Étudiant en Master, Professionnel en reconversion",
      objective: "Objectif Pédagogique",
      objectivePlaceholder: "Ex: Comprendre les mécanismes de décision",
      time: "Durée Estimée",
      timePlaceholder: "Ex: 10 heures",
      format: "Format du Cours",
      formats: ["Express", "Standard", "Intensif", "Magistral"]
    },
    live: {
      title: "Classe en Direct",
      subtitle: "Rejoignez votre professeur ou vos pairs pour une session interactive.",
      joinBtn: "Rejoindre sur Google Meet",
      noSession: "Aucune session live n'est programmée pour le moment.",
      setup: "Lien de votre salle virtuelle"
    },
    about: {
      title: "À Propos de ProfesseurIA",
      desc: "Une plateforme d'éducation de précision utilisant les modèles de langage les plus avancés pour générer des cursus académiques denses et structurés.",
      stats: ["+10k Cours Générés", "98% Satisfaction", "Support 24/7"]
    },
    blog: {
      title: "Journal de l'Éducation IA",
      posts: [
        { date: "15 Mai 2024", title: "L'impact des LLM sur l'enseignement supérieur", desc: "Comment l'IA redéfinit la relation entre le professeur et l'étudiant." },
        { date: "02 Mai 2024", title: "Apprentissage Adaptatif : Le futur est là", desc: "Pourquoi la personnalisation de masse est enfin possible grâce au cloud." }
      ]
    },
    classroom: {
      plan: "Cursus",
      progress: "Avancement",
      lessonsOf: "leçons",
      unit: "Module",
      lesson: "Leçon",
      prev: "Précédent",
      next: "Suivant",
      start: "Ouvrir le module",
      objectives: "Objectifs d'Apprentissage",
      downloadPDF: "Télécharger le PDF",
      stats: { level: "Niveau", time: "Temps", units: "Modules", lessons: "Leçons" },
      blocks: {
        keyIdea: "Analyse Théorique Approfondie",
        example: "Application Pratique & Cas Réel",
        activity: "Atelier de Réflexion Critique",
        test: "Examen de Module",
        checkBtn: "Vérifier la Maîtrise",
        correct: "🎯 Concepts maîtrisés avec succès.",
        wrong: "💡 Analyse à revoir. Consultez les références.",
        continue: "Terminer et Continuer"
      },
      final: {
        evaluation: "Grand Examen Final",
        evaluationDesc: "Validation globale de vos acquis académiques.",
        submit: "Soumettre l'Examen",
        result: "Résultat Final",
        pass: "🏆 Masterclass validée avec mention.",
        fail: "📚 Des lacunes subsistent. Un second passage est recommandé.",
        challenges: "Projets de Fin d'Études",
        challengesDesc: "Applications concrètes de haute complexité.",
        sources: "Bibliographie de Référence",
        exitBtn: "Fermer le Cursus et Sauvegarder"
      }
    }
  },
  es: {
    brand: "Profesor",
    nav: {
      home: "Inicio",
      classroom: "Aula Sami",
      live: "En Directo",
      about: "Nosotros",
      blog: "Blog",
      logout: "Salir"
    },
    chatbot: {
      title: "Tutor Sami",
      placeholder: "Escribe tu duda...",
      welcome: "¡Hola! Soy tu tutor. ¿Cómo puedo ayudarte con esta lección?",
    },
    slogan: "Excelencia Académica IA",
    subtitle: "Diseña cursos profundos con soporte en vivo.",
    createCourse: "Crear Masterclass",
    designing: "Redactando contenido académico...",
    syncing: "Sincronizando...",
    synced: "Progreso guardado",
    history: "Mis Cursos",
    noHistory: "No tienes cursos aún.",
    language: "Idioma",
    logoutConfirm: "¿Cerrar sesión? Tu progreso está a salvo.",
    form: {
      topic: "Tema de la Masterclass",
      topicPlaceholder: "Ej: Economía Conductual o Física Cuántica",
      level: "Nivel Académico",
      levels: ["Principiante", "Intermedio", "Avanzado", "Experto / Máster"],
      profile: "Perfil del Estudiante",
      profilePlaceholder: "Ej: Estudiante de Máster, Profesional en transición",
      objective: "Objetivo Pedagógico",
      objectivePlaceholder: "Ej: Comprender los mecanismos de decisión",
      time: "Duración Estimada",
      timePlaceholder: "Ej: 10 horas",
      format: "Formato del Curso",
      formats: ["Express", "Estándar", "Intensivo", "Magistral"]
    },
    live: {
      title: "Clase en Directo",
      subtitle: "Únete a la sesión interactiva en tiempo real.",
      joinBtn: "Entrar a Google Meet",
      noSession: "No hay clases programadas.",
      setup: "Configurar Aula"
    },
    about: {
      title: "Sobre ProfesorIA",
      desc: "Plataforma de educación de precisión que utiliza los modelos de lenguaje más avanzados para generar currículos académicos densos.",
      stats: ["+10k Cursos", "98% Satisfacción", "Soporte 24/7"]
    },
    blog: {
      title: "Diario de Educación IA",
      posts: [
        { date: "15 Mayo 2024", title: "Impacto de LLM en educación superior", desc: "Cómo la IA redefine la relación profesor-estudiante." },
        { date: "02 Mayo 2024", title: "Aprendizaje Adaptativo", desc: "La personalización masiva por fin es posible." }
      ]
    },
    classroom: {
      plan: "Plan de Estudios",
      progress: "Progreso",
      lessonsOf: "lecciones",
      unit: "Módulo",
      lesson: "Lección",
      prev: "Anterior",
      next: "Siguiente",
      start: "Empezar",
      objectives: "Objetivos",
      downloadPDF: "Descargar PDF",
      stats: { level: "Nivel", time: "Tiempo", units: "Módulos", lessons: "Lecciones" },
      blocks: {
        keyIdea: "Análisis Teórico Profundo",
        example: "Caso Real",
        activity: "Actividad",
        test: "Prueba",
        checkBtn: "Validar",
        correct: "🎯 ¡Excelente!",
        wrong: "💡 Revisa de nuevo.",
        continue: "Continuar"
      },
      final: {
        evaluation: "Examen Final",
        evaluationDesc: "Demuestra lo aprendido.",
        submit: "Enviar",
        result: "Resultado",
        pass: "🏆 Certificado",
        fail: "📚 Repasar",
        challenges: "Proyectos",
        challengesDesc: "Retos finales.",
        sources: "Fuentes",
        exitBtn: "Salir y Guardar"
      }
    }
  },
  en: {
    brand: "Teacher",
    nav: {
      home: "Home",
      classroom: "Sami Classroom",
      live: "Live Class",
      about: "About Us",
      blog: "Blog",
      logout: "Log Out"
    },
    chatbot: {
      title: "Sami Tutor",
      placeholder: "Ask me anything...",
      welcome: "Hello! I am your tutor. How can I help you with this lesson?",
    },
    slogan: "Deep Academic AI",
    subtitle: "Masterclass generation with live session support.",
    createCourse: "Start Masterclass",
    designing: "Writing deep curriculum...",
    syncing: "Syncing...",
    synced: "Progress saved",
    history: "My Library",
    noHistory: "No courses found.",
    language: "Language",
    logoutConfirm: "Are you sure? Your progress is saved.",
    form: {
      topic: "Masterclass Topic",
      topicPlaceholder: "e.g. Behavioral Economics or Quantum Physics",
      level: "Academic Level",
      levels: ["Beginner", "Intermediate", "Advanced", "Expert / Master"],
      profile: "Student Profile",
      profilePlaceholder: "e.g. Master Student, Professional retraining",
      objective: "Learning Objective",
      objectivePlaceholder: "e.g. Understand decision mechanisms",
      time: "Estimated Duration",
      timePlaceholder: "e.g. 10 hours",
      format: "Course Format",
      formats: ["Express", "Standard", "Intensive", "Magistral"]
    },
    live: {
      title: "Live Classroom",
      subtitle: "Join the real-time interactive session.",
      joinBtn: "Join Google Meet",
      noSession: "No live sessions scheduled.",
      setup: "Setup Room"
    },
    about: {
      title: "About TeacherAI",
      desc: "Precision education platform using advanced language models to generate dense, structured academic curricula.",
      stats: ["+10k Generated Courses", "98% Satisfaction", "24/7 Support"]
    },
    blog: {
      title: "IA Education Journal",
      posts: [
        { date: "May 15, 2024", title: "The impact of LLMs on higher education", desc: "How AI redefines the teacher-student relationship." },
        { date: "May 2, 2024", title: "Adaptive Learning: The future is here", desc: "Why mass personalization is finally possible." }
      ]
    },
    classroom: {
      plan: "Curriculum",
      progress: "Progress",
      lessonsOf: "lessons",
      unit: "Module",
      lesson: "Lesson",
      prev: "Prev",
      next: "Next",
      start: "Start",
      objectives: "Objectives",
      downloadPDF: "Download PDF",
      stats: { level: "Level", time: "Time", units: "Modules", lessons: "Lessons" },
      blocks: {
        keyIdea: "In-Depth Theoretical Analysis",
        example: "Case Study",
        activity: "Practical Lab",
        test: "Module Quiz",
        checkBtn: "Check Mastery",
        correct: "🎯 Concept mastered.",
        wrong: "💡 Review suggested.",
        continue: "Continue"
      },
      final: {
        evaluation: "Final Exam",
        evaluationDesc: "Test your overall knowledge.",
        submit: "Submit",
        result: "Final Score",
        pass: "🏆 Certified",
        fail: "📚 Review needed.",
        challenges: "Final Projects",
        challengesDesc: "Complex application tasks.",
        sources: "Bibliography",
        exitBtn: "Exit and Save"
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
                    keyIdea: { type: Type.STRING, description: "Detailed theoretical explanation (min 15 sentences)." },
                    appliedExample: { type: Type.STRING },
                    activity: { type: Type.STRING },
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
