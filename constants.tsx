import { ToolId, ToolConfig } from './types';
import {
  BookOpen,
  FileQuestion,
  Layers,
  Zap,
  Briefcase,
  FileText
} from 'lucide-react';

export const TOOLS: ToolConfig[] = [
  {
    id: ToolId.LESSON_PLAN,
    title: "Lesson Plan",
    description: "Generate a structured 60-minute lesson plan with learning objectives and activities.",
    icon: BookOpen,
    promptTemplate: (topic, level, notes) => `
      Act as an expert A-Level ICT teacher. Create a comprehensive 60-minute lesson plan for the topic: "${topic}" at ${level}.
      
      Structure:
      1. Learning Objectives (Bloom's Taxonomy)
      2. Starter Activity (5-10 mins)
      3. Main Content Delivery (20 mins)
      4. Student Activity/Practice (20 mins)
      5. Plenary/Review (10 mins)
      6. Homework/Extension
      
      Additional context: ${notes || "None"}
      Format using Markdown with clear headings.
    `
  },
  {
    id: ToolId.EXAM_QUESTIONS,
    title: "Exam-Style Questions",
    description: "Create past-paper style questions with mark schemes.",
    icon: FileQuestion,
    promptTemplate: (topic, level, notes) => `
      Act as an A-Level ICT Examiner. specific to ${level}. Generate 3 exam-style questions on "${topic}".
      
      Include:
      1. A short answer question (2-4 marks).
      2. An application/scenario question (6-8 marks).
      3. An extended writing/evaluation question (10-12 marks).
      
      For each question, provide a detailed Mark Scheme indicating where marks are awarded.
      Additional context: ${notes || "None"}
    `
  },
  {
    id: ToolId.FLASHCARDS,
    title: "Flashcards",
    description: "Key definitions and concepts formatted for quick revision.",
    icon: Layers,
    promptTemplate: (topic, level, notes) => `
      Create a set of 10 high-yield revision flashcards for A-Level ICT (${level}) on the topic: "${topic}".
      
      Format as a table with two columns: "Front (Concept/Question)" and "Back (Definition/Answer)".
      Focus on key terminology, advantages/disadvantages, and core concepts.
      Additional context: ${notes || "None"}
    `
  },
  {
    id: ToolId.REVISION_QUESTIONS,
    title: "Quick Revision",
    description: "Rapid-fire questions to test student knowledge instantly.",
    icon: Zap,
    promptTemplate: (topic, level, notes) => `
      Generate 10 rapid-fire revision questions with short answers for the topic "${topic}" (${level}).
      
      Format:
      Q1: [Question]
      A: [Short Answer]
      ...
      
      Additional context: ${notes || "None"}
    `
  },
  {
    id: ToolId.CASE_STUDY,
    title: "Case Study Answers",
    description: "Analyze a business scenario and provide ICT solutions.",
    icon: Briefcase,
    promptTemplate: (topic, level, notes) => `
      Create a short business case study scenario relevant to "${topic}" for an A-Level ICT student (${level}).
      
      Then, provide a model answer analyzing the scenario, proposing an ICT solution, and evaluating its impact (benefits/drawbacks).
      Additional context: ${notes || "None"}
    `
  },
  {
    id: ToolId.TOPIC_SUMMARY,
    title: "Ask Question",
    description: "Ask any question and get AI-powered answers for A-Level ICT.",
    icon: FileText,
    promptTemplate: (topic, level, notes) => `
      You are an expert A-Level ICT tutor. Answer the following question clearly and concisely:
      
      Question: "${topic}"
      Level: ${level}
      
      Provide a detailed but easy-to-understand answer. Use examples where helpful.
      Additional context: ${notes || "None"}
    `
  },
];
