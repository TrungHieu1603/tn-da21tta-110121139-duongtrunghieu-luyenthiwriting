import React from 'react';
import { WritingScore } from '../../services/writing.service';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { formatIeltsScore } from '../../utils/ielts-rounding';
import writingService from '../../services/writing.service';


interface ScoreDisplayProps {
  score: WritingScore;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  // Parse corrections properly using the writing service
  const corrections = writingService.parseCorrections(score);
  
  // Check premium access
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const plan = user?.subscription?.plan;
  const status = user?.subscription?.status;
  const isPremium = plan !== 'free' && status === 'active';
  
  const criteriaColors = {
    task_achievement: 'bg-blue-100 border-blue-500',
    coherence_cohesion: 'bg-purple-100 border-purple-500',
    lexical_resource: 'bg-green-100 border-green-500',
    grammatical_range: 'bg-yellow-100 border-yellow-500'
  };

  const getBandColor = (score: number) => {
    if (score >= 7.5) return 'text-green-600';
    if (score >= 6.5) return 'text-blue-600';
    if (score >= 5.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToWord = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: `IELTS Writing ${score.task_type === 'task1' ? 'Task 1' : 'Task 2'} - Score Report`,
            heading: HeadingLevel.HEADING_1,
            spacing: {
              after: 200
            }
          }),

          // Date
          new Paragraph({
            children: [
              new TextRun({
                text: `Date: ${formatDate(score.created_at)}`,
                size: 24
              })
            ],
            spacing: {
              after: 200
            }
          }),

          // Overall Score
          new Paragraph({
            children: [
              new TextRun({
                text: `Overall Band Score: ${formatIeltsScore(score.overall_score)}`,
                bold: true,
                size: 28
              })
            ],
            spacing: {
              after: 400
            }
          }),

