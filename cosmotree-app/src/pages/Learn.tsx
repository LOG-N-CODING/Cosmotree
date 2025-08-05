import { motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/UI/Icon';

// Learning Module Card Component
interface LearningModuleProps {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  img: string;
  status: 'available' | 'locked' | 'completed';
  planetColor: string;
}

const LearningModule: React.FC<LearningModuleProps> = ({
  id,
  title,
  description,
  difficulty,
  progress,
  status,
  planetColor,
  img,
}) => {
  const getDifficultyColor = (level: string) => {
    return 'bg-gray-100 text-gray-800';
    // switch (level) {
    //   case 'Beginner':
    //     return 'bg-green-100 text-green-800';
    //   case 'Intermediate':
    //     return 'bg-yellow-100 text-yellow-800';
    //   case 'Advanced':
    //     return 'bg-red-100 text-red-800';
    //   default:
    //     return 'bg-gray-100 text-gray-800';
    // }
  };

  const getButtonText = () => {
    if (status === 'completed') return 'Review';
    if (status === 'locked') return 'Complete previous module';
    return 'Continue Learning';
  };

  const getButtonColor = () => {
    if (status === 'locked') return 'bg-gray-500 cursor-not-allowed';
    return 'bg-black hover:bg-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-3xl border border-gray-300 p-6 relative max-w-sm mx-auto ${
        status === 'locked' ? 'opacity-60' : ''
      }`}
      style={{
        boxShadow: '0px 4px 60px 0px rgba(0, 0, 0, 0.15)',
        width: '357px'
      }}
    >
      {status === 'locked' && <div className="absolute inset-0 bg-white/75 rounded-3xl z-10" />}

      <div className="space-y-7">
        {/* Header Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center justify-between gap-3 w-full">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center p-2"
                style={{ backgroundColor: planetColor }}
              >
                <Icon name="planet" size={24} />
              </div>
              <span
                className={`px-2 py-1 rounded text-sm font-semibold ${getDifficultyColor(difficulty)}`}
              >
                {difficulty}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-1">
            <img src={img} alt="Module" className="w-full h-32 object-cover rounded-lg mb-4" />
            <h3 className="text-xl font-bold text-black">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          <div className="flex justify-end">
            <span className="text-gray-700 font-medium">{progress}% Complete</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gray-800 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>

          {/* Action Button */}
          {status !== 'locked' ? (
            <Link
              to={`/learn/${id}`}
              className={`w-full ${getButtonColor()} text-white py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors`}
            >
              {getButtonText()}
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
            <button
              className={`w-full ${getButtonColor()} text-white py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors`}
              disabled={true}
            >
              {getButtonText()}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Learn: React.FC = () => {
  const learningModules: LearningModuleProps[] = [
    {
      id: '1',
      title: 'Our Solar System',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      difficulty: 'Beginner',
      progress: 100,
      status: 'completed',
      planetColor: 'transparent',
      img: '/images/module-1.png',
    },
    {
      id: '2',
      title: 'Our Solar System',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      difficulty: 'Intermediate',
      progress: 25,
      status: 'available',
      planetColor: 'transparent',
      img: '/images/module-2.png',
    },
    {
      id: '3',
      title: 'Our Solar System',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      difficulty: 'Intermediate',
      progress: 0,
      status: 'locked',
      planetColor: 'transparent',
      img: '/images/module-3.png',
    },
    {
      id: '4',
      title: 'Our Solar System',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      difficulty: 'Intermediate',
      progress: 0,
      status: 'locked',
      planetColor: 'transparent',
      img: '/images/module-4.png',
    },
    {
      id: '5',
      title: 'Our Solar System',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      difficulty: 'Advanced',
      progress: 0,
      status: 'locked',
      planetColor: 'transparent',
      img: '/images/module-5.png',
    },
    {
      id: '6',
      title: 'Our Solar System',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      difficulty: 'Advanced',
      progress: 0,
      status: 'locked',
      planetColor: 'transparent',
      img: '/images/module-6.png',
    },
    {
      id: '7',
      title: 'Our Solar System',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      difficulty: 'Advanced',
      progress: 0,
      status: 'locked',
      planetColor: 'transparent',
      img: '/images/module-7.png',
    },
    {
      id: '8',
      title: 'Our Solar System',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      difficulty: 'Beginner',
      progress: 100,
      status: 'completed',
      planetColor: 'transparent',
      img: '/images/module-8.png',
    },
    {
      id: '9',
      title: 'Our Solar System',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      difficulty: 'Beginner',
      progress: 100,
      status: 'completed',
      planetColor: 'transparent',
      img: '/images/module-1.png',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Background Planet Image */}
      <motion.div
        className="fixed top-0 right-0 w-1/3 md:w-1/2 h-screen overflow-hidden pointer-events-none opacity-20 md:opacity-30"
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        }}
      >
        <img
          src="/images/planet.png"
          alt="Planet Background"
          className="object-cover w-[400px] md:w-[600px] h-auto"
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 pt-10 md:pt-14 lg:pt-16 pb-12 md:pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 md:mb-12 max-w-2xl"
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2 md:mb-3">
              Learning Modules
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Progress through structured astronomy modules at your own pace
            </p>
          </motion.div>

          {/* Learning Modules Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
          >
            {learningModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <LearningModule {...module} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
