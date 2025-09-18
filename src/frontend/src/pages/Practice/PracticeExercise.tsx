import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import practiceService from '../../services/practice.service';
import { PracticeExercise as PracticeExerciseType, PracticeSubmission } from '../../types/practice.types';
import WordCountWarningModal from '../../components/Practice/WordCountWarningModal';

const PracticeExercise: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  
  const [exercise, setExercise] = useState<PracticeExerciseType | null>(null);
  const [content, setContent] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [customTime, setCustomTime] = useState(0);
  const [isTimerEditable, setIsTimerEditable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showUpgradeAlert, setShowUpgradeAlert] = useState(false);
  const [showWordCountModal, setShowWordCountModal] = useState(false);
  
  const isPremium = practiceService.checkPremiumAccess();

  useEffect(() => {
    if (exerciseId) {
      const exerciseData = practiceService.getExerciseById(exerciseId);
      if (exerciseData) {
        setExercise(exerciseData);
        const initialTime = exerciseData.timeLimit * 60; // Convert minutes to seconds
        setTimeLeft(initialTime);
        setCustomTime(exerciseData.timeLimit);
        setStartTime(new Date());

        // Check if this is a VIP exercise and user is not premium
        if (exerciseData.isVip && !isPremium) {
          setShowUpgradeAlert(true);
        }
      } else {
        navigate('/practice/writing');
      }
    }
  }, [exerciseId, navigate, isPremium]);

  useEffect(() => {
    if (timeLeft > 0 && !showUpgradeAlert && !isTimerEditable) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, showUpgradeAlert, isTimerEditable]);

  const handleTimerEdit = (newTime: number) => {
    if (newTime > 0 && newTime <= 180) { // Max 3 hours
      setCustomTime(newTime);
      setTimeLeft(newTime * 60);
      setStartTime(new Date()); // Reset start time
    }
  };

  const handleTimerToggle = () => {
    setIsTimerEditable(!isTimerEditable);
  };

  const handleSubmit = async () => {
    if (!exercise || !content.trim()) return;

    const wordCount = practiceService.countWords(content);
    const penalty = calculateWordCountPenalty(wordCount);
    
    // Show custom modal if there's a penalty
    if (penalty > 0) {
      setShowWordCountModal(true);
      return;
    }

    // Proceed with submission if no penalty
    await performSubmission();
  };

  const handleModalConfirm = async () => {
    setShowWordCountModal(false);
    await performSubmission();
  };

  const handleModalClose = () => {
    setShowWordCountModal(false);
  };

  const performSubmission = async () => {
    if (!exercise) return;

    setIsSubmitting(true);
    try {
      const timeSpent = startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000) : 0;
      const wordCount = practiceService.countWords(content);
      
      const submission: PracticeSubmission = {
        exerciseId: exercise.id,
        content,
        wordCount,
        timeSpent
      };

      console.log('🚀 Starting submission process...');
      const score = await practiceService.submitPracticeExercise(submission);
      console.log('✅ Submission successful:', score);
      
      // Navigate to results page with score data
      navigate('/practice/writing/results', { 
        state: { 
          score, 
          exercise, 
          submission 
        } 
      });
    } catch (error: unknown) {
      console.error('❌ Error submitting exercise:', error);
      
      // Show user-friendly error messages
      let errorMessage = 'Failed to submit your response. Please try again.';
      
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      if (errorMsg.includes('session has expired')) {
        errorMessage = 'Your session has expired. Please login again.';
        // Optionally redirect to login after showing message
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else if (errorMsg.includes('Authentication required')) {
        errorMessage = 'Please login to submit your exercise.';
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else if (errorMsg.includes('permission')) {
        errorMessage = 'You do not have permission to access this feature.';
      } else if (errorMsg.includes('Server error')) {
        errorMessage = 'Server is temporarily unavailable. Please try again later.';
      } else if (errorMsg) {
        errorMessage = errorMsg;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getWordCount = (): number => {
    return practiceService.countWords(content);
  };

  const getMinWords = (): number => {
    if (!exercise) return 150;
    // Use the same logic as backend to determine minWords based on task type
    const isTask1 = exercise.id.includes('_task1') || exercise.id.includes('vstep_task1');
    return isTask1 ? 150 : 250;
  };

  const calculateWordCountPenalty = (wordCount: number): number => {
    const minWords = getMinWords();
    
    if (wordCount >= minWords) {
      return 0.0;
    }
    
    // Calculate penalty: 0.5 points for every 25 words short
    const wordsShort = minWords - wordCount;
    const penalty = (wordsShort / 25) * 0.5;
    return Math.min(penalty, 2.0); // Maximum penalty of 2.0 points
  };

  const getWordCountStatus = () => {
    if (!exercise) return { type: 'neutral', message: '', penalty: 0 };
    
    const wordCount = getWordCount();
    const minWords = getMinWords();
    const penalty = calculateWordCountPenalty(wordCount);
    
    if (wordCount >= minWords) {
      return { type: 'success', message: '', penalty: 0 };
    } else if (wordCount === 0) {
      return { type: 'neutral', message: '', penalty: 0 };
    } else {
      return { 
        type: 'warning', 
        message: `⚠️ You need ${minWords - wordCount} more words. Current penalty: -${penalty.toFixed(1)} points`,
        penalty 
      };
    }
  };

  if (!exercise) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showUpgradeAlert) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-8 text-center"
        >
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">VIP Exercise - Premium Required</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            This is a premium exercise that requires an active subscription. Upgrade your account to access all VIP exercises and get detailed feedback on your writing.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/plans')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Upgrade Now
            </button>
            <button
              onClick={() => navigate('/practice/writing')}
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Exercises
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/practice/writing')}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Practice
          </button>
          <div className="text-sm text-gray-500">
            Exercise {String(exercise.exerciseNumber).padStart(2, '0')} - Part 1
          </div>
        </div>
        
        {/* Timer */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {isTimerEditable ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={customTime}
                  onChange={(e) => handleTimerEdit(parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-center font-mono text-lg font-semibold text-blue-600 bg-white border border-blue-300 rounded"
                  min="1"
                  max="180"
                />
                <span className="text-sm text-blue-600">min</span>
                <button
                  onClick={handleTimerToggle}
                  className="ml-2 p-1 text-green-600 hover:bg-green-100 rounded"
                  title="Save time"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-semibold text-blue-600">
                  {formatTime(timeLeft)}
                </span>
                <button
                  onClick={handleTimerToggle}
                  className="ml-2 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded"
                  title="Edit time"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Exercise Content */}
        <div className="space-y-6">
          {/* Task Description */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-4">
              <span className="text-sm text-blue-600 font-medium">
                You should spend about {exercise.timeLimit} minutes on this task.
              </span>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-800 leading-relaxed">{exercise.prompt}</p>
              
              {exercise.context && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <div className="whitespace-pre-line text-gray-800 italic">
                    {exercise.context}
                  </div>
                </div>
              )}
              
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <div className="whitespace-pre-line text-gray-700 text-sm">
                  {exercise.instructions}
                </div>
              </div>

              {/* Source Information */}
              {exercise.source && (
                <div className="text-right">
                  <span className="text-xs text-gray-500 italic">
                    --Source: {exercise.source}--
                  </span>
                </div>
              )}

              {/* Exercise Image */}
              {exercise.imageUrl && (
                <div className="mt-6">
                  <img
                    src={exercise.imageUrl}
                    alt={exercise.imageAlt || 'Exercise diagram'}
                    className="w-full max-w-2xl mx-auto rounded-lg border border-gray-200 shadow-sm"
                  />
                  {exercise.imageAlt && (
                    <p className="text-sm text-gray-500 text-center mt-2 italic">
                      {exercise.imageAlt}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Writing Area */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-gray-800">Your Response:</span>
            </div>
            
            {/* Word Count Warning Banner */}
            {(() => {
              const status = getWordCountStatus();
              if (status.type === 'warning' && getWordCount() > 0) {
                return (
                  <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div className="text-sm">
                        <div className="font-medium text-orange-800">Word Count Warning</div>
                        <div className="text-orange-700">{status.message}</div>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your response here..."
              className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
            
            {/* Word Count */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Words: {getWordCount()}</span>
                  <span className="text-gray-500">/ {getMinWords()}</span>
                </div>
                {(() => {
                  const status = getWordCountStatus();
                  if (status.type === 'warning') {
                    return (
                      <div className="mt-1 text-orange-600 text-xs font-medium">
                        {status.message}
                      </div>
                    );
                  } else if (status.type === 'success') {
                    return (
                      <div className="mt-1 text-green-600 text-xs font-medium">
                        ✓ Word count requirement met
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !content.trim()}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit Response
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Word Count Warning Modal */}
      <WordCountWarningModal
        isOpen={showWordCountModal}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        wordCount={getWordCount()}
        requiredWords={getMinWords()}
        penalty={calculateWordCountPenalty(getWordCount())}
      />
    </div>
  );
};

export default PracticeExercise;