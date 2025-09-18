import { 
  PracticeExercise, 
  PracticeExerciseData, 
  PracticeSubmission, 
  PracticeScore,
  ExamType,
  TaskType,
  ExerciseCategory 
} from '../types/practice.types';
import practiceData from '../data/practiceExercises.json';
import writingService, { ScoreEssayRequest } from './writing.service';
import { logAuthStatus } from '../utils/auth-debug';
import { ieltsRound } from '../utils/ielts-rounding';

class PracticeService {
  private practiceExercises: PracticeExerciseData = practiceData;

  // Get all exercises by category
  getAllExercises(): PracticeExerciseData {
    return this.practiceExercises;
  }

  // Get exercises by exam type and task type
  getExercisesByCategory(examType: ExamType, taskType: TaskType): PracticeExercise[] {
    return this.practiceExercises[examType][taskType as keyof typeof this.practiceExercises[typeof examType]] || [];
  }

  // Get single exercise by ID
  getExerciseById(exerciseId: string): PracticeExercise | null {
    const allExercises = [
      ...this.practiceExercises.vstep.task1,
      ...this.practiceExercises.vstep.task2,
      ...this.practiceExercises.ielts.task1,
      ...this.practiceExercises.ielts.task2,
    ];
    
    return allExercises.find(exercise => exercise.id === exerciseId) || null;
  }

  // Get exercise categories for the main page
  getExerciseCategories(): ExerciseCategory[] {
    return [
      {
        type: 'vstep',
        taskType: 'task1',
        title: 'VSTEP Task 1: Email Writing',
        description: 'Practice writing formal and informal emails in response to given situations.',
        exercises: this.practiceExercises.vstep.task1
      },
      {
        type: 'vstep',
        taskType: 'task2',
        title: 'VSTEP Task 2: Essay Writing',
        description: 'Practice writing argumentative and discussion essays on various topics.',
        exercises: this.practiceExercises.vstep.task2
      },
      {
        type: 'ielts',
        taskType: 'task1',
        title: 'IELTS Task 1 Academic Writing',
        description: 'Practice describing charts, graphs, diagrams, and processes for IELTS Academic.',
        exercises: this.practiceExercises.ielts.task1
      },
      // {
      //   type: 'ielts',
      //   taskType: 'task1_general',
      //   title: 'IELTS Task 1 General Training Writing',
      //   description: 'Practice writing formal and informal letters for IELTS General Training.',
      //   exercises: this.practiceExercises.ielts.task1_general
      // },
      {
        type: 'ielts',
        taskType: 'task2',
        title: 'IELTS Task 2 Essay Writing',
        description: 'Practice writing argumentative and opinion essays for IELTS Task 2.',
        exercises: this.practiceExercises.ielts.task2
      }
    ];
  }

