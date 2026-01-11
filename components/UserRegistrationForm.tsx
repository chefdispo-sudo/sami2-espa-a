
import React, { useState } from 'react';
import { Language, UserData } from '../types';

interface UserRegistrationFormProps {
  courseTitle: string;
  onRegister: (data: UserData) => void;
  language: Language;
}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({ courseTitle, onRegister, language }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isError, setIsError] = useState(false);
  
  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && validateEmail(email)) {
      onRegister({
        name: name.trim(),
        email: email.trim(),
        sessionId: Math.random().toString(36).substring(2, 11)
      });
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
    }
  };

  const labelsMap = {
    es: { title: "Bienvenido a ProfesorIA", desc: "Regístrate para comenzar tu curso sobre", nameLabel: "Nombre completo", emailLabel: "Correo electrónico", btn: "Acceder al Aula Virtual", namePlaceholder: "Ej. María García", emailPlaceholder: "maria@ejemplo.com" },
    en: { title: "Welcome to TeacherAI", desc: "Register to start your course on", nameLabel: "Full Name", emailLabel: "Email Address", btn: "Enter Virtual Classroom", namePlaceholder: "e.g. John Doe", emailPlaceholder: "john@example.com" },
    fr: { title: "Bienvenue sur ProfesseurIA", desc: "Inscrivez-vous pour commencer votre cours sur", nameLabel: "Nom complet", emailLabel: "Adresse e-mail", btn: "Accéder à la classe virtuelle", namePlaceholder: "Ex. Jean Dupont", emailPlaceholder: "jean@exemple.com" }
  };
  const labels = labelsMap[language as keyof typeof labelsMap] || labelsMap.es;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className={`w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 shadow-3xl border border-slate-100 dark:border-slate-800 transition-all duration-300 ${isError ? 'shake border-rose-500' : ''}`}>
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30 rotate-3">
             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
             </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
            {labels.title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
            {labels.desc}
          </p>
          <p className="text-indigo-600 dark:text-indigo-400 font-black text-lg">
            {courseTitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">{labels.nameLabel}</label>
            <input
              required
              type="text"
              placeholder={labels.namePlaceholder}
              className="w-full px-8 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-600 outline-none transition-all text-slate-800 dark:text-white font-bold"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">{labels.emailLabel}</label>
            <input
              required
              type="email"
              placeholder={labels.emailPlaceholder}
              className="w-full px-8 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-600 outline-none transition-all text-slate-800 dark:text-white font-bold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-6 bg-indigo-600 text-white font-black text-xl rounded-2xl shadow-xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
          >
            {labels.btn}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-slate-400 dark:text-slate-600 font-medium px-8 leading-relaxed">
          Tus datos se utilizarán exclusivamente para el seguimiento de tu progreso educativo y se registrarán automáticamente en la bitácora del curso.
        </p>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default UserRegistrationForm;
