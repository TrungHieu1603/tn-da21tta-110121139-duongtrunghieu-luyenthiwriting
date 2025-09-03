import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WordCountWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  wordCount: number;
  requiredWords: number;
  penalty: number;
}

const WordCountWarningModal: React.FC<WordCountWarningModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  wordCount,
  requiredWords,
  penalty
}) => {
  const wordsShort = requiredWords - wordCount;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Word Count Warning</h3>
                  <p className="text-sm text-gray-500">Your response is below the minimum requirement</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Statistics */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{wordCount}</div>
                      <div className="text-sm text-gray-500">Current Words</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{requiredWords}</div>
                      <div className="text-sm text-gray-500">Required Words</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-600">-{penalty.toFixed(1)} points</div>
                      <div className="text-sm text-gray-500">Penalty for {wordsShort} words short</div>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">What happens if you submit now?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your response will be scored with a <strong>{penalty.toFixed(1)}-point penalty</strong></li>
                    <li>• You'll receive feedback on your writing</li>
                    <li>• The penalty is calculated as 0.5 points per 25 words short</li>
                  </ul>
                </div>

                {/* Recommendation */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">💡 Our Recommendation</h4>
                  <p className="text-sm text-green-800">
                    Add <strong>{wordsShort} more words</strong> to meet the minimum requirement and avoid the penalty. 
                    This will help you achieve a better score!
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Continue Writing
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Submit with Penalty
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WordCountWarningModal;