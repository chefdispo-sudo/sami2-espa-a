
import React, { useState } from 'react';
import { Lesson, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import AdSense from './AdSense';

interface LessonContentProps {
  lesson: Lesson;
  onComplete: () => void;
  isCompleted: boolean;
  language: Language;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson, onComplete, isCompleted, language }) => {
  const t = TRANSLATIONS[language].classroom.blocks;
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelectOption = (qIdx: number, option: string) => {
    setTestAnswers({ ...testAnswers, [qIdx]: option });
  };

  const isAllCorrect = lesson.blocks.quickTest.every(
    (q, idx) => testAnswers[idx] === q.correctAnswer
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Idea Clave */}
      <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-100 dark:border-slate-800 group hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-2xl">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
          </div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wider">{t.keyIdea}</h2>
        </div>
        <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg md:text-xl font-medium whitespace-pre-wrap">
          {lesson.blocks.keyIdea}
        </div>
      </section>

      {/* Ejemplo Aplicado */}
      <section className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 rounded-[2rem] p-8 md:p-10 border border-indigo-100 dark:border-indigo-900/40">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-white dark:bg-indigo-900/50 p-3 rounded-2xl shadow-sm">
            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <h2 className="text-xl font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">{t.example}</h2>
        </div>
        <div className="prose prose-indigo dark:prose-invert text-indigo-800 dark:text-indigo-300 max-w-none text-lg leading-relaxed italic">
          {lesson.blocks.appliedExample}
        </div>
      </section>

      {/* Actividad Práctica */}
      <section className="bg-emerald-50 dark:bg-emerald-950/20 rounded-[2rem] p-8 md:p-10 border border-emerald-100 dark:border-emerald-900/40">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-white dark:bg-emerald-900/50 p-3 rounded-2xl shadow-sm">
            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          </div>
          <h2 className="text-xl font-black text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">{t.activity}</h2>
        </div>
        <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed font-bold text-lg md:text-xl">
          {lesson.blocks.activity}
        </p>
      </section>

      {/* Test Rápido */}
      <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-violet-100 dark:bg-violet-900/30 p-3 rounded-2xl">
            <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
          </div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wider">{t.test}</h2>
        </div>
        
        <div className="space-y-12">
          {lesson.blocks.quickTest.map((q, qIdx) => (
            <div key={qIdx} className="space-y-6">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center font-black text-sm">
                  {qIdx + 1}
                </span>
                <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{q.question}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-12">
                {q.options.map((opt, oIdx) => {
                  const isSelected = testAnswers[qIdx] === opt;
                  const isCorrect = opt === q.correctAnswer;
                  let btnClass = "p-5 rounded-2xl border-2 text-left transition-all text-sm font-medium ";
                  
                  if (showFeedback) {
                    if (isCorrect) btnClass += "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-400";
                    else if (isSelected) btnClass += "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-400";
                    else btnClass += "bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-400 dark:text-slate-600";
                  } else {
                    btnClass += isSelected 
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none translate-y-[-2px]" 
                      : "bg-slate-50 dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300";
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={showFeedback}
                      onClick={() => handleSelectOption(qIdx, opt)}
                      className={btnClass}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-6">
          {!showFeedback ? (
            <button
              disabled={Object.keys(testAnswers).length < lesson.blocks.quickTest.length}
              onClick={() => setShowFeedback(true)}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl disabled:opacity-50 hover:bg-indigo-700 transition-all"
            >
              {t.checkBtn}
            </button>
          ) : (
            <div className="text-center space-y-6 w-full animate-in fade-in zoom-in">
              {isAllCorrect ? (
                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-[1.5rem] border-2 border-emerald-200 dark:border-emerald-800 font-bold text-lg">
                  {t.correct}
                </div>
              ) : (
                <div className="p-6 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-[1.5rem] border-2 border-amber-200 dark:border-amber-800 font-bold text-lg">
                  {t.wrong}
                </div>
              )}
              {!isCompleted && (
                <button
                  onClick={onComplete}
                  className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all"
                >
                  {t.continue}
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* AdSense Unit al final de la lección */}
      <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800">
        <p className="text-[10px] text-center font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest mb-4">Publicidad</p>
        <AdSense 
          adClient="ca-pub-XXXXXXXXXXXXXXXX" 
          adSlot="XXXXXXXXXX" 
          className="max-w-xl mx-auto"
        />
      </div>
    </div>
  );
};

export default LessonContent;