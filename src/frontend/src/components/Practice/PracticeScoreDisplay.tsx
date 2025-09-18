import React from 'react';
import { PracticeScore } from '../../types/practice.types';
import { formatIeltsScore } from '../../utils/ielts-rounding';

interface PracticeScoreDisplayProps {
  score: PracticeScore;
}

const PracticeScoreDisplay: React.FC<PracticeScoreDisplayProps> = ({ score }) => {
  const getScoreColor = (scoreValue: number): string => {
    if (scoreValue >= 8) return 'text-green-600';
    if (scoreValue >= 6.5) return 'text-blue-600';
    if (scoreValue >= 5.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (scoreValue: number): string => {
    if (scoreValue >= 8) return 'bg-green-50 border-green-200';
    if (scoreValue >= 6.5) return 'bg-blue-50 border-blue-200';
    if (scoreValue >= 5.5) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const formatScore = (value: number): string => {
    return formatIeltsScore(value) || '0';
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Overall Score */}
      <div className={`rounded-lg border-2 p-6 mb-6 text-center ${getScoreBackground(score.overallScore)}`}>
        <div className="mb-2">
          <span className="text-lg font-medium text-gray-600">Overall Score</span>
        </div>
        <div className={`text-4xl font-bold ${getScoreColor(score.overallScore)}`}>
          {formatScore(score.overallScore)}
        </div>
        <div className="text-sm text-gray-500 mt-1">out of 10.0</div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div>
              <div className="font-medium text-gray-800">Task Fulfillment</div>
              <div className="text-sm text-gray-600">Content relevance</div>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(score.taskFulfillmentScore)}`}>
              {formatScore(score.taskFulfillmentScore)}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
            <div>
              <div className="font-medium text-gray-800">Organization</div>
              <div className="text-sm text-gray-600">Structure & flow</div>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(score.organizationScore)}`}>
              {formatScore(score.organizationScore)}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50 border border-purple-200">
            <div>
              <div className="font-medium text-gray-800">Vocabulary</div>
              <div className="text-sm text-gray-600">Word choice & range</div>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(score.vocabularyScore)}`}>
              {formatScore(score.vocabularyScore)}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-200">
            <div>
              <div className="font-medium text-gray-800">Grammar</div>
              <div className="text-sm text-gray-600">Accuracy & range</div>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(score.grammarScore)}`}>
              {formatScore(score.grammarScore)}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            score: score.taskFulfillmentScore,
            label: 'Task Fulfillment',
            icon: '🎯',
            description: 'How well you addressed the task'
          },
          {
            score: score.organizationScore,
            label: 'Organization',
            icon: '📝',
            description: 'Structure and coherence'
          },
          {
            score: score.vocabularyScore,
            label: 'Vocabulary',
            icon: '📚',
            description: 'Word choice and variety'
          },
          {
            score: score.grammarScore,
            label: 'Grammar',
            icon: '✏️',
            description: 'Accuracy and complexity'
          }
        ].map((item, index) => (
          <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className={`text-lg font-bold ${getScoreColor(item.score)}`}>
              {formatScore(item.score)}
            </div>
            <div className="text-xs text-gray-600 mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticeScoreDisplay;