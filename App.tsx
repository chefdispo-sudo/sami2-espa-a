
import React, { useState, useEffect } from 'react';
import CourseForm from './components/CourseForm';
import Sidebar from './components/Sidebar';
import LessonContent from './components/LessonContent';
import Assessment from './components/Assessment';
import UserRegistrationForm from './components/UserRegistrationForm';
import AdSense from './components/AdSense';
import { generateCourse } from './geminiService';
import { Course, CourseFormData, Language, UserData } from './types';
import { TRANSLATIONS } from './constants';
import { supabase } from './supabaseClient';
import { generateCoursePDF } from './pdfService';

const GOOGLE_SHEET_WEBHOOK = 'https://script.google.com/macros/s/AKfycbwmgSYVCTEJ_DJF7q9D6bySEMQ05zHhYMRLu4v4zu8KDGHY2Ieuy_vVL5qkKCWH0h1n/exec';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'classroom' | 'about' | 'blog'>('home');
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
    // Prioridad por defecto: Francés
    return (saved as Language) || 'fr';
  });
  const [courseHistory, setCourseHistory] = useState<Course[]>([]);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    localStorage.setItem('profesoria_lang', language);
  }, [language]);

  useEffect(() => {
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
  }, [isDarkMode]);

  const sendToGoogleSheet = async (type: string, details: any, specificUser?: UserData) => {
    const currentUser = specificUser || user;
    if (!currentUser) return;
    setIsSyncing(true);
    const params = new URLSearchParams();
    params.append('timestamp', new Date().toLocaleString());
    params.append('userName', currentUser.name);
    params.append('userEmail', currentUser.email);
    params.append('interactionType', type);
    params.append('courseTitle', course?.title || 'Home');
    params.append('details', JSON.stringify(details));
    try {
      await fetch(GOOGLE_SHEET_WEBHOOK, { method: 'POST', mode: 'no-cors', body: params.toString() });
      setTimeout(() => setIsSyncing(false), 1000);
    } catch (e) { setIsSyncing(false); }
  };

  const handleDownloadPDF = async () => {
    if (!course) return;
    setIsExporting(true);
    try {
      await generateCoursePDF(course, language);
      sendToGoogleSheet('DESCARGA_PDF', { courseTitle: course.title });
    } finally { setIsExporting(false); }
  };

  const handleRegister = async (userData: UserData) => {
    setIsLoading(true);
    try {
      await supabase.from('users').insert([{ name: userData.name, email: userData.email }]);
      localStorage.setItem('profesoria_user', JSON.stringify(userData));
      setUser(userData);
      sendToGoogleSheet('REGISTRO', { message: "Nuevo alumno" }, userData);
    } finally { setIsLoading(false); }
  };

  const handleCreateCourse = async (formData: CourseFormData) => {
    setIsLoading(true);
    try {
      const generated = await generateCourse({ ...formData, language });
      const newCourse: Course = { ...generated, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() };
      localStorage.setItem(`profesoria_course_${newCourse.id}`, JSON.stringify(newCourse));
      setCourse(newCourse);
      setActiveUnitId(newCourse.units[0].id);
      setActiveLessonId(newCourse.units[0].lessons[0].id);
      setView('classroom');
      sendToGoogleSheet('CURSO_CREADO', { courseTitle: newCourse.title });
    } finally { setIsLoading(false); }
  };

  const loadCourseFromHistory = (c: Course) => {
    setCourse(c);
    setActiveUnitId(c.units[0].id);
    setActiveLessonId(c.units[0].lessons[0].id);
    setView('classroom');
  };

  const handleLessonComplete = () => {
    if (!activeLessonId) return;
    const updated = [...completedLessons, activeLessonId];
    setCompletedLessons(updated);
    localStorage.setItem('profesoria_completed', JSON.stringify(updated));
    sendToGoogleSheet('LECCION_COMPLETA', { lessonId: activeLessonId });
  };

  const navigateTo = (direction: 'next' | 'prev') => {
    if (!course) return;
    const all: { uId: string; lId: string }[] = [];
    course.units.forEach(u => u.lessons.forEach(l => all.push({ uId: u.id, lId: l.id })));
    all.push({ uId: 'final', lId: 'assessment' }, { uId: 'final', lId: 'project' }, { uId: 'final', lId: 'sources' });
    const idx = all.findIndex(item => item.lId === activeLessonId);
    if (direction === 'next' && idx < all.length - 1) {
      setActiveUnitId(all[idx + 1].uId); setActiveLessonId(all[idx + 1].lId);
    } else if (direction === 'prev' && idx > 0) {
      setActiveUnitId(all[idx - 1].uId); setActiveLessonId(all[idx - 1].lId);
    }
    window.scrollTo(0,0);
  };

  if (!user) return <UserRegistrationForm courseTitle="ProfesseurIA" onRegister={handleRegister} language={language} />;

  const currentUnit = course?.units.find(u => u.id === activeUnitId);
  const currentLesson = currentUnit?.lessons.find(l => l.id === activeLessonId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-500">
      {/* Navbar con pestañas */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-3 px-6 md:px-10 flex justify-between items-center sticky top-0 z-[60]">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight hidden lg:block">
              {t.brand}<span className="text-indigo-600">IA</span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button onClick={() => setView('home')} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'home' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{t.nav.home}</button>
            {course && <button onClick={() => setView('classroom')} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'classroom' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{t.nav.classroom}</button>}
            <button onClick={() => setView('about')} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'about' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{t.nav.about}</button>
            <button onClick={() => setView('blog')} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'blog' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{t.nav.blog}</button>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mr-2">
            {(['fr', 'en', 'es'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`w-8 h-8 rounded-lg text-[10px] font-black uppercase transition-all ${language === l ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                {l}
              </button>
            ))}
          </div>
          {view === 'classroom' && (
            <button onClick={handleDownloadPDF} className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-700 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </button>
          )}
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
            {isDarkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {view === 'classroom' && course ? (
          <>
            <Sidebar course={course} activeLessonId={activeLessonId} onSelectLesson={(u, l) => { setActiveUnitId(u); setActiveLessonId(l); }} completedLessons={completedLessons} language={language} />
            <main className="flex-1 overflow-y-auto p-6 md:p-16 bg-white dark:bg-slate-950">
              <div className="max-w-4xl mx-auto">
                {activeUnitId === 'final' ? (
                  <Assessment type={activeLessonId as any} questions={course.finalAssessment} projects={course.finalProjects} sources={course.sources} language={language} />
                ) : currentLesson ? (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{t.classroom.unit} {course.units.findIndex(u=>u.id===activeUnitId)+1} / {t.classroom.lesson} {currentUnit?.lessons.findIndex(l=>l.id===activeLessonId)+1}</span>
                      <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-tight">{currentLesson.title}</h2>
                    </div>
                    <LessonContent lesson={currentLesson} onComplete={handleLessonComplete} isCompleted={completedLessons.includes(activeLessonId)} language={language} />
                    <div className="flex justify-between items-center pt-10 border-t border-slate-100 dark:border-slate-800">
                      <button onClick={() => navigateTo('prev')} className="px-6 py-3 rounded-xl border-2 border-slate-100 font-bold text-xs uppercase text-slate-400 hover:text-slate-800">{t.classroom.prev}</button>
                      <button onClick={() => navigateTo('next')} className="px-10 py-3 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase shadow-xl hover:bg-indigo-700">{t.classroom.next}</button>
                    </div>
                  </div>
                ) : null}
              </div>
            </main>
          </>
        ) : (
          <main className="flex-1 overflow-y-auto p-6 md:p-20">
            <div className="max-w-6xl mx-auto">
              {view === 'home' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center mb-16 space-y-4">
                    <h2 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter">{t.slogan}</h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">Bonjour, <span className="text-indigo-600">{user.name}</span>. {t.subtitle}</p>
                  </div>
                  <CourseForm onSubmit={handleCreateCourse} isLoading={isLoading} language={language} />
                  {courseHistory.length > 0 && (
                    <div className="mt-20 space-y-8">
                      <h3 className="text-2xl font-black text-slate-800 dark:text-white">{t.history}</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        {courseHistory.slice(0, 6).map(c => (
                          <button key={c.id} onClick={() => loadCourseFromHistory(c)} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-600 transition-all hover:shadow-xl">
                            <h4 className="font-black text-slate-800 dark:text-white mb-2 line-clamp-1">{c.title}</h4>
                            <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {view === 'about' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 py-10">
                  <div className="text-center max-w-3xl mx-auto space-y-6">
                    <h2 className="text-6xl font-black text-indigo-600">{t.about.title}</h2>
                    <p className="text-xl text-slate-500 leading-relaxed font-medium">{t.about.desc}</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-10">
                    {t.about.stats.map((s: string, i: number) => (
                      <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl border border-slate-100 text-center font-black text-2xl text-slate-800 dark:text-white">
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {view === 'blog' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 py-10">
                  <h2 className="text-5xl font-black mb-16 text-center">{t.blog.title}</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    {t.blog.posts.map((post: any, i: number) => (
                      <article key={i} className="group cursor-pointer bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all">
                        <div className="h-48 bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-6xl">
                          {['📚', '🧠', '🚀'][i]}
                        </div>
                        <div className="p-8 space-y-4">
                          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{post.date}</span>
                          <h3 className="text-xl font-black group-hover:text-indigo-600 transition-colors">{post.title}</h3>
                          <p className="text-sm text-slate-500 font-medium">{post.desc}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        )}
      </div>
      
      <footer className="py-6 px-10 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
        <span>© 2024 ProfesseurIA Sami</span>
        <div className="flex gap-6">
          <button onClick={() => setView('about')}>{t.nav.about}</button>
          <button onClick={() => setView('blog')}>{t.nav.blog}</button>
        </div>
      </footer>
    </div>
  );
};

export default App;
