import { motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/UI/Icon';
import './Quizzes.css';

// 퀴즈 타입 정의
interface Quiz {
  id: number;
  title: string;
  module: string;
  questions: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  score?: number;
  status: 'completed' | 'available';
  icon: string;
}

// 샘플 퀴즈 데이터
const quizzes: Quiz[] = [
  {
    id: 1,
    title: 'Introduction to Astronomy',
    module: 'Module1',
    questions: 10,
    difficulty: 'Beginner',
    score: 90,
    status: 'completed',
    icon: 'neurology',
  },
  {
    id: 2,
    title: 'Solar System Basics',
    module: 'Module2',
    questions: 15,
    difficulty: 'Beginner',
    score: 85,
    status: 'completed',
    icon: 'neurology',
  },
  {
    id: 3,
    title: 'Stars and Galaxies',
    module: 'Module3',
    questions: 12,
    difficulty: 'Beginner',
    score: 95,
    status: 'completed',
    icon: 'neurology',
  },
  {
    id: 4,
    title: 'Planetary Motion',
    module: 'Module4',
    questions: 18,
    difficulty: 'Intermediate',
    score: 0,
    status: 'available',
    icon: 'neurology',
  },
  {
    id: 5,
    title: 'Stellar Evolution',
    module: 'Module5',
    questions: 20,
    difficulty: 'Intermediate',
    score: 0,
    status: 'available',
    icon: 'neurology',
  },
  {
    id: 6,
    title: 'Cosmic Phenomena',
    module: 'Module6',
    questions: 16,
    difficulty: 'Intermediate',
    score: 0,
    status: 'available',
    icon: 'neurology',
  },
  {
    id: 7,
    title: 'Black Holes',
    module: 'Module7',
    questions: 22,
    difficulty: 'Advanced',
    score: 0,
    status: 'available',
    icon: 'neurology',
  },
  {
    id: 8,
    title: 'Cosmology',
    module: 'Module8',
    questions: 25,
    difficulty: 'Advanced',
    score: 0,
    status: 'available',
    icon: 'neurology',
  },
  {
    id: 9,
    title: 'Quantum Universe',
    module: 'Module9',
    questions: 20,
    difficulty: 'Advanced',
    score: 0,
    status: 'available',
    icon: 'neurology',
  },
  {
    id: 10,
    title: 'Quantum Universe',
    module: 'Module9',
    questions: 20,
    difficulty: 'Advanced',
    score: 0,
    status: 'available',
    icon: 'neurology',
  },
];

// 난이도별 태그 스타일
const getDifficultyStyle = (difficulty: Quiz['difficulty']) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-gray-100 text-black border-gray-300';
    case 'Intermediate':
      return 'bg-yellow-100 text-black border-yellow-400';
    case 'Advanced':
      return 'bg-red-100 text-black border-red-400';
    default:
      return 'bg-gray-100 text-black border-gray-300';
  }
};

// 개별 퀴즈 카드 컴포넌트
interface QuizCardProps {
  quiz: Quiz;
  index: number;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white border border-gray-300 rounded-[20px] p-4 md:p-6 quiz-card"
    >
      {/* 상단 섹션 */}
      <div className="flex justify-between items-start mb-4">
        {/* 아이콘과 태그 */}
        <div className="flex justify-between items-center gap-2 mb-4 w-full">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <Icon name={quiz.icon as any} size={24} />
          </div>
          <span
            className={`px-2 py-1 rounded text-sm font-semibold border ${getDifficultyStyle(quiz.difficulty)}`}
          >
            {quiz.difficulty}
          </span>
        </div>
      </div>

      {/* 퀴즈 정보 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-black mb-1">{quiz.title}</h3>
        <p className="text-sm text-black">
          {quiz.module} | {quiz.questions} questions
        </p>
      </div>

      {/* 하단 섹션 */}
      <div className="flex flex-col items-center">
        {/* 점수 섹션 */}
        <div className="flex justify-between items-center py-5 gap-4 w-full">
          <div className="flex items-center items-center gap-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <Icon name="stars2" size={18} />
            </div>
            <span className="text-sm text-black">Score</span>
          </div>
          <span className="bg-gray-100 px-2 py-1 rounded text-sm font-semibold text-black">
            {quiz.score}%
          </span>
        </div>

        {/* 액션 버튼 */}
        {quiz.status === 'available' ? (
          <Link
            to={`/quiz/${quiz.id}`}
            className="w-full bg-black text-white py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors hover:bg-gray-800"
          >
            Start Quiz
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
                fill="currentColor"
              />
            </svg>
          </Link>
        ) : (
          <Link
            to={`/quiz/${quiz.id}`}
            className="w-full bg-transparent border-2 border-black text-black py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors hover:bg-black hover:text-white"
          >
            Retake Quiz
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
                fill="currentColor"
              />
            </svg>
          </Link>
        )}
      </div>
    </motion.div>
  );
};

// 메인 퀴즈 페이지 컴포넌트
const Quizzes: React.FC = () => {
  return (
    <div
      className="min-h-screen quizzes-page relative"
      style={{
        paddingTop: '120px',
        backgroundImage: 'url(/images/quizzes-bg.png)',
      }}
    >
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 pb-12 md:pb-20">
        {/* 헤더 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-start mb-12 md:mb-16 px-4 pt-4 md:pt-8"
        >
          <div className="max-w-7xl px-4 md:px-5 mx-auto">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">Quizzes</h1>
            <p className="text-lg md:text-xl text-white">
              Test your knowledge with module-based quizzes and get instant feedback
            </p>
          </div>
        </motion.div>

        {/* 퀴즈 그리드 */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {quizzes.map((quiz, index) => (
              <QuizCard key={quiz.id} quiz={quiz} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
