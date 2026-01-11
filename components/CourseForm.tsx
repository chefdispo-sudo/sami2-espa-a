
import React, { useState, useRef } from 'react';
import { CourseFormData, Language, FilePart } from '../types';
import { TRANSLATIONS } from '../constants';

interface CourseFormProps {
  onSubmit: (data: CourseFormData) => void;
  isLoading: boolean;
  language: Language;
}

const CourseForm: React.FC<CourseFormProps> = ({ onSubmit, isLoading, language }) => {
  const t = TRANSLATIONS[language].form;
  const commonT = TRANSLATIONS[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CourseFormData>({
    topic: '',
    level: t.levels[0],
    profile: '',
    objective: '',
    time: '',
    format: t.formats[3],
    language: language,
    attachments: []
  });

  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (files: FileList | null) => {
    if (!files) return;
    
    const newAttachments: FilePart[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      const promise = new Promise<FilePart>((resolve) => {
        reader.onload = (e) => {
          const base64Data = (e.target?.result as string).split(',')[1];
          resolve({
            data: base64Data,
            mimeType: file.type || 'application/octet-stream',
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      });
      
      newAttachments.push(await promise);
    }
    
    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...newAttachments]
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, language });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-10 md:p-16 rounded-[4rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.1)] dark:shadow-none border border-white/50 dark:border-slate-800 max-w-4xl mx-auto space-y-12 transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="col-span-full group">
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4 ml-4">{t.topic}</label>
          <div className="relative">
             <input
              required
              type="text"
              placeholder={t.topicPlaceholder}
              className="w-full px-10 py-6 rounded-[2rem] bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all text-slate-800 dark:text-white font-black text-xl placeholder:text-slate-300 dark:placeholder:text-slate-600"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
        </div>

        {/* Sección de Carga de Documentos */}
        <div className="col-span-full space-y-4">
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-4">
            {language === 'es' ? 'Base de Conocimiento (Opcional)' : 'Knowledge Base (Optional)'}
          </label>
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange(e.dataTransfer.files); }}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer border-4 border-dashed rounded-[2.5rem] p-10 text-center transition-all ${
              isDragging ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-indigo-400'
            }`}
          >
            <input 
              type="file" 
              multiple 
              className="hidden" 
              ref={fileInputRef} 
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleFileChange(e.target.files)}
            />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <div>
                <p className="text-slate-800 dark:text-white font-black text-lg">
                  {language === 'es' ? 'Adjunta PDFs, Word o Texto' : 'Attach PDF, Word or Text'}
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                  {language === 'es' ? 'La IA usará estos archivos para crear el contenido' : 'AI will use these files to ground the content'}
                </p>
              </div>
            </div>
          </div>

          {/* Lista de archivos adjuntos */}
          {formData.attachments && formData.attachments.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4 ml-2">
              {formData.attachments.map((file, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-300">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter truncate max-w-[150px]">{file.name}</span>
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); removeAttachment(idx); }} 
                    className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-4">{t.level}</label>
          <select
            className="w-full px-8 py-6 rounded-[2rem] bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-600 outline-none appearance-none cursor-pointer font-black text-slate-800 dark:text-white"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
          >
            {t.levels.map((lvl: string) => <option key={lvl} className="dark:bg-slate-900">{lvl}</option>)}
          </select>
        </div>

        <div className="space-y-4">
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-4">{t.profile}</label>
          <input
            required
            type="text"
            placeholder={t.profilePlaceholder}
            className="w-full px-8 py-6 rounded-[2rem] bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-600 outline-none transition-all text-slate-800 dark:text-white font-black"
            value={formData.profile}
            onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
          />
        </div>

        <div className="col-span-full space-y-4">
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-4">{t.objective}</label>
          <input
            required
            type="text"
            placeholder={t.objectivePlaceholder}
            className="w-full px-8 py-6 rounded-[2rem] bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-600 outline-none transition-all text-slate-800 dark:text-white font-black"
            value={formData.objective}
            onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-4">{t.time}</label>
          <input
            required
            type="text"
            placeholder={t.timePlaceholder}
            className="w-full px-8 py-6 rounded-[2rem] bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-600 outline-none transition-all text-slate-800 dark:text-white font-black"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-4">{t.format}</label>
          <select
            className="w-full px-8 py-6 rounded-[2rem] bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-600 outline-none appearance-none cursor-pointer font-black text-slate-800 dark:text-white"
            value={formData.format}
            onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
          >
            {t.formats.map((f: string) => <option key={f} className="dark:bg-slate-900">{f}</option>)}
          </select>
        </div>
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className={`w-full py-8 px-12 rounded-[2.5rem] text-white font-black text-2xl shadow-3xl transition-all transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group ${
          isLoading ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        <span className="relative z-10 flex items-center justify-center gap-4">
          {isLoading ? (
            <>
              <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {commonT.designing}
            </>
          ) : (
            <>
              {commonT.createCourse}
              <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </>
          )}
        </span>
        {!isLoading && (
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        )}
      </button>
    </form>
  );
};

export default CourseForm;
