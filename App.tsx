
import React, { useState, useEffect } from 'react';
import CourseForm from './components/CourseForm';
import Sidebar from './components/Sidebar';
import LessonContent from './components/LessonContent';
import Assessment from './components/Assessment';
import UserRegistrationForm from './components/UserRegistrationForm';
import { generateCourse } from './geminiService';
import { Course, CourseFormData, Language, UserData } from './types';
import { TRANSLATIONS } from './constants';
import { supabase } from './supabaseClient';
import { generateCoursePDF } from './pdfService';

// URL del Webhook de Google Sheets
const GOOGLE_SHEET_WEBHOOK = 'https://script.google.com/macros/s/AKfycbwmgSYVCTEJ_DJF7q9D6bySEMQ05zHhYMRLu4v4zu8KDGHY2Ieuy_vVL5qkKCWH0h1n/exec';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'classroom'>('home');
  const [user, setUser] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('profesoria_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [activeUnitId, setActiveUnitId] = useState<string>('');
  const [activeLessonId, setActiveLessonId] = useState<string>('');
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('profesoria_completed');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('profesoria_lang');
    return (saved as Language) || 'es';
  });
  const [courseHistory, setCourseHistory] = useState<Course[]>([]);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    localStorage.setItem('profesoria_lang', language);
  }, [language]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('courseId');

    if (courseId) {
      const savedCourse = localStorage.getItem(`profesoria_course_${courseId}`);
      if (savedCourse) {
        setCourse(JSON.parse(savedCourse));
        setView('classroom');
      }
    }

    const history: Course[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('profesoria_course_')) {
        try {
          const c = JSON.parse(localStorage.getItem(key)!);
          if (c) history.push(c);
        } catch(e) {}
      }
    }
    setCourseHistory(history.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode, view]);

  const sendToGoogleSheet = async (type: string, details: any, specificUser?: UserData) => {
    const currentUser = specificUser || user;
    if (!currentUser) return;

    setIsSyncing(true);
    const params = new URLSearchParams();
    params.append('timestamp', new Date().toLocaleString());
    params.append('userName', currentUser.name);
    params.append('userEmail', currentUser.email);
    params.append('sessionId', currentUser.sessionId);
    params.append('interactionType', type);
    params.append('courseTitle', course?.title || (details?.courseTitle) || 'Navegando Home');
    params.append('details', typeof details === 'string' ? details : JSON.stringify(details));

    try {
      await fetch(GOOGLE_SHEET_WEBHOOK, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });
      setTimeout(() => setIsSyncing(false), 1500);
    } catch (error) {
      console.error("Error en Google Sheets:", error);
      setIsSyncing(false);
    }
  };

  const handleGoHome = () => {
    setView('home');
    setCourse(null);
    window.history.pushState({}, '', window.location.pathname);
    sendToGoogleSheet('VOLVER_INICIO', { message: "Usuario regresó al home" });
  };

  const handleDownloadPDF = async () => {
    if (!course) return;
    setIsExporting(true);
    try {
      await generateCoursePDF(course, language);
      sendToGoogleSheet('DESCARGA_PDF', { courseTitle: course.title });
    } catch (error) {
      console.error("PDF Export Error:", error);
      alert("Error al generar el PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleRegister = async (userData: UserData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .insert([{ name: userData.name, email: userData.email }]);

      if (error) console.warn("Supabase insert warning:", error.message);
      
      localStorage.setItem('profesoria_user', JSON.stringify(userData));
      setUser(userData);
      sendToGoogleSheet('REGISTRO', { message: "Nuevo alumno registrado" }, userData);
    } catch (err) {
      console.error("Critical error during registration:", err);
      localStorage.setItem('profesoria_user', JSON.stringify(userData));
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCourse = async (formData: CourseFormData) => {
    setIsLoading(true);
    try {
      const generated = await generateCourse({ ...formData, language });
      const newCourse: Course = { 
        ...generated, 
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now()
      };
      
      localStorage.setItem(`profesoria_course_${newCourse.id}`, JSON.stringify(newCourse));
      setCourse(newCourse);
      setView('classroom');
      
      if (newCourse.units.length > 0) {
        setActiveUnitId(newCourse.units[0].id);
        setActiveLessonId(newCourse.units[0].lessons[0].id);
      }
      
      window.history.pushState({}, '', `?courseId=${newCourse.id}`);
      sendToGoogleSheet('CURSO_CREADO', { 
        courseId: newCourse.id, 
        courseTitle: newCourse.title,
        topic: formData.topic 
      });
    } catch (error) {
      console.error(error);
      alert("Error al generar el curso.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCourseFromHistory = (c: Course) => {
    setCourse(c);
    setView('classroom');
    if (c.units.length > 0) {
      setActiveUnitId(c.units[0].id);
      setActiveLessonId(c.units[0].lessons[0].id);
    }
    window.history.pushState({}, '', `?courseId=${c.id}`);
    sendToGoogleSheet('CURSO_CARGADO_HISTORIAL', { courseTitle: c.title });
  };

  const handleLessonComplete = () => {
    if (!activeLessonId || !course) return;
    if (!completedLessons.includes(activeLessonId)) {
      const updated = [...completedLessons, activeLessonId];
      setCompletedLessons(updated);
      localStorage.setItem('profesoria_completed', JSON.stringify(updated));
      
      const currentUnit = course.units.find(u => u.id === activeUnitId);
      const currentLesson = currentUnit?.lessons.find(l => l.id === activeLessonId);
      
      sendToGoogleSheet('LECCION_COMPLETA', { 
        lessonId: activeLessonId, 
        lessonTitle: currentLesson?.title,
        unitTitle: currentUnit?.title
      });
    }
  };

  const navigateTo = (direction: 'next' | 'prev') => {
    if (!course) return;
    const allItems: { uId: string; lId: string }[] = [];
    course.units.forEach(u => {
      u.lessons.forEach(l => { allItems.push({ uId: u.id, lId: l.id }); });
    });
    allItems.push({ uId: 'final', lId: 'assessment' }, { uId: 'final', lId: 'project' }, { uId: 'final', lId: 'sources' });

    const currentIndex = allItems.findIndex(item => item.lId === activeLessonId);
    if (direction === 'next' && currentIndex < allItems.length - 1) {
      const next = allItems[currentIndex + 1];
      setActiveUnitId(next.uId);
      setActiveLessonId(next.lId);
    } else if (direction === 'prev' && currentIndex > 0) {
      const prev = allItems[currentIndex - 1];
      setActiveUnitId(prev.uId);
      setActiveLessonId(prev.lId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const continueWhereILeftOff = () => {
    if (course && course.units.length > 0) {
      const all = course.units.flatMap(u => u.lessons.map(l => ({ uId: u.id, lId: l.id })));
      const next = all.find(item => !completedLessons.includes(item.lId)) || all[0];
      setActiveUnitId(next.uId);
      setActiveLessonId(next.lId);
    }
  };

  if (!user) {
    return <UserRegistrationForm courseTitle={course?.title || "ProfesorIA"} onRegister={handleRegister} language={language} />;
  }

  const currentUnit = course?.units.find(u => u.id === activeUnitId);
  const currentLesson = currentUnit?.lessons.find(l => l.id === activeLessonId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-500">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-4 px-6 md:px-10 flex justify-between items-center sticky top-0 z-[60]">
        <div className="flex items-center gap-3">
          {view === 'classroom' && (
            <button onClick={handleGoHome} className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-xl transition-all" title="Volver al Inicio">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
          )}
          <div 
            onClick={handleGoHome}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight hidden sm:block">
              {t.brand}<span className="text-indigo-600">IA</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-6">
          {view === 'classroom' && (
            <button 
              disabled={isExporting}
              onClick={handleDownloadPDF}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase transition-all ${isExporting ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20'}`}
            >
              {isExporting ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              )}
              <span className="hidden md:inline">{isExporting ? 'Generando...' : 'Descargar PDF'}</span>
            </button>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full hidden xs:flex">
            <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {isSyncing ? 'Sincronizando' : 'Conectado'}
            </span>
          </div>

          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['es', 'en', 'fr'] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase transition-all ${language === l ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {l}
              </button>
            ))}
          </div>

          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 shadow-sm">
            {isDarkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {view === 'home' ? (
        <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[0.9]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600">{t.slogan}</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
              Hola, <span className="text-indigo-600 font-black">{user.name}</span>. {t.subtitle}
            </p>
          </div>
          
          <div className="relative group mb-32">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[3rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <CourseForm onSubmit={handleCreateCourse} isLoading={isLoading} language={language} />
          </div>

          {courseHistory.length > 0 && (
            <section className="space-y-8">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{t.history}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseHistory.map(c => (
                  <button
                    key={c.id}
                    onClick={() => loadCourseFromHistory(c)}
                    className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-500 transition-all hover:shadow-xl"
                  >
                    <h4 className="text-xl font-black text-slate-800 dark:text-white mb-3 group-hover:text-indigo-600 transition-colors leading-tight">{c.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{c.description}</p>
                  </button>
                ))}
              </div>
            </section>
          )}
        </main>
      ) : (
        <div className="flex flex-1 overflow-hidden relative">
          {course && (
            <Sidebar 
              course={course} 
              activeLessonId={activeLessonId} 
              onSelectLesson={(uId, lId) => {
                setActiveUnitId(uId);
                setActiveLessonId(lId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              completedLessons={completedLessons}
              language={language}
            />
          )}

          <main className="flex-1 overflow-y-auto px-6 py-12 lg:p-16 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-4xl mx-auto pb-40">
              {activeUnitId === 'final' ? (
                <Assessment 
                  type={activeLessonId as any} 
                  questions={course?.finalAssessment} 
                  projects={course?.finalProjects} 
                  sources={course?.sources}
                  language={language}
                  onComplete={(score) => sendToGoogleSheet('EVALUACION_FINAL', { 
                    score, 
                    total: course?.finalAssessment.length,
                    courseTitle: course?.title
                  })}
                />
              ) : currentLesson ? (
                <>
                  <div className="space-y-8 mb-16">
                    <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px]">
                      <span>{t.classroom.unit} {course?.units.findIndex(u => u.id === activeUnitId)! + 1}</span>
                      <span className="opacity-30">/</span>
                      <span>{t.classroom.lesson} {currentUnit?.lessons.findIndex(l => l.id === activeLessonId)! + 1}</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter">
                      {currentLesson.title}
                    </h2>
                  </div>

                  <LessonContent 
                    lesson={currentLesson} 
                    onComplete={handleLessonComplete}
                    isCompleted={completedLessons.includes(activeLessonId)}
                    language={language}
                  />

                  <div className="flex justify-between items-center pt-16 mt-24 border-t border-slate-200 dark:border-slate-800">
                    <button onClick={() => navigateTo('prev')} className="px-8 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 font-black text-xs uppercase hover:bg-white dark:hover:bg-slate-900 transition-all">
                      {t.classroom.prev}
                    </button>
                    <button onClick={() => navigateTo('next')} className="px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black shadow-xl text-xs uppercase hover:bg-indigo-700 transition-all">
                      {t.classroom.next}
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 text-center shadow-2xl">
                  <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-8 leading-tight">{course?.title}</h2>
                  <button onClick={continueWhereILeftOff} className="px-12 py-6 bg-indigo-600 text-white font-black text-xl rounded-2xl shadow-3xl hover:bg-indigo-700 transition-all">
                    {t.classroom.start}
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
