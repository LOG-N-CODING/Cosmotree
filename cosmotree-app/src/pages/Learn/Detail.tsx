import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import Header from '../../components/layout/Header';

// Lesson interface
interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  isActive: boolean;
}

// Module data interface
interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  currentLesson: number;
  totalLessons: number;
  lessons: Lesson[];
  content: string;
}

const LearnDetail: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [isTopicsExpanded, setIsTopicsExpanded] = useState(false);

  // Mock data - in real app, this would come from API
  const moduleData: Module = {
    id: moduleId || '1',
    title: 'Introduction to Astronomy',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    difficulty: 'Beginner',
    progress: 25,
    currentLesson: 1,
    totalLessons: 4,
    lessons: [
      { id: '1', title: 'What is Astronomy?', completed: false, isActive: true },
      { id: '2', title: 'History of Astronomy', completed: false, isActive: false },
      { id: '3', title: 'Modern Astronomy', completed: false, isActive: false },
      { id: '4', title: 'Future of Space Exploration', completed: false, isActive: false }
    ],
    content: `Lorem ipsum dolor sit amet consectetur. Amet feugiat varius nunc nisi elementum convallis malesuada sollicitudin. Eu a in adipiscing sed. Adipiscing turpis in at neque suspendisse varius eu. Nulla fermentum tortor sem at aenean. Tincidunt placerat egestas sed lobortis condimentum at vitae lacus mi. A et id tellus malesuada amet. Mi duis sed eget etiam. Sagittis purus quis integer tempor eget eget risus sollicitudin dolor. Tempor turpis suspendisse sed id elementum. Dis volutpat convallis morbi convallis dui tempus ipsum convallis. Nunc enim eget eu tellus. Vitae arcu semper in varius risus ullamcorper.

Sit nunc felis convallis in malesuada hac augue at. Ornare nec egestas viverra et mauris diam tortor. Lectus elit diam ac egestas scelerisque id ac at morbi. Integer morbi at tempus porttitor sed vel odio amet. Massa venenatis volutpat ac cursus netus.

Nec vivamus varius tincidunt rhoncus viverra pulvinar pharetra habitant. Vitae feugiat aenean facilisis quis cursus sit turpis. Non varius nec non sed dui tellus at nibh nec. Nunc mauris neque est eu est quis. Lacinia mauris sem ipsum elit proin pretium nisl suspendisse quis. Enim nec ut felis ut eleifend sed viverra. Accumsan eget arcu rhoncus enim. Morbi amet ornare id id vel ut odio ac.

Sit tincidunt bibendum eu semper mauris metus ac fringilla. Sit aliquam urna consectetur hendrerit in ut. Sagittis nunc ac eu sed fermentum. Lectus luctus malesuada tempor ullamcorper pellentesque. Turpis congue purus lacus pulvinar vitae cursus.

Sit mattis magna et eget ut in dis viverra lorem. Rhoncus duis placerat vestibulum tincidunt. Orci nunc consectetur scelerisque tortor. Etiam malesuada nunc sapien gravida viverra. Venenatis scelerisque at diam fames risus. Molestie ut neque faucibus turpis dignissim velit vel. Quis adipiscing non facilisis mauris cursus suspendisse eu. Ultricies volutpat vivamus pellentesque vitae mauris velit pharetra interdum. Morbi venenatis dolor volutpat imperdiet sed. Massa nulla in duis gravida enim dui malesuada. Risus purus a dignissim justo ullamcorper in.

Interdum et turpis vitae enim non iaculis nibh aenean in. Dui scelerisque lacus at sit sapien sit rhoncus enim. Lorem nam dui sit ultrices dui proin id nisi. Eu nisi tempus tortor nullam ac. Nisl quis scelerisque tortor sollicitudin ipsum et odio odio. Dignissim nunc malesuada purus ullamcorper lectus tortor in tristique. Hac mi aliquam viverra pellentesque fringilla aliquet sit viverra. Amet enim semper id curabitur nibh auctor ultrices dignissim. Facilisis tristique eu quisque ullamcorper. Velit a nulla senectus malesuada varius mattis. Velit duis in pellentesque nunc pharetra volutpat quisque iaculis ipsum.`
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <Header mode="light" />

      {/* Main Content */}
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            {/* Navigation and Lesson Info */}
            <div className="flex justify-between items-center mb-6">
              <Link
                to="/learn"
                className="flex items-center gap-2 text-black hover:text-gray-700 font-medium transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
                </svg>
                Back to Modules
              </Link>
              
              <div className="bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                Lesson {moduleData.currentLesson} of {moduleData.totalLessons}
              </div>
            </div>

            {/* Progress Section */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-black">Lessons Progress</span>
              <span className="text-lg font-medium text-black">{moduleData.progress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
              <motion.div
                className="bg-gray-800 h-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${moduleData.progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Lessons */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6">
                <h3 className="text-xl font-bold text-black mb-6">Lessons</h3>
                <div className="space-y-4">
                  {moduleData.lessons.map((lesson, index) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${
                        lesson.isActive
                          ? 'bg-gray-800 border-gray-800 text-white'
                          : 'bg-white border-gray-200 text-black hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        lesson.isActive ? 'bg-gray-600' : 'bg-gray-100'
                      }`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill={lesson.isActive ? 'white' : '#1C1B1F'}/>
                        </svg>
                      </div>
                      <span className="font-semibold text-sm">{lesson.title}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-3"
            >
              <div className="space-y-8">
                {/* Module Info */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-black mb-2">{moduleData.title}</h1>
                    <p className="text-gray-600 mb-4">{moduleData.description}</p>
                    <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${getDifficultyColor(moduleData.difficulty)}`}>
                      {moduleData.difficulty}
                    </span>
                  </div>
                  
                  {/* Topics Covered */}
                  <div className="w-80">
                    <button
                      onClick={() => setIsTopicsExpanded(!isTopicsExpanded)}
                      className="w-full flex items-center justify-between gap-2 bg-white border border-gray-300 px-4 py-3 rounded-lg font-medium text-black hover:bg-gray-50 transition-colors"
                    >
                      Topics Covered
                      <motion.svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        animate={{ rotate: isTopicsExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor"/>
                      </motion.svg>
                    </button>
                    
                    {isTopicsExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 bg-white border border-gray-300 rounded-lg p-4"
                      >
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Basic concepts of astronomy</li>
                          <li>• Solar system overview</li>
                          <li>• Stars and galaxies</li>
                          <li>• Space exploration history</li>
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Lesson Content */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-black mb-6">What is Astronomy?</h2>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    {moduleData.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-6">{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                  <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
                    </svg>
                    Previous
                  </button>

                  <button className="flex items-center gap-2 bg-gray-800 border border-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                    Next Lesson
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnDetail;
