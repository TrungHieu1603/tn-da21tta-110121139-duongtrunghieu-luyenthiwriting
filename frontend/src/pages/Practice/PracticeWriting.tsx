import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import practiceService from '../../services/practice.service';
import { ExerciseCategory, ExamType } from '../../types/practice.types';

const PracticeWriting: React.FC = () => {
  const [categories, setCategories] = useState<ExerciseCategory[]>([]);
  const [selectedExamType, setSelectedExamType] = useState<ExamType>('vstep');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    try {
      setLoading(true);
      const exerciseCategories = practiceService.getExerciseCategories();
      setCategories(exerciseCategories);
    } catch (error) {
      console.error('Error fetching exercise categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCategories = () => {
    return categories.filter(category => category.type === selectedExamType);
  };

  const handleExerciseClick = (exerciseId: string, isVip: boolean) => {
    const isPremium = practiceService.checkPremiumAccess();
    
    if (isVip && !isPremium) {
      // Show premium upgrade modal or redirect to plans
      navigate('/plans');
      return;
    }
    
    navigate(`/practice/writing/exercise/${exerciseId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Writing Practice</h1>
        <p className="text-lg text-gray-600">
          Improve your writing skills with structured practice exercises
        </p>
      </div>

      {/* Exam Type Selector */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setSelectedExamType('vstep')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              selectedExamType === 'vstep'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            VSTEP
          </button>
          <button
            onClick={() => setSelectedExamType('ielts')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              selectedExamType === 'ielts'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            IELTS
          </button>
        </div>
      </div>

      {/* Categories */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedExamType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {getFilteredCategories().map((category) => (
            <div key={`${category.type}-${category.taskType}`} className="bg-white rounded-lg shadow-lg p-6">
              {/* Category Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {category.title}
                </h2>
                <p className="text-gray-600">{category.description}</p>
              </div>

              {/* Exercise Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                {category?.exercises?.sort((a, b) => a.exerciseNumber - b.exerciseNumber)?.map((exercise) => (
                  <motion.div
                    key={exercise.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <button
                      onClick={() => handleExerciseClick(exercise.id, exercise.isVip)}
                      title={exercise.source ? `${exercise.title}\n${exercise.source}` : exercise.title}
                      className={`
                        w-full aspect-square rounded-lg border-2 transition-all duration-200 flex items-center justify-center text-sm font-medium relative
                        ${exercise.isVip 
                          ? 'border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100' 
                          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                        }
                      `}
                    >
                      {String(exercise.exerciseNumber).padStart(2, '0')}
                      {exercise.isVip && (
                        <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-800 text-xs px-1.5 py-0.5 rounded-full font-bold">
                          VIP
                        </span>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Popular Exercises */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Most Popular Exercises
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {category.exercises
                    .sort((a, b) => b.totalAttempts - a.totalAttempts)
                    .slice(0, 3)
                    .map((exercise) => (
                      <motion.div
                        key={exercise.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleExerciseClick(exercise.id, exercise.isVip)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-semibold text-gray-800">
                            Exercise {String(exercise.exerciseNumber).padStart(2, '0')}
                          </span>
                          {exercise.isVip && (
                            <span className="bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                              VIP
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-700 mb-2">{exercise.title}</h4>
                        {exercise.source && (
                          <p className="text-xs text-gray-500 mb-2 italic">
                            {exercise.source}
                          </p>
                        )}
                        <p className="text-sm text-blue-600 font-medium">
                          {exercise.totalAttempts.toLocaleString()} attempts
                        </p>
                      </motion.div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Info Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">How It Works</h3>
          <p className="text-gray-600 mb-4">
            Choose an exercise, write your response, and get detailed AI feedback to improve your skills.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Choose Exercise</h4>
              <p className="text-sm text-gray-600">Select from VSTEP or IELTS practice exercises</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Write Response</h4>
              <p className="text-sm text-gray-600">Complete the writing task within the time limit</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Get Feedback</h4>
              <p className="text-sm text-gray-600">Receive detailed AI analysis and suggestions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeWriting;