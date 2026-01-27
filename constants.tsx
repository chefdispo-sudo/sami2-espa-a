
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
3. FILTRAGE VIDÉO : Utilisez l'outil googleSearch pour trouver des vidéos YouTube. 
   - CONDITION CRITIQUE : La vidéo DOIT être "intégrable" (embeddable). Priorisez les chaînes éducatives majeures (TED-Ed, Khan Academy, Veritasium, ScienceEtonnante). 
   - Vérifiez que la vidéo est publique. Si vous avez un doute sur l'intégration, laissez le champ videoUrl vide.
4. MOMENTS LIVE : À la fin de chaque Module (Unit), suggérez un sujet de débat ou de réflexion profonde pour une "Session en Direct" via Google Meet.

IMPORTANT : Tout le contenu doit être rédigé en ${selectedLang}.
`;
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
    live: {
      title: "Classe en Direct",
      subtitle: "Rejoignez votre professeur ou vos pairs pour une session interactive.",
      joinBtn: "Rejoindre sur Google Meet",
      noSession: "Aucune session live n'est programmée pour le moment.",
      setup: "Lien de votre salle virtuelle"
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
      stats: { level: "Niveau", time: "Temps", units: "Modules", lessons: "Leçons" },
      blocks: {
        keyIdea: "Analyse Théorique Approfondie",
        example: "Application Pratique & Cas Réel",
        activity: "Atelier de Réflexion Critique",
        video: "Support de Conférence",
        videoExternal: "YouTube",
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
      about: "A propos",
      blog: "Blog",
      logout: "Salir"
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
    live: {
      title: "Clase en Directo",
      subtitle: "Únete a la sesión interactiva en tiempo real.",
      joinBtn: "Entrar a Google Meet",
      noSession: "No hay clases programadas.",
      setup: "Configurar Aula"
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
      stats: { level: "Nivel", time: "Tiempo", units: "Módulos", lessons: "Lecciones" },
      blocks: {
        keyIdea: "Análisis Teórico Profundo",
        example: "Caso Real",
        activity: "Actividad",
        video: "Video",
        videoExternal: "YouTube",
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
    live: {
      title: "Live Classroom",
      subtitle: "Join the real-time interactive session.",
      joinBtn: "Join Google Meet",
      noSession: "No live sessions scheduled.",
      setup: "Setup Room"
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
      stats: { level: "Level", time: "Time", units: "Modules", lessons: "Lessons" },
      blocks: {
        keyIdea: "In-Depth Theoretical Analysis",
        example: "Case Study",
        activity: "Practical Lab",
        video: "Video Support",
        videoExternal: "YouTube",
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
                    videoUrl: { type: Type.STRING, description: "Embeddable YouTube URL only." },
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
