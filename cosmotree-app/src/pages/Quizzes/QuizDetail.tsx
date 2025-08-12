// src/pages/QuizDetail.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// 🔗 Firestore
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { finalizeQuiz, recordAnswer } from '../Quizzes';
import { db } from '../../config/firebase';

// 🔗 진행도 저장 헬퍼 (Quizzes.tsx에서 export 했던 것 사용)
// 필요하면 utils/quizProgress.ts로 이동 권장

// ───────────────── Types (이 파일 전용 내부 표시용)
export interface Question {
  id: number;
  question: string;
  type: 'multiple-choice' | 'text';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}
export interface QuizData {
  id: string; // ← 문서 ID
  title: string;
  module: string; // 표시용(=title)
  questions: Question[];
  totalQuestions: number;
}

// Firestore에 저장된 Module 문서 형태(이전 정의와 맞춤)
type QuizType = 'MultipleChoice' | 'ShortAnswer';
interface MultipleChoiceQuizFS {
  type: 'MultipleChoice';
  question: string;
  choices: string[];
  answer: string | number; // 텍스트 or 인덱스
  explanation?: string;
}
interface ShortAnswerQuizFS {
  type: 'ShortAnswer';
  question: string;
  answer: string; // 텍스트
  explanation?: string;
}
type QuizItemFS = MultipleChoiceQuizFS | ShortAnswerQuizFS;