  // Submit practice exercise (will call existing writing API)
  async submitPracticeExercise(submission: PracticeSubmission): Promise<PracticeScore> {
    try {
      // Check authentication first using debug utility
      const authInfo = logAuthStatus('Practice Exercise Submission');
      
      if (!authInfo.isAuthenticated) {
        const errorMsg = authInfo.issues.length > 0 
          ? `Authentication failed: ${authInfo.issues.join(', ')}`
          : 'Authentication required. Please login first.';
        throw new Error(errorMsg);
      }

      // Get the exercise details
      const exercise = this.getExerciseById(submission.exerciseId);
      if (!exercise) {
        throw new Error('Exercise not found');
      }

      // Prepare data for the existing writing API
      const scoreRequest: ScoreEssayRequest = {
        task_type: this.getTaskTypeFromExercise(exercise),
        essay_text: submission.content,
        time_spent: submission.timeSpent,
        prompt: exercise.prompt,
        context: exercise.context,
        instructions: exercise.instructions,
        source: exercise.source
      };

      console.log('📝 Submitting to API:', {
        url: 'http://localhost:5000/api/writing/score',
        method: 'POST',
        data: scoreRequest,
        authStatus: authInfo.isAuthenticated ? 'Authenticated' : 'Not Authenticated',
        tokenPreview: authInfo.tokenPreview
      });

      // Call existing writing scoring API
      const response = await writingService.scoreEssay(scoreRequest);
      
      // Transform response to match PracticeScore interface
      // Parse corrections directly from response object (not JSON string)
      const corrections = (response.corrections && typeof response.corrections === 'object') 
        ? response.corrections as { grammar?: unknown[]; vocabulary?: unknown[]; structure?: unknown[] }
        : { grammar: [], vocabulary: [], structure: [] };
      
      // Apply IELTS rounding to all scores
      const practiceScore: PracticeScore = {
        submissionId: response.id,
        exerciseId: submission.exerciseId,
        taskFulfillmentScore: ieltsRound(response.task_achievement || 0),
        organizationScore: ieltsRound(response.coherence_cohesion || 0),
        vocabularyScore: ieltsRound(response.lexical_resource || 0),
        grammarScore: ieltsRound(response.grammatical_range || 0),
        overallScore: ieltsRound(response.overall_score || 0),
        taskFulfillmentFeedback: response.task_achievement_feedback || '',
        organizationFeedback: response.coherence_cohesion_feedback || '',
        vocabularyFeedback: response.lexical_resource_feedback || '',
        grammarFeedback: response.grammatical_range_feedback || '',
        overallFeedback: 'Practice exercise completed successfully.',
        grammarCorrections: (corrections.grammar as unknown[]) || [],
        vocabularySuggestions: (corrections.vocabulary as unknown[]) || [],
        structureImprovements: (corrections.structure as unknown[]) || [],
        scoredAt: response.created_at
      };

      return practiceScore;
    } catch (error: unknown) {
      console.error('❌ Error submitting practice exercise:', error);
      
      // Handle specific error types
      const apiError = error as { response?: { status?: number; data?: { error?: string } } };
      if (apiError.response?.status === 401) {
        console.error('🔐 Authentication failed - Token may be expired or invalid');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Your session has expired. Please login again.');
      }
      
      if (apiError.response?.status === 403) {
        throw new Error('You do not have permission to access this feature.');
      }
      
      if (apiError.response?.status && apiError.response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      const errorMsg = (error as { message?: string }).message;
      if (errorMsg === 'Authentication required. Please login first.') {
        throw error;
      }
      
      // Generic error handling
      const errorMessage = apiError.response?.data?.error || errorMsg || 'Failed to submit exercise. Please try again.';
      throw new Error(errorMessage);
    }
  }

  // Get user's practice history
  async getPracticeHistory(): Promise<PracticeScore[]> {
    try {
      // This will need to be implemented when backend is ready
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error fetching practice history:', error);
      return [];
    }
  }

  // Helper method to determine task type from exercise for API
  private getTaskTypeFromExercise(exercise: PracticeExercise): 'task1' | 'task2' {
    // For VSTEP exercises, use task1 for emails and task2 for essays
    if (exercise.id.includes('vstep_task1')) return 'task1';
    if (exercise.id.includes('vstep_task2')) return 'task2';
    
    // For IELTS exercises, check the task number in ID
    if (exercise.id.includes('_task1')) return 'task1';
    if (exercise.id.includes('_task2')) return 'task2';
    
    // Legacy IELTS patterns
    if (exercise.id.includes('ielts_academic')) return 'task1';
    if (exercise.id.includes('ielts_general')) return 'task1';
    
    // Default to task2 for essay-like tasks
    return 'task2';
  }

  // Count words in text
  countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  // Format time (seconds to MM:SS)
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Check if user has premium access
  checkPremiumAccess(): boolean {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const plan = user?.subscription?.plan;
    const status = user?.subscription?.status;
    return plan !== 'free' && status === 'active';
  }
}

export default new PracticeService();