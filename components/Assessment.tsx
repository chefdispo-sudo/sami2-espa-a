
import React, { useState } from 'react';
import { Question, ProjectProposal, Source, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface AssessmentProps {
  questions?: Question[];
  projects?: ProjectProposal[];
  sources?: Source[];
  type: 'evaluation' | 'project' | 'sources';
  language: Language;
  onComplete?: (score: number) => void;
}

const Assessment: React.FC<AssessmentProps> = ({ questions, projects, sources, type, language, onComplete }) => {
  const t = TRANSLATIONS[language].classroom.final;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showScore, setShowScore] = useState(false);

  const score = questions?.filter((q, i) => answers[i] === q.correctAnswer).length || 0;

  const handleFinish = () => {
    setShowScore(true);
    if (onComplete) onComplete(score);
  };

  if (type === 'evaluation' && questions) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800 animate-in fade-in duration-700">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
             <span className="text-3xl text-white">🎯</span>
          </div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-3">{t.evaluation}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">{t.evaluationDesc}</p>
        </div>
        
        <div className="space-y-12 max-w-3xl mx-auto">
          {questions.map((q, i) => (
            <div key={i} className="space-y-6">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center font-black text-sm">
                  {i + 1}
                </span>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{q.question}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-12">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    disabled={showScore}
                    onClick={() => setAnswers({...answers, [i]: opt})}
                    className={`p-5 rounded-2xl border-2 text-left transition-all font-medium text-sm ${
                      showScore
                        ? opt === q.correctAnswer
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                          : answers[i] === opt ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-400' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400'
                        : answers[i] === opt ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none' : 'bg-slate-50 dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          {!showScore ? (
            <button
              onClick={handleFinish}
              className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-indigo-700 transition-all"
            >
              {t.submit}
            </button>
          ) : (
            <div className="p-10 bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-100 dark:border-indigo-900 rounded-[2.5rem] text-center w-full max-w-lg animate-in fade-in zoom-in">
              <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-200 mb-2">{t.result}</h3>
              <div className="text-6xl font-black text-indigo-600 dark:text-indigo-400 mb-6">{score} / {questions.length}</div>
              <p className="text-indigo-700 dark:text-indigo-300 font-bold italic">
                {score > questions.length / 2 ? t.pass : t.fail}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (type === 'project' && projects) {
    return (
      <div className="space-y-12 animate-in fade-in duration-700">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 md:p-16 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
          <div className="w-16 h-16 bg-slate-800 dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
             <span className="text-3xl text-white dark:text-slate-900">🏗️</span>
          </div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-4">{t.challenges}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-12">{t.challengesDesc}</p>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {projects.map((p, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col group hover:shadow-xl transition-all hover:bg-white dark:hover:bg-slate-800">
                <div className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black mb-6 shadow-lg">
                  {i + 1}
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4 leading-tight">{p.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed flex-grow text-sm font-medium">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'sources' && sources) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800 animate-in fade-in duration-700">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-4">
          <span className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">📚</span>
          {t.sources}
        </h2>
        <div className="space-y-4">
          {sources.map((s, i) => (
            <a 
              key={i} 
              href={s.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 rounded-2xl border-2 border-slate-50 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl transition-colors">
                  {s.type === 'libro' ? '📖' : '🌐'}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">{s.title}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1 opacity-60 truncate max-w-[200px] md:max-w-md">{s.url}</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default Assessment;
