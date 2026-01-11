
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface StudentFormProps {
  courseTitle: string;
  onJoin: (name: string) => void;
  language: Language;
}

const StudentForm: React.FC<StudentFormProps> = ({ courseTitle, onJoin, language }) => {
  const [name, setName] = useState('');
  const t = TRANSLATIONS[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onJoin(name.trim());
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 shadow-3xl border border-slate-100 dark:border-slate-800 animate-fade-up">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
             </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
            {language === 'es' ? 'Bienvenido al Aula' : language === 'en' ? 'Welcome to the Classroom' : 'Bienvenue en Classe'}
          </h2>
          <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-6">
            {courseTitle}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {language === 'es' ? 'Ingresa tu nombre para comenzar tu progreso.' : language === 'en' ? 'Enter your name to start your progress.' : 'Entrez votre nom pour commencer.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <input
              required
              autoFocus
              type="text"
              placeholder={language === 'es' ? 'Tu nombre completo' : 'Full Name'}
              className="w-full px-8 py-6 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-600 outline-none transition-all text-slate-800 dark:text-white font-bold text-lg text-center"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-6 bg-indigo-600 text-white font-black text-xl rounded-2xl shadow-xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {language === 'es' ? 'Acceder al Curso' : language === 'en' ? 'Join Course' : 'Rejoindre le cours'}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
