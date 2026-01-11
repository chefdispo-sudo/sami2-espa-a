
import { jsPDF } from 'jspdf';
import { Course, Language } from './types';
import { TRANSLATIONS } from './constants';

export const generateCoursePDF = async (course: Course, language: Language) => {
  const doc = new jsPDF();
  const t = TRANSLATIONS[language];
  const classroomT = t.classroom;
  
  let y = 20;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - (margin * 2);

  // --- PORTADA ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  const titleLines = doc.splitTextToSize(course.title.toUpperCase(), contentWidth);
  doc.text(titleLines, margin, y);
  y += (titleLines.length * 10) + 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const descLines = doc.splitTextToSize(course.description, contentWidth);
  doc.text(descLines, margin, y);
  y += (descLines.length * 6) + 15;

  doc.setFont('helvetica', 'bold');
  doc.text(`${classroomT.stats.level}: ${course.level}`, margin, y);
  y += 7;
  doc.text(`${classroomT.stats.time}: ${course.duration}`, margin, y);
  y += 15;

  doc.setFontSize(16);
  doc.text(classroomT.objectives, margin, y);
  y += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  course.learningObjectives.forEach(obj => {
    const lines = doc.splitTextToSize(`• ${obj}`, contentWidth);
    doc.text(lines, margin, y);
    y += (lines.length * 6);
  });

  y += 10;
  doc.addPage();
  y = 20;

  // --- CONTENIDO DEL CURSO ---
  course.units.forEach((unit, uIdx) => {
    if (y > 230) { doc.addPage(); y = 20; }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.text(`${classroomT.unit} ${uIdx + 1}: ${unit.title}`, margin, y);
    y += 10;
    doc.setTextColor(0, 0, 0);
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(unit.summary, contentWidth);
    doc.text(summaryLines, margin, y);
    y += (summaryLines.length * 5) + 10;

    unit.lessons.forEach((lesson, lIdx) => {
      if (y > 230) { doc.addPage(); y = 20; }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(`${lIdx + 1}. ${lesson.title}`, margin, y);
      y += 8;

      // Idea Clave
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(classroomT.blocks.keyIdea.toUpperCase(), margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      const keyLines = doc.splitTextToSize(lesson.blocks.keyIdea, contentWidth);
      doc.text(keyLines, margin, y);
      y += (keyLines.length * 5) + 5;

      // Video Link if exists
      if (lesson.blocks.videoUrl) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(225, 29, 72); // Rose-600
        doc.text(`VIDEO: ${lesson.blocks.videoUrl}`, margin, y);
        y += 7;
        doc.setTextColor(0, 0, 0);
      }

      // Ejemplo
      doc.setFont('helvetica', 'bold');
      doc.text(classroomT.blocks.example.toUpperCase(), margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      const exLines = doc.splitTextToSize(lesson.blocks.appliedExample, contentWidth);
      doc.text(exLines, margin, y);
      y += (exLines.length * 5) + 7;

      // Actividad
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(5, 150, 105);
      doc.text(classroomT.blocks.activity.toUpperCase(), margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const actLines = doc.splitTextToSize(lesson.blocks.activity, contentWidth);
      doc.text(actLines, margin, y);
      y += (actLines.length * 5) + 15;
    });
  });

  // --- EVALUACIÓN FINAL ---
  doc.addPage();
  y = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(classroomT.final.evaluation, margin, y);
  y += 15;

  course.finalAssessment.forEach((q, qIdx) => {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const qLines = doc.splitTextToSize(`${qIdx + 1}. ${q.question}`, contentWidth);
    doc.text(qLines, margin, y);
    y += (qLines.length * 6);
    
    doc.setFont('helvetica', 'normal');
    q.options.forEach(opt => {
      doc.text(`[ ] ${opt}`, margin + 5, y);
      y += 6;
    });
    y += 5;
  });

  doc.addPage();
  y = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(classroomT.final.challenges, margin, y);
  y += 15;

  course.finalProjects.forEach((p, pIdx) => {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(`${pIdx + 1}. ${p.title}`, margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const pLines = doc.splitTextToSize(p.description, contentWidth);
    doc.text(pLines, margin, y);
    y += (pLines.length * 5) + 10;
  });

  y += 10;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(classroomT.final.sources, margin, y);
  y += 10;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  course.sources.forEach(s => {
    doc.setTextColor(79, 70, 229);
    doc.text(`${s.title}: ${s.url}`, margin, y);
    y += 5;
  });

  doc.save(`${course.title.replace(/\s+/g, '_')}_ProfesorIA.pdf`);
};
