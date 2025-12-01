import { BookOpen, FileQuestion, CreditCard, Lightbulb, FileText } from 'lucide-react';
import { ToolId, ToolConfig } from './types';

// Tool configurations - 5 nodes (removed Lesson Plan)
export const TOOLS: ToolConfig[] = [
  {
    id: ToolId.ASK_QUESTION,
    title: 'Ask a Question',
    description: 'Get detailed answers to your ICT questions',
    icon: BookOpen,
    translationKey: 'askQuestion',
    descriptionKey: 'askQuestionDesc',
    promptTemplate: (topic: string, notes?: string) => `
      You are an expert A-Level ICT tutor. Answer the following question clearly and comprehensively.
      
      Question: ${topic}
      ${notes ? `\nAdditional Context: ${notes}` : ''}
      
      Provide a clear, structured answer with examples where appropriate.
    `
  },
  {
    id: ToolId.EXAM_QUESTIONS,
    title: 'Exam-Style Questions',
    description: 'Generate practice exam questions with mark schemes',
    icon: FileQuestion,
    translationKey: 'examQuestions',
    descriptionKey: 'examQuestionsDesc',
    promptTemplate: (topic: string, notes?: string) => `
      You are an expert A-Level ICT exam question writer.
      Generate 5-6 high-quality exam-style questions on: ${topic}
      ${notes ? `\nAdditional Context: ${notes}` : ''}
      
      For EACH question provide:
      1. The question itself
      2. Mark allocation (e.g., [4 marks])
      3. A detailed mark scheme with key points
      
      Format clearly with proper numbering and spacing.
    `
  },
  {
    id: ToolId.FLASHCARDS,
    title: 'Flashcards',
    description: 'Create flashcards for quick revision',
    icon: CreditCard,
    translationKey: 'flashcards',
    descriptionKey: 'flashcardsDesc',
    promptTemplate: (topic: string, notes?: string) => `
      You are an expert A-Level ICT tutor creating flashcards.
      Create 10-12 flashcards on: ${topic}
      ${notes ? `\nAdditional Context: ${notes}` : ''}
      
      For EACH flashcard provide:
      - Question/Term (front)
      - Answer/Definition (back)
      
      Format as numbered cards with clear Q&A structure.
      Make them concise but comprehensive for revision.
    `
  },
  {
    id: ToolId.REVISION_QUESTIONS,
    title: 'Quick Revision Questions',
    description: 'Fast recall questions for active revision',
    icon: Lightbulb,
    translationKey: 'revisionQuestions',
    descriptionKey: 'revisionQuestionsDesc',
    promptTemplate: (topic: string, notes?: string) => `
      You are an expert A-Level ICT tutor creating quick revision questions.
      Generate 15-20 quick recall questions on: ${topic}
      ${notes ? `\nAdditional Context: ${notes}` : ''}
      
      Format as a numbered list with short, sharp questions perfect for quick testing.
      Cover key concepts, definitions, and important facts.
    `
  },
  {
    id: ToolId.CASE_STUDY,
    title: 'Case Study Answers',
    description: 'Structured answers for case study scenarios',
    icon: FileText,
    translationKey: 'caseStudy',
    descriptionKey: 'caseStudyDesc',
    promptTemplate: (topic: string, notes?: string) => `
      You are an expert A-Level ICT tutor helping with case study analysis.
      Provide a structured case study answer for: ${topic}
      ${notes ? `\nAdditional Context: ${notes}` : ''}
      
      Structure the answer with:
      - Introduction
      - Key points with clear subheadings
      - Analysis and evaluation
      - Conclusion
      
      Make it suitable for A-Level ICT case study questions.
    `
  }
];