          // Detailed Scores Section
          new Paragraph({
            text: "Detailed Scores and Feedback",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              after: 200
            }
          }),

          // Task Achievement
          new Paragraph({
            text: "Task Achievement",
            heading: HeadingLevel.HEADING_3
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Score: ${formatIeltsScore(score.task_achievement)}`,
                bold: true
              })
            ]
          }),
          new Paragraph({
            text: score.task_achievement_feedback,
            spacing: {
              after: 200
            }
          }),

          // Coherence & Cohesion
          new Paragraph({
            text: "Coherence & Cohesion",
            heading: HeadingLevel.HEADING_3
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Score: ${formatIeltsScore(score.coherence_cohesion)}`,
                bold: true
              })
            ]
          }),
          new Paragraph({
            text: score.coherence_cohesion_feedback,
            spacing: {
              after: 200
            }
          }),

          // Lexical Resource
          new Paragraph({
            text: "Lexical Resource",
            heading: HeadingLevel.HEADING_3
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Score: ${formatIeltsScore(score.lexical_resource)}`,
                bold: true
              })
            ]
          }),
          new Paragraph({
            text: score.lexical_resource_feedback,
            spacing: {
              after: 200
            }
          }),

          // Grammatical Range & Accuracy
          new Paragraph({
            text: "Grammatical Range & Accuracy",
            heading: HeadingLevel.HEADING_3
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Score: ${formatIeltsScore(score.grammatical_range)}`,
                bold: true
              })
            ]
          }),
          new Paragraph({
            text: score.grammatical_range_feedback,
            spacing: {
              after: 400
            }
          }),

          // Corrections (only for premium users)
          ...(isPremium ? [
            new Paragraph({
              text: "Suggested Corrections",
              heading: HeadingLevel.HEADING_2,
              spacing: {
                after: 200
              }
            }),

            // Grammar Corrections
            ...(corrections.grammar?.length > 0 ? [
            new Paragraph({
              text: "Grammar Corrections",
              heading: HeadingLevel.HEADING_3
            }),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...corrections.grammar.map((correction: Record<string, any>, index: number) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${index + 1}. Original: `,
                    bold: true
                  }),
                  new TextRun({
                    text: correction.original
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Correction: ",
                    bold: true
                  }),
                  new TextRun({
                    text: correction.correction,
                    color: "2E7D32"  // Dark green
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Explanation: ",
                    bold: true
                  }),
                  new TextRun({
                    text: correction.explanation,
                    italics: true
                  })
                ],
                spacing: {
                  after: 200
                }
              })
            ]).flat()
          ] : []),

          // Vocabulary Suggestions
          ...(corrections.vocabulary?.length > 0 ? [
            new Paragraph({
              text: "Vocabulary Improvements",
              heading: HeadingLevel.HEADING_3
            }),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...corrections.vocabulary.map((suggestion: Record<string, any>, index: number) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${index + 1}. Original: `,
                    bold: true
                  }),
                  new TextRun({
                    text: suggestion.original
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Suggestion: ",
                    bold: true
                  }),
                  new TextRun({
                    text: suggestion.suggestion,
                    color: "1976D2"  // Blue
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Explanation: ",
                    bold: true
                  }),
                  new TextRun({
                    text: suggestion.explanation,
                    italics: true
                  })
                ],
                spacing: {
                  after: 200
                }
              })
            ]).flat()
          ] : []),

          // Structure Improvements
          ...(corrections.structure?.length > 0 ? [
            new Paragraph({
              text: "Structure Improvements",
              heading: HeadingLevel.HEADING_3
            }),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...corrections.structure.map((improvement: Record<string, any>, index: number) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${index + 1}. Issue: `,
                    bold: true
                  }),
                  new TextRun({
                    text: improvement.issue
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Suggestion: ",
                    bold: true
                  }),
                  new TextRun({
                    text: improvement.suggestion,
                    color: "7B1FA2"  // Purple
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Example: ",
                    bold: true
                  }),
                  new TextRun({
                    text: improvement.example,
                    italics: true
                  })
                ],
                spacing: {
                  after: 200
                }
              })
            ]).flat()
          ] : [])
          ] : [
            // Premium upgrade section for free users
            new Paragraph({
              text: "🔒 Premium Features Available",
              heading: HeadingLevel.HEADING_2,
              spacing: {
                after: 200
              }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "The following advanced features are available for premium subscribers:",
                  bold: true
                })
              ],
              spacing: {
                after: 200
              }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "✓ Detailed Grammar Corrections",
                  break: 1
                }),
                new TextRun({
                  text: "   - Identify and fix grammatical errors",
                  break: 1
                }),
                new TextRun({
                  text: "   - Detailed explanations for each correction",
                  break: 1
                }),
                new TextRun({
                  text: "✓ Vocabulary Improvements",
                  break: 2
                }),
                new TextRun({
                  text: "   - Advanced word suggestions",
                  break: 1
                }),
                new TextRun({
                  text: "   - Context-appropriate alternatives",
                  break: 1
                }),
                new TextRun({
                  text: "✓ Structure Improvements",
                  break: 2
                }),
                new TextRun({
                  text: "   - Essay organization suggestions",
                  break: 1
                }),
                new TextRun({
                  text: "   - Coherence and cohesion improvements",
                  break: 1
                })
              ],
              spacing: {
                after: 300
              }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "🚀 Upgrade to Premium Today!",
                  bold: true,
                  size: 28,
                  color: "1976D2"
                })
              ],
              spacing: {
                after: 200
              }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Visit our upgrade page to unlock all premium features:",
                  break: 1
                }),
                new TextRun({
                  text: "http://localhost:5173/plans",
                  break: 1,
                  color: "1976D2",
                  underline: {}
                })
              ],
              spacing: {
                after: 400
              }
            })
          ]),

          // Essay Text
          new Paragraph({
            text: "Essay Text",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: score.essay_text,
            spacing: {
              after: 200
            }
          })
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    const filePrefix = isPremium ? 'IELTS_Writing_Premium' : 'IELTS_Writing_Free';
    const fileName = `${filePrefix}_${score.task_type}_${new Date().toISOString().split('T')[0]}.docx`;
    saveAs(blob, fileName);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Writing {score.task_type === 'task1' ? 'Task 1' : 'Task 2'}
          </h2>
          <p className="text-gray-600">{formatDate(score.created_at)}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              <span className={getBandColor(score.overall_score)}>
                {formatIeltsScore(score.overall_score)}
              </span>
            </div>
            <div className="text-sm text-gray-600">Overall Band Score</div>
          </div>
          <button
            onClick={exportToWord}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md ${
              isPremium 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gradient-to-r from-yellow-500 to-red-300 text-white hover:from-yellow-600 hover:to-red-600'
            }`}
            title={isPremium ? 'Export full report with suggestions' : 'Export report with upgrade information'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {isPremium ? 'Export Premium Report' : 'Export Report'}
            {!isPremium && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Score Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Task Achievement */}
        <div className={`p-4 rounded-lg border-l-4 ${criteriaColors.task_achievement}`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-800">Task Achievement</h3>
            <span className={`text-xl font-bold ${getBandColor(score.task_achievement)}`}>
              {formatIeltsScore(score.task_achievement)}
            </span>
          </div>
          <p className="text-gray-600 text-sm">{score.task_achievement_feedback}</p>
        </div>

        {/* Coherence & Cohesion */}
        <div className={`p-4 rounded-lg border-l-4 ${criteriaColors.coherence_cohesion}`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-800">Coherence & Cohesion</h3>
            <span className={`text-xl font-bold ${getBandColor(score.coherence_cohesion)}`}>
              {formatIeltsScore(score.coherence_cohesion)}
            </span>
          </div>
          <p className="text-gray-600 text-sm">{score.coherence_cohesion_feedback}</p>
        </div>

        {/* Lexical Resource */}
        <div className={`p-4 rounded-lg border-l-4 ${criteriaColors.lexical_resource}`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-800">Lexical Resource</h3>
            <span className={`text-xl font-bold ${getBandColor(score.lexical_resource)}`}>
              {formatIeltsScore(score.lexical_resource)}
            </span>
          </div>
          <p className="text-gray-600 text-sm">{score.lexical_resource_feedback}</p>
        </div>

        {/* Grammatical Range & Accuracy */}
        <div className={`p-4 rounded-lg border-l-4 ${criteriaColors.grammatical_range}`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-800">Grammatical Range & Accuracy</h3>
            <span className={`text-xl font-bold ${getBandColor(score.grammatical_range)}`}>
              {formatIeltsScore(score.grammatical_range)}
            </span>
          </div>
          <p className="text-gray-600 text-sm">{score.grammatical_range_feedback}</p>
        </div>
      </div>

      {/* Essay Text */}
      <div className="mt-6">
        <h3 className="font-semibold text-gray-800 mb-3">Essay Text</h3>
        <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700">
          {score.essay_text}
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay; 