interface ModuleDocFS {
  title: string;
  quizzes: QuizItemFS[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt?: Timestamp;
}

// 답변 상태
export interface AnswerState {
  questionId: number;
  selectedAnswer: string | number | null;
  isCorrect: boolean | null;
  isSubmitted: boolean;
}

const QuizDetail: React.FC = () => {
  const { id: moduleId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [textAnswer, setTextAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Firestore → 내부 표시용으로 매핑
  function mapModuleToQuizData(docId: string, data: ModuleDocFS): QuizData {
    const questions: Question[] = (data.quizzes ?? []).map((q, idx) => {
      if (q.type === 'MultipleChoice') {
        // 정답이 텍스트면 choices에서 인덱스 찾기
        let correct: number | string = q.answer;
        if (typeof correct === 'string') {
          const found = q.choices?.findIndex(c => c === correct);
          correct = (found ?? -1) >= 0 ? found! : correct; // 없으면 텍스트 그대로
        }
        return {
          id: idx + 1,
          question: q.question,
          type: 'multiple-choice',
          options: q.choices ?? [],
          correctAnswer: correct, // 숫자(인덱스) 우선, 불가하면 텍스트
          explanation: q.explanation ?? '',
        };
      } else {
        return {
          id: idx + 1,
          question: q.question,
          type: 'text',
          correctAnswer: q.answer,
          explanation: q.explanation ?? '',
        };
      }
    });

    return {
      id: docId,
      title: data.title ?? docId,
      module: data.title ?? docId,
      questions,
      totalQuestions: questions.length,
    };
  }

  // 모듈 로드 (moduleId 변경 시 리셋)
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!moduleId) return;
      setIsLoading(true);
      setQuizData(null);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setTextAnswer('');

      try {
        const ref = doc(db, 'modules', moduleId);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          if (alive) {
            setQuizData({
              id: moduleId,
              title: moduleId,
              module: moduleId,
              questions: [],
              totalQuestions: 0,
            });
          }
          return;
        }
        const data = snap.data() as ModuleDocFS;
        const mapped = mapModuleToQuizData(snap.id, data);

        if (alive) {
          setQuizData(mapped);
          setAnswers(
            mapped.questions.map(q => ({
              questionId: q.id,
              selectedAnswer: null,
              isCorrect: null,
              isSubmitted: false,
            }))
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [moduleId]);

  // Back to Modules
  const handleBackToModules = () => {
    Swal.fire({
      title: 'Exit Quiz?',
      html: `
        <p style="margin-bottom: 16px;">You are in the middle of taking this quiz. If you leave now, your progress will be lost and you'll need to start over from the beginning.</p>
        <p><strong>Are you sure you want to exit and reset your quiz progress?</strong></p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF1616',
      cancelButtonColor: '#ffffff',
      confirmButtonText: 'Yes, Exit and Reset',
      cancelButtonText: 'Continue Quiz',
      reverseButtons: true,
      customClass: {
        popup: 'swal-custom-popup',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel',
      },
    }).then(result => {
      if (result.isConfirmed) navigate('/quizzes');
    });
  };

  // 선택형
  const handleAnswerSelect = (optionIndex: number) => {
    const currentAnswer = answers[currentQuestionIndex];
    if (currentAnswer?.isSubmitted) return;

    const next = [...answers];
    next[currentQuestionIndex] = {
      ...next[currentQuestionIndex],
      selectedAnswer: optionIndex,
    };
    setAnswers(next);
  };

  // 주관식
  const handleTextAnswerChange = (value: string) => {
    setTextAnswer(value);
    const next = [...answers];
    next[currentQuestionIndex] = {
      ...next[currentQuestionIndex],
      selectedAnswer: value,
    };
    setAnswers(next);
  };

  // 제출(한 문제) → 정오판정 + 진행도 누적(recordAnswer)
  const handleSubmitAnswer = async () => {
    if (!quizData) return;
    const q = quizData.questions[currentQuestionIndex];
    const a = answers[currentQuestionIndex];
    if (!q || !a || a.selectedAnswer === null) return;

    let isCorrect = false;
    if (q.type === 'multiple-choice') {
      // 정답이 인덱스면 숫자 비교, 텍스트면 텍스트 비교
      if (typeof q.correctAnswer === 'number') {
        isCorrect = a.selectedAnswer === q.correctAnswer;
      } else {
        const chosen =
          typeof a.selectedAnswer === 'number'
            ? (q.options?.[a.selectedAnswer] ?? '')
            : String(a.selectedAnswer);
        isCorrect = String(q.correctAnswer).trim() === String(chosen).trim();
      }
    } else {
      const userAns = String(a.selectedAnswer).toLowerCase().trim();
      const correct = String(q.correctAnswer).toLowerCase().trim();
      // 간단 키워드 매칭(첫 단어 기준) → 필요 시 개선
      isCorrect =
        userAns === correct ||
        userAns.includes(correct.split(' ')[0]) ||
        correct.includes(userAns.split(' ')[0]);
    }

    const next = [...answers];
    next[currentQuestionIndex] = {
      ...next[currentQuestionIndex],
      isCorrect,
      isSubmitted: true,
    };
    setAnswers(next);

    // 누적 진행도 반영 (유저 로그인 상태면 저장)
    if (moduleId) {
      try {
        await recordAnswer(moduleId, isCorrect);
      } catch (e) {
        console.warn('recordAnswer failed:', e);
      }
    }
  };

  // 다음/완료
  const handleNextQuestion = async () => {
    if (!quizData) return;

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setTextAnswer('');
      return;
    }

    // Finish
    const correctCount = answers.filter(x => x.isCorrect).length;
    const totalQuestions = answers.length;
    const score = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);

    // 최종 결과 저장
    if (moduleId) {
      try {
        await finalizeQuiz(moduleId, correctCount, totalQuestions);
      } catch (e) {
        console.warn('finalizeQuiz failed:', e);
      }
    }

    await Swal.fire({
      title: 'Quiz Completed!',
      html: `
        <div style="text-align: center;">
          <p style="font-size: 18px; margin-bottom: 16px;">You scored <strong>${score}%</strong></p>
          <p>Correct answers: ${correctCount} out of ${totalQuestions}</p>
        </div>
      `,
      icon: score >= 70 ? 'success' : 'info',
      confirmButtonText: 'Back to Quizzes',
      confirmButtonColor: '#1E1E1E',
    });

    navigate('/quizzes');
  };

  const progress = useMemo(() => {
    if (!quizData) return 0;
    return ((currentQuestionIndex + 1) / Math.max(1, quizData.totalQuestions)) * 100;
  }, [quizData, currentQuestionIndex]);

  if (isLoading || !quizData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (quizData.totalQuestions === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">No quizzes in this module.</div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-white relative">
      {/* BG */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/images/quizzes-detail-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Header */}
      <div className="relative z-10 px-6 pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-14">
            {/* Back */}
            <button
              onClick={handleBackToModules}
              className="flex items-center gap-2 px-4 py-3 bg-transparent text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to Modules
            </button>

            {/* Info */}
            <div className="flex flex-col items-end gap-6">
              <div className="flex items-center gap-8">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">{quizData.title}</h1>
                </div>
                <div className="bg-gray-200 px-3 py-1 rounded-lg">
                  <span className="text-sm font-semibold text-black">
                    Question {currentQuestionIndex + 1} of {quizData.totalQuestions}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="w-full max-w-4xl h-4 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="relative z-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white backdrop-blur-md border border-black rounded-[36px] p-14">
            <div className="space-y-9">
              {/* Question */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-black">{currentQuestion.question}</h2>
              </div>

              {/* Options */}
              <div className="space-y-4">
                {currentQuestion.type === 'multiple-choice' ? (
                  currentQuestion.options?.map((option, index) => {
                    let buttonStyle = 'bg-white border border-gray-400 text-black hover:bg-gray-50';

                    if (currentAnswer?.isSubmitted) {
                      const isTrueIndex =
                        typeof currentQuestion.correctAnswer === 'number'
                          ? index === currentQuestion.correctAnswer
                          : option === String(currentQuestion.correctAnswer);

                      if (isTrueIndex) {
                        buttonStyle = 'bg-green-100 border border-green-500 text-black';
                      } else if (
                        index === currentAnswer.selectedAnswer &&
                        !currentAnswer.isCorrect
                      ) {
                        buttonStyle = 'bg-red-100 border border-red-500 text-black';
                      } else {
                        buttonStyle = 'bg-gray-100 border border-gray-400 text-black';
                      }
                    } else if (currentAnswer?.selectedAnswer === index) {
                      buttonStyle = 'bg-gray-100 border border-gray-400 text-black';
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={currentAnswer?.isSubmitted}
                        className={`w-full p-6 rounded-xl text-left transition-colors flex items-center gap-4 ${buttonStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-transparent flex items-center justify-center">
                            <span className="text-lg font-bold">
                              {String.fromCharCode(65 + index)}
                            </span>
                          </div>
                          <span className="text-lg font-semibold">{option}</span>
                        </div>

                        {currentAnswer?.isSubmitted && (
                          <div className="ml-auto">
                            {(() => {
                              const isTrueIndex =
                                typeof currentQuestion.correctAnswer === 'number'
                                  ? index === currentQuestion.correctAnswer
                                  : option === String(currentQuestion.correctAnswer);
                              if (isTrueIndex) {
                                return (
                                  <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                      <path
                                        d="M9 12L11 14L15 10"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                );
                              }
                              if (
                                index === currentAnswer.selectedAnswer &&
                                !currentAnswer.isCorrect
                              ) {
                                return (
                                  <div className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                      <path
                                        d="M18 6L6 18M6 6L18 18"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={textAnswer}
                      onChange={e => handleTextAnswerChange(e.target.value)}
                      disabled={currentAnswer?.isSubmitted}
                      placeholder="Type your answer…"
                      className="w-full p-4 border border-gray-400 rounded-xl resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {currentAnswer?.isSubmitted && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium text-black mb-2">Your answer</h3>
                          <div
                            className={`p-4 rounded-lg border flex items-center gap-3 ${
                              currentAnswer.isCorrect
                                ? 'bg-green-100 border-green-500'
                                : 'bg-red-100 border-red-500'
                            }`}
                          >
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                                currentAnswer.isCorrect ? 'bg-green-500' : 'bg-red-500'
                              }`}
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                {currentAnswer.isCorrect ? (
                                  <path
                                    d="M9 12L11 14L15 10"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                ) : (
                                  <path
                                    d="M18 6L6 18M6 6L18 18"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                )}
                              </svg>
                            </div>
                            <span
                              className={`font-medium ${
                                currentAnswer.isCorrect ? 'text-green-700' : 'text-red-700'
                              }`}
                            >
                              {currentAnswer.isCorrect ? 'Correct!' : 'Incorrect'}
                            </span>
                          </div>
                        </div>

                        {!currentAnswer.isCorrect && (
                          <div className="bg-gray-100 border border-gray-400 rounded-xl p-4">
                            <h3 className="font-medium text-gray-700 mb-2">Correct Answer:</h3>
                            <p className="text-gray-700">{String(currentQuestion.correctAnswer)}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Explanation */}
              {currentAnswer?.isSubmitted && (
                <div className="bg-blue-50 border border-blue-400 rounded-xl p-6">
                  <h3 className="font-bold text-blue-700 mb-2">Explanation</h3>
                  <p className="text-blue-700">{currentQuestion.explanation}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end">
                {!currentAnswer?.isSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={
                      currentAnswer?.selectedAnswer === null || currentAnswer?.selectedAnswer === ''
                    }
                    className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="bg-black border border-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-3"
                  >
                    {currentQuestionIndex < quizData.questions.length - 1
                      ? 'Next Question'
                      : 'Finish Quiz'}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 18L15 12L9 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SweetAlert2 custom styles */}
      <style>{`
        .swal-custom-popup { border-radius: 36px !important; padding: 2rem !important; }
        .swal-custom-confirm { background-color: #FF1616 !important; border: none !important; border-radius: 8px !important; padding: 8px 16px !important; font-weight: 500 !important; }
        .swal-custom-cancel { background-color: white !important; color: black !important; border: 1px solid #BDBDBD !important; border-radius: 8px !important; padding: 8px 16px !important; font-weight: 500 !important; }
        .swal-custom-cancel:hover { background-color: #f5f5f5 !important; }
      `}</style>
    </div>
  );
};

export default QuizDetail;
