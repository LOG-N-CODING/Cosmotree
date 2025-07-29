import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// 퀴즈 질문 타입 정의
export interface Question {
  id: number;
  question: string;
  type: 'multiple-choice' | 'text';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

// 퀴즈 데이터 타입 정의
export interface QuizData {
  id: number;
  title: string;
  module: string;
  questions: Question[];
  totalQuestions: number;
}

// 답변 상태 타입
export interface AnswerState {
  questionId: number;
  selectedAnswer: string | number | null;
  isCorrect: boolean | null;
  isSubmitted: boolean;
}

// 샘플 퀴즈 데이터
const sampleQuizData: QuizData = {
  id: 1,
  title: 'Introduction to Astronomy',
  module: 'Module1',
  totalQuestions: 10,
  questions: [
    {
      id: 1,
      question: 'What is the closest to Earth?',
      type: 'multiple-choice',
      options: ['The Moon', 'The Sun', 'Mars', 'Venus'],
      correctAnswer: 0,
      explanation:
        "The Moon is Earth's natural satellite and the closest celestial body to our planet, located about 384,400 kilometers away.",
    },
    {
      id: 2,
      question: 'What is Astronomy?',
      type: 'text',
      correctAnswer: 'The scientific study of celestial objects and phenomena',
      explanation:
        "Astronomy is the scientific study of celestial objects (such as stars, planets, comets, and galaxies) and phenomena that originate outside the Earth's atmosphere.",
    },
    {
      id: 3,
      question: 'Which planet is known as the Red Planet?',
      type: 'multiple-choice',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 1,
      explanation:
        'Mars is known as the Red Planet due to iron oxide (rust) on its surface, which gives it a reddish appearance.',
    },
  ],
};

const QuizDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [textAnswer, setTextAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 퀴즈 데이터 로드
  useEffect(() => {
    const loadQuizData = async () => {
      try {
        setIsLoading(true);
        // 실제 환경에서는 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 500));
        setQuizData(sampleQuizData);

        // 답변 상태 초기화
        const initialAnswers = sampleQuizData.questions.map(q => ({
          questionId: q.id,
          selectedAnswer: null,
          isCorrect: null,
          isSubmitted: false,
        }));
        setAnswers(initialAnswers);
      } catch (error) {
        console.error('Failed to load quiz data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizData();
  }, [id]);

  // Back to Modules 클릭 핸들러
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
      if (result.isConfirmed) {
        navigate('/quizzes');
      }
    });
  };

  // 답변 선택 핸들러 (객관식)
  const handleAnswerSelect = (optionIndex: number) => {
    const currentAnswer = answers[currentQuestionIndex];
    if (currentAnswer?.isSubmitted) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      ...newAnswers[currentQuestionIndex],
      selectedAnswer: optionIndex,
    };
    setAnswers(newAnswers);
  };

