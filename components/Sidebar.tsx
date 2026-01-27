
import React from 'react';
import { Course, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import AdSense from './AdSense';

interface SidebarProps {
  course: Course;
  activeLessonId: string;
  onSelectLesson: (unitId: string, lessonId: string) => void;
  completedLessons: string[];
  language: Language;
}

const Sidebar: React.FC<SidebarProps> = ({ course, activeLessonId, onSelectLesson, completedLessons, language }) => {
  const t = TRANSLATIONS[language].classroom;
  const commonT = TRANSLATIONS[language];

  return (
    <aside className="w-[320px] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto hidden lg:flex flex-col sticky top-0 transition-colors duration-300">
      <div className="p-8 flex-grow">
        <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-8">{t.plan}</h2>
        
        <div className="space-y-10">
          {course.units.map((unit, uIdx) => (
            <div key={unit.id} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 px-2 py-0.5 rounded-md">
                  {uIdx + 1}
                </span>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight">
                  {unit.title}
                </h3>
              </div>
              
              <ul className="space-y-2 border-l-2 border-slate-100 dark:border-slate-800 ml-3 pl-5">
                {unit.lessons.map((lesson) => {
                  const isActive = activeLessonId === lesson.id;
                  const isCompleted = completedLessons.includes(lesson.id);
                  return (
                    <li key={lesson.id} className="relative">
                      {isActive && (
                        <div className="absolute -left-[21.5px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-indigo-600 rounded-full" />
                      )}
                      <button
                        onClick={() => onSelectLesson(unit.id, lesson.id)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all group flex items-center justify-between ${
                          isActive 
                            ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none' 
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        <span className="flex-1 truncate pr-2">
                           {lesson.title}
                        </span>
                        {isCompleted && !isActive && (
                          <div className="bg-emerald-100 dark:bg-emerald-900/40 p-0.5 rounded-full">
                            <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-2">
             <button className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-100 dark:border-rose-900/40 hover:scale-105">
                <span className="text-base">🔴</span>
                {commonT.nav.live}
             </button>
             {[
               { id: 'assessment', label: t.final.evaluation, icon: '🎯' },
               { id: 'project', label: t.final.challenges, icon: '🏗️' },
               { id: 'sources', label: t.final.sources, icon: '📚' }
             ].map((item) => (
               <button 
                key={item.id}
                onClick={() => onSelectLesson('final', item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
                  activeLessonId === item.id 
                    ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 shadow-xl' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
               >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="p-6 mt-auto bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Support Direct</p>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-rose-500 w-1/3 animate-pulse"></div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
