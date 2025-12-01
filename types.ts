import { LucideIcon } from 'lucide-react';

export enum ToolId {
  ASK_QUESTION = 'ask-question',
  EXAM_QUESTIONS = 'exam-questions',
  FLASHCARDS = 'flashcards',
  REVISION_QUESTIONS = 'revision-questions',
  CASE_STUDY = 'case-study',
}

export interface ToolConfig {
  id: ToolId;
  title: string;
  description: string;
  icon: LucideIcon;
  promptTemplate: (topic: string, notes?: string) => string;
  translationKey?: string; // For translated titles
  descriptionKey?: string; // For translated descriptions
}

export interface GenerationState {
  isLoading: boolean;
  result: string | null;
  error: string | null;
  toolId: ToolId | null;
}