  // 텍스트 답변 변경 핸들러 (주관식)
  const handleTextAnswerChange = (value: string) => {
    setTextAnswer(value);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      ...newAnswers[currentQuestionIndex],
      selectedAnswer: value,
    };
    setAnswers(newAnswers);
  };

  // 답변 제출 핸들러
  const handleSubmitAnswer = () => {
    const currentQuestion = quizData?.questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestionIndex];

    if (!currentQuestion || !currentAnswer || currentAnswer.selectedAnswer === null) {
      return;
    }

    let isCorrect = false;

    if (currentQuestion.type === 'multiple-choice') {
      isCorrect = currentAnswer.selectedAnswer === currentQuestion.correctAnswer;
    } else {
      // 주관식의 경우 간단한 키워드 매칭
      const userAnswer = (currentAnswer.selectedAnswer as string).toLowerCase().trim();
      const correctAnswer = (currentQuestion.correctAnswer as string).toLowerCase().trim();
      isCorrect =
        userAnswer.includes(correctAnswer.split(' ')[0]) ||
        correctAnswer.includes(userAnswer.split(' ')[0]);
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      ...newAnswers[currentQuestionIndex],
      isCorrect,
      isSubmitted: true,
    };
    setAnswers(newAnswers);
  };

  // 다음 질문으로 이동
  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quizData?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTextAnswer('');
    } else {
      // 퀴즈 완료
      const correctCount = answers.filter(answer => answer.isCorrect).length;
      const totalQuestions = answers.length;
      const score = Math.round((correctCount / totalQuestions) * 100);

      Swal.fire({
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
      }).then(() => {
        navigate('/quizzes');
      });
    }
  };

  if (isLoading || !quizData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-white relative">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/images/quizzes-detail-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* 헤더 */}
      <div className="relative z-10 px-6 pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-14">
            {/* Back to Modules 버튼 */}
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

            {/* 퀴즈 정보 */}
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

              {/* 진행률 바 */}
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

      {/* 메인 퀴즈 영역 */}
      <div className="relative z-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white backdrop-blur-md border border-black rounded-[36px] p-14">
            <div className="space-y-9">
              {/* 질문 */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-black">{currentQuestion.question}</h2>
              </div>

              {/* 답변 옵션 */}
              <div className="space-y-4">
                {currentQuestion.type === 'multiple-choice' ? (
                  // 객관식 답변
                  currentQuestion.options?.map((option, index) => {
                    let buttonStyle = 'bg-white border border-gray-400 text-black hover:bg-gray-50';

                    if (currentAnswer?.isSubmitted) {
                      if (index === currentQuestion.correctAnswer) {
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

                        {/* 정답/오답 아이콘 */}
                        {currentAnswer?.isSubmitted && (
                          <div className="ml-auto">
                            {index === currentQuestion.correctAnswer ? (
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
                            ) : index === currentAnswer.selectedAnswer &&
                              !currentAnswer.isCorrect ? (
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
                            ) : null}
                          </div>
                        )}
                      </button>
                    );
                  })
                ) : (
                  // 주관식 답변
                  <div className="space-y-4">
                    <textarea
                      value={textAnswer}
                      onChange={e => handleTextAnswerChange(e.target.value)}
                      disabled={currentAnswer?.isSubmitted}
                      placeholder="답변을 입력해주세요..."
                      className="w-full p-4 border border-gray-400 rounded-xl resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* 주관식 답변 결과 */}
                    {currentAnswer?.isSubmitted && (
                      <div className="space-y-4">
                        {/* Your Answer 섹션 */}
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

                        {/* 정답 표시 (틀렸을 때만) */}
                        {!currentAnswer.isCorrect && (
                          <div className="bg-gray-100 border border-gray-400 rounded-xl p-4">
                            <h3 className="font-medium text-gray-700 mb-2">Correct Answer:</h3>
                            <p className="text-gray-700">{currentQuestion.correctAnswer}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 설명 영역 (답변 제출 후) */}
              {currentAnswer?.isSubmitted && (
                <div className="bg-blue-50 border border-blue-400 rounded-xl p-6">
                  <h3 className="font-bold text-blue-700 mb-2">Explanation</h3>
                  <p className="text-blue-700">{currentQuestion.explanation}</p>
                </div>
              )}

              {/* 액션 버튼 */}
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

      {/* SweetAlert2 커스텀 스타일 */}
      <style>{`
        .swal-custom-popup {
          border-radius: 36px !important;
          padding: 2rem !important;
        }
        .swal-custom-confirm {
          background-color: #FF1616 !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 8px 16px !important;
          font-weight: 500 !important;
        }
        .swal-custom-cancel {
          background-color: white !important;
          color: black !important;
          border: 1px solid #BDBDBD !important;
          border-radius: 8px !important;
          padding: 8px 16px !important;
          font-weight: 500 !important;
        }
        .swal-custom-cancel:hover {
          background-color: #f5f5f5 !important;
        }
      `}</style>
    </div>
  );
};

export default QuizDetail;
