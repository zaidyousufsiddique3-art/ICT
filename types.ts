import { LucideIcon } from 'lucide-react';

export enum ToolId {
  LESSON_PLAN = 'lesson-plan',
  EXAM_QUESTIONS = 'exam-questions',
  FLASHCARDS = 'flashcards',
  REVISION_QUESTIONS = 'revision-questions',
  CASE_STUDY = 'case-study',
  TOPIC_SUMMARY = 'topic-summary',
}

export interface ToolConfig {
  id: ToolId;
  title: string;
  description: string;
  icon: LucideIcon;
  promptTemplate: (topic: string, level: string, notes?: string) => string;
}

export enum Level {
  AS = 'AS Level',
  A2 = 'A2 Level',
}

export interface GenerationState {
  isLoading: boolean;
  result: string | null;
  error: string | null;
  toolId: ToolId | null;
}