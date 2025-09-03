import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PracticeScoreDisplay from '../../components/Practice/PracticeScoreDisplay';
import { PracticeScore, PracticeExercise, PracticeSubmission } from '../../types/practice.types';
import practiceService from '../../services/practice.service';

interface LocationState {
  score: PracticeScore;
  exercise: PracticeExercise;
  submission: PracticeSubmission;
}

const PracticeResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const isPremium = practiceService.checkPremiumAccess();

  if (!state || !state.score || !state.exercise) {
    navigate('/practice/writing');
    return null;
  }

  const { score, exercise, submission } = state;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Practice Results</h1>
        <p className="text-gray-600">Exercise {String(exercise.exerciseNumber).padStart(2, '0')}: {exercise.title}</p>
      </motion.div>

      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="flex justify-center mb-8"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </motion.div>

      {/* Results Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-lg p-8 mb-8"
      >
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {score.overallScore.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Overall Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {submission.wordCount}
            </div>
            <div className="text-sm text-gray-600">Words Written</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {practiceService.formatTime(submission.timeSpent)}
            </div>
            <div className="text-sm text-gray-600">Time Spent</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {exercise.timeLimit}m
            </div>
            <div className="text-sm text-gray-600">Time Limit</div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Score Breakdown</h3>
          <PracticeScoreDisplay score={score} />
        </div>

        {/* Detailed Feedback */}
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Task Fulfillment ({score.taskFulfillmentScore}/10)
              </h4>
              <p className="text-gray-700 text-sm">{score.taskFulfillmentFeedback}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Organization ({score.organizationScore}/10)
              </h4>
              <p className="text-gray-700 text-sm">{score.organizationFeedback}</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Vocabulary ({score.vocabularyScore}/10)
              </h4>
              <p className="text-gray-700 text-sm">{score.vocabularyFeedback}</p>
            </div>

            <div className="bg-red-50 rounded-lg p-6">
              <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Grammar ({score.grammarScore}/10)
              </h4>
              <p className="text-gray-700 text-sm">{score.grammarFeedback}</p>
            </div>
          </div>
        </div>

        {/* Corrections Section */}
        {(() => {
          const hasCorrections = score.grammarCorrections?.length > 0 ||
            score.vocabularySuggestions?.length > 0 ||
            score.structureImprovements?.length > 0;

          return hasCorrections && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Suggested Corrections
              </h3>

              {isPremium ? (
                <div className="space-y-6">
                  {/* Grammar Corrections */}
                  {score.grammarCorrections?.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Grammar Corrections
                      </h4>
                      <div className="space-y-4">
                        {score.grammarCorrections.map((correction, index) => (
                          <div key={index} className="bg-red-50 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <span className="bg-red-100 text-red-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                {index + 1}
                              </span>
                              <div className="flex-1">
                                <p className="text-gray-800 line-through decoration-red-500">
                                  {correction.original}
                                </p>
                                <p className="text-green-600 font-medium mt-1">
                                  {correction.correction}
                                </p>
                                <p className="text-gray-600 text-sm mt-2 italic">
                                  {correction.explanation}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vocabulary Suggestions */}
                  {score.vocabularySuggestions?.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Vocabulary Improvements
                      </h4>
                      <div className="space-y-4">
                        {score.vocabularySuggestions.map((suggestion, index) => (
                          <div key={index} className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <span className="bg-blue-100 text-blue-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                {index + 1}
                              </span>
                              <div className="flex-1">
                                <p className="text-gray-800 line-through decoration-blue-500">
                                  {suggestion.original}
                                </p>
                                <p className="text-blue-600 font-medium mt-1">
                                  {suggestion.suggestion}
                                </p>
                                <p className="text-gray-600 text-sm mt-2 italic">
                                  {suggestion.explanation}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Structure Improvements */}
                  {score.structureImprovements?.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                        Structure Improvements
                      </h4>
                      <div className="space-y-4">
                        {score.structureImprovements.map((improvement, index) => (
                          <div key={index} className="bg-purple-50 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <span className="bg-purple-100 text-purple-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                {index + 1}
                              </span>
                              <div className="flex-1">
                                <p className="text-gray-800 font-medium">
                                  Issue: {improvement.issue}
                                </p>
                                <p className="text-purple-600 mt-1">
                                  Suggestion: {improvement.suggestion}
                                </p>
                                <p className="text-gray-600 mt-2 italic bg-purple-50 p-2 rounded">
                                  Example: {improvement.example}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Premium Upgrade Alert for Free Users */
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        Unlock Detailed Corrections & Suggestions
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Upgrade to a premium plan to access detailed grammar corrections, vocabulary improvements, and structure suggestions that will help you improve your writing significantly.
                      </p>
                      <button
                        onClick={() => navigate('/plans')}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Upgrade Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center gap-4"
      >
        <button
          onClick={() => navigate('/practice/writing')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Try Another Exercise
        </button>
        <button
          onClick={() => navigate('/writing/scores')}
          className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          View All Scores
        </button>
      </motion.div>
    </div>
  );
};

export default PracticeResults;