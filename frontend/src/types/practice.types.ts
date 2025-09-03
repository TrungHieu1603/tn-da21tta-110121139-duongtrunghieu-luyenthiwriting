export type ExerciseType = 'vstep_task1' | 'vstep_task2' | 'ielts_academic' | 'ielts_general';

export type ExamType = 'vstep' | 'ielts';

export type TaskType = 'task1' | 'task2' | 'task1_academic' | 'task1_general';

export interface PracticeExercise {
  id: string;
  exerciseNumber: number;
  title: string;
  isVip: boolean;
  totalAttempts: number;
  timeLimit: number; // in minutes
  minWords: number;
  maxWords: number;
  prompt: string;
  context?: string; // For email exercises
  instructions: string;
  imageUrl?: string; // For IELTS tasks with charts/diagrams
  imageAlt?: string; // Alt text for image
  source?: string; // Source information (e.g., "Cambridge IELTS 14 – Test 3, Writing Task 1")
}

export interface PracticeExerciseData {
  vstep: {
    task1: PracticeExercise[];
    task2: PracticeExercise[];
  };
  ielts: {
    task1: PracticeExercise[];
    task2: PracticeExercise[];
  };
}

export interface PracticeSubmission {
  id?: string;
  exerciseId: string;
  content: string;
  wordCount: number;
  timeSpent: number; // in seconds
  submittedAt?: string;
}

export interface PracticeScore {
  id?: string;
  submissionId: string;
  exerciseId: string;
  taskFulfillmentScore: number;
  organizationScore: number;
  vocabularyScore: number;
  grammarScore: number;
  overallScore: number;
  taskFulfillmentFeedback: string;
  organizationFeedback: string;
  vocabularyFeedback: string;
  grammarFeedback: string;
  overallFeedback: string;
  grammarCorrections?: any[];
  vocabularySuggestions?: any[];
  structureImprovements?: any[];
  scoredAt?: string;
}

export interface ExerciseCategory {
  type: ExamType;
  taskType: TaskType;
  title: string;
  description: string;
  exercises: PracticeExercise[];
}

export interface PracticeStats {
  totalAttempts: number;
  averageScore: number;
  completedExercises: number;
  timeSpent: number;
}