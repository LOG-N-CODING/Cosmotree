import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Sample data - 실제로는 API에서 가져올 데이터
const moduleProgressData = [
  {
    id: 1,
    title: 'Our Solar System',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'completed',
    progress: 100,
  },
  {
    id: 2,
    title: 'Our Solar System',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'in-progress',
    progress: 67,
  },
  {
    id: 3,
    title: 'The Andromeda Galaxy',
    description: 'Nullam quis risus eget urna mollis ornare vel eu leo.',
    status: 'not-started',
    progress: 0,
  },
];

const quizHistoryData = [
  {
    id: 1,
    topic: 'Introduction to Astronomy',
    module: 'Module 1',
    difficulty: 'Beginner',
    score: '92%',
    status: 'complete',
    action: 'retake',
  },
  {
    id: 2,
    topic: 'The Solar System',
    module: 'Module 2',
    difficulty: 'Beginner',
    score: '92%',
    status: 'complete',
    action: 'retake',
  },
  {
    id: 3,
    topic: 'Stars and Constellations',
    module: 'Module 3',
    difficulty: 'Beginner',
    score: '92%',
    status: 'pending',
    action: 'start',
  },
  {
    id: 4,
    topic: 'Galaxies and Nebulae',
    module: 'Module 4',
    difficulty: 'Intermediate',
    score: '92%',
    status: 'pending',
    action: 'start',
  },
];

const MyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'module' | 'quiz'>('module');
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditProfile = () => {
    setIsEditMode(true);
  };

  const handleSaveProfile = () => {
    setIsEditMode(false);
    console.log('Profile saved');
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    console.log('Edit cancelled');
  };

  const handleQuizAction = (action: string, quizId: number) => {
    // Handle quiz actions (start/retake)
    console.log(`${action} quiz ${quizId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="flex justify-center pt-[100px] md:pt-[170px] px-4 md:px-0">
        <div className="w-full max-w-[1128px]">
          <h1 className="text-[24px] md:text-[32px] font-bold text-black leading-[1.3] mb-1">
            My Profile
          </h1>
          <p className="text-[16px] md:text-[20px] text-black leading-[1.5]">
            Track your learning progress and manage your account settings
          </p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex justify-center mt-[40px] md:mt-[60px] px-4 md:px-0">
        <div className="w-full max-w-[1128px] flex flex-col lg:flex-row gap-8 lg:gap-[168px]">
          {/* Profile Card */}
          <div className="w-full lg:w-[480px] h-auto lg:h-[485px] bg-white border border-[#BDBDBD] rounded-[20px] shadow-[0px_4px_60px_0px_rgba(0,0,0,0.1)] p-[24px] md:p-[36px]">
            <div className="flex flex-col gap-[30px] md:gap-[47px] h-full">
              {/* Profile Header */}
              <div className="flex flex-col gap-[20px] md:gap-[32px]">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-[40px] h-[40px] p-2 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <span className="text-[16px] md:text-[18px] text-black leading-[1.5]">
                      Profile Information
                    </span>
                  </div>
                  <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] bg-[#D9D9D9] rounded-full"></div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex flex-col gap-4 items-center">
                <div className="w-full max-w-[408px]">
                  <div className="bg-white rounded-lg px-4 py-2 w-full h-[56px] flex items-center gap-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V4H9V5.5L3 7V9H21ZM12 8C10.9 8 10 8.9 10 10V11H14V10C14 8.9 13.1 8 12 8ZM2 20V18H22V20H2Z"
                        fill="black"
                      />
                    </svg>
                    <span className="text-[18px] md:text-[20px] font-bold text-black">
                      Star Lee
                    </span>
                  </div>
                </div>

                <div className="w-full max-w-[408px]">
                  <div className="bg-white rounded-lg px-4 py-2 w-full h-[56px] flex items-center gap-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                        fill="black"
                      />
                    </svg>
                    <span className="text-[18px] md:text-[20px] text-black">
                      user@cosmotree.com
                    </span>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <div className="w-full max-w-[408px] h-[56px] mt-4">
                  <button
                    onClick={handleEditProfile}
                    className="w-full h-full bg-black text-white rounded-lg text-[16px] font-medium hover:bg-gray-800 transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Profile Section for Edit Mode */}
          {isEditMode && (
            <div className="w-full lg:w-[480px] h-auto lg:h-[565px] bg-white border border-[#BDBDBD] rounded-[20px] shadow-[0px_4px_60px_0px_rgba(0,0,0,0.1)] p-[24px] md:p-[36px]">
              <div className="flex flex-col gap-[30px] md:gap-[47px] h-full">
                {/* Profile Header */}
                <div className="flex flex-col gap-[20px] md:gap-[32px]">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-[40px] h-[40px] p-2 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"
                            fill="#1C1B1F"
                          />
                        </svg>
                      </div>
                      <span className="text-[16px] md:text-[18px] text-black leading-[1.5]">
                        Profile Information
                      </span>
                    </div>
                    <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] bg-[#D9D9D9] rounded-full"></div>
                  </div>
                </div>

                {/* Enhanced Profile Info with Edit Fields */}
                <div className="flex flex-col gap-4 items-center">
                  <div className="w-full max-w-[408px]">
                    <div className="bg-white border border-[#CCCCCC] rounded-lg px-4 py-2 w-full h-[56px] flex items-center gap-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V4H9V5.5L3 7V9H21ZM12 8C10.9 8 10 8.9 10 10V11H14V10C14 8.9 13.1 8 12 8ZM2 20V18H22V20H2Z"
                          fill="#1C1B1F"
                        />
                      </svg>
                      <input
                        type="text"
                        defaultValue="Star Lee"
                        className="text-[18px] md:text-[20px] font-bold text-black bg-transparent border-none outline-none flex-1"
                      />
                    </div>
                  </div>

                  <div className="w-full max-w-[408px]">
                    <div className="bg-white border border-[#CCCCCC] rounded-lg px-4 py-2 w-full h-[56px] flex items-center gap-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                          fill="#1C1B1F"
                        />
                      </svg>
                      <input
                        type="email"
                        defaultValue="user@cosmotree.com"
                        className="text-[18px] md:text-[20px] text-black bg-transparent border-none outline-none flex-1"
                      />
                    </div>
                  </div>

                  <div className="w-full max-w-[408px]">
                    <div className="bg-white border border-[#CCCCCC] rounded-lg px-4 py-2 w-full h-[56px] flex items-center gap-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M18 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 19C10.9 19 10 18.1 10 17S10.9 15 12 15S14 15.9 14 17S13.1 19 12 19ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9S15.1 4.29 15.1 6V8Z"
                          fill="#1C1B1F"
                        />
                      </svg>
                      <input
                        type="password"
                        placeholder="New password"
                        className="text-[18px] md:text-[20px] text-[#AAAAAA] placeholder-[#AAAAAA] bg-transparent border-none outline-none flex-1"
                      />
                    </div>
                  </div>

                  {/* Save/Cancel Buttons */}
                  <div className="w-full max-w-[408px] flex gap-[13px] mt-4">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 h-[56px] bg-[#1E1E1E] text-white rounded-lg text-[16px] font-normal hover:bg-gray-800 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 h-[56px] bg-[#1E1E1E] border border-[#1E1E1E] text-white rounded-lg text-[16px] font-normal hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex justify-center mt-[40px] md:mt-[67px] px-4 md:px-0">
        <div className="w-full max-w-[1128px] h-[64px] md:h-[74px] bg-white border border-[#BDBDBD] rounded-[100px] shadow-[0px_4px_60px_0px_rgba(0,0,0,0.1)] p-2">
          <div className="flex h-full">
            <button
              onClick={() => setActiveTab('module')}
              className={`flex-1 rounded-[100px] text-[14px] md:text-[16px] font-normal transition-all ${
                activeTab === 'module' ? 'bg-[#1E1E1E] text-white' : 'text-black hover:bg-gray-50'
              }`}
            >
              Module Progress
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 rounded-[100px] text-[14px] md:text-[16px] font-normal transition-all ${
                activeTab === 'quiz'
                  ? 'bg-[#1E1E1E] text-white border border-black'
                  : 'text-black hover:bg-gray-50'
              }`}
            >
              Quiz History
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex justify-center mt-[40px] md:mt-[58px] pb-20 px-4 md:px-0">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[1128px]"
        >
          {activeTab === 'module' ? (
            <div className="space-y-6">
              {moduleProgressData.map(module => (
                <div
                  key={module.id}
                  className="bg-white border border-[#BDBDBD] rounded-[20px] shadow-[0px_4px_60px_0px_rgba(0,0,0,0.1)] p-4 md:p-6"
                >
                  <div className="flex flex-col gap-[20px] md:gap-[25px]">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-[467px]">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-[19px] w-full lg:w-auto">
                        <div className="w-full md:w-[212px] h-[80px] md:h-[98px] bg-[#EEEEEE] border-b border-[#E4E4E4] rounded-[12px] flex items-center justify-center p-4 md:p-6">
                          <div className="text-center">
                            <div className="text-[18px] md:text-[20px] font-bold text-black mb-1">
                              {module.title}
                            </div>
                            <div className="text-[12px] md:text-[14px] text-black">
                              {module.description}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="text-[18px] md:text-[20px] font-bold text-black">
                            {module.title}
                          </div>
                          <div className="text-[12px] md:text-[14px] text-black">
                            {module.description}
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#EEEEEE] rounded-lg px-2 py-1 self-start lg:self-center">
                        <span className="text-[12px] md:text-[14px] font-semibold text-black">
                          {module.status === 'completed'
                            ? 'Completed'
                            : module.status === 'in-progress'
                              ? 'In Progress'
                              : 'Not Started'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full">
                      <div className="w-full h-3 md:h-4 bg-[#D9D9D9] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#333333] rounded-full transition-all duration-300"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#BDBDBD] rounded-[20px] shadow-[0px_4px_60px_0px_rgba(0,0,0,0.1)] p-4 md:p-9 overflow-x-auto">
              <div className="min-w-[800px] flex gap-[-8px]">
                {/* Topic Column */}
                <div className="w-[300px] md:w-[484px]">
                  <div className="border-b border-black p-3 md:p-6">
                    <h3 className="text-[14px] md:text-[16px] font-semibold text-black">Topic</h3>
                  </div>
                  {quizHistoryData.map(quiz => (
                    <div
                      key={quiz.id}
                      className="border-b border-[#CCCCCC] p-3 md:p-6 h-[48px] md:h-[56px] flex items-center"
                    >
                      <span className="text-[14px] md:text-[16px] text-black truncate">
                        {quiz.topic}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Module Column */}
                <div className="w-[100px] md:w-[124px]">
                  <div className="border-b border-black p-3 md:p-6 text-center">
                    <h3 className="text-[14px] md:text-[16px] font-semibold text-black">Module</h3>
                  </div>
                  {quizHistoryData.map(quiz => (
                    <div
                      key={quiz.id}
                      className="border-b border-[#CCCCCC] p-3 md:p-6 h-[48px] md:h-[56px] flex items-center justify-center"
                    >
                      <div className="bg-[#EEEEEE] border border-[#BDBDBD] rounded px-2 py-1">
                        <span className="text-[12px] md:text-[14px] font-semibold text-black">
                          {quiz.module}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Difficulty Column */}
                <div className="w-[100px] md:w-[137px]">
                  <div className="border-b border-black p-3 md:p-6 text-center">
                    <h3 className="text-[14px] md:text-[16px] font-semibold text-black">
                      Difficulty
                    </h3>
                  </div>
                  {quizHistoryData.map(quiz => (
                    <div
                      key={quiz.id}
                      className="border-b border-[#CCCCCC] p-3 md:p-6 h-[48px] md:h-[56px] flex items-center justify-center"
                    >
                      <div
                        className={`rounded px-2 py-1 ${
                          quiz.difficulty === 'Beginner'
                            ? 'bg-[#EEEEEE] border border-[#BDBDBD]'
                            : 'bg-[#FFE9C2] border border-[#E6C700]'
                        }`}
                      >
                        <span className="text-[12px] md:text-[14px] font-semibold text-black">
                          {quiz.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Score Column */}
                <div className="w-[80px] md:w-[100px]">
                  <div className="border-b border-black p-3 md:p-6 text-center">
                    <h3 className="text-[14px] md:text-[16px] font-semibold text-black">Score</h3>
                  </div>
                  {quizHistoryData.map(quiz => (
                    <div
                      key={quiz.id}
                      className="border-b border-[#CCCCCC] p-3 md:p-6 h-[48px] md:h-[56px] flex items-center justify-center"
                    >
                      <span className="text-[14px] md:text-[16px] text-black">{quiz.score}</span>
                    </div>
                  ))}
                </div>

                {/* Status Column */}
                <div className="w-[100px] md:w-[118px]">
                  <div className="border-b border-black p-3 md:p-6 text-center">
                    <h3 className="text-[14px] md:text-[16px] font-semibold text-black">Status</h3>
                  </div>
                  {quizHistoryData.map(quiz => (
                    <div
                      key={quiz.id}
                      className="border-b border-[#CCCCCC] p-3 md:p-6 h-[48px] md:h-[56px] flex items-center justify-center"
                    >
                      <div className="flex items-center gap-1">
                        {quiz.status === 'complete' ? (
                          <>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 20 20"
                              fill="none"
                              className="md:w-5 md:h-5"
                            >
                              <path
                                d="M10 1.67C5.4 1.67 1.67 5.4 1.67 10C1.67 14.6 5.4 18.33 10 18.33C14.6 18.33 18.33 14.6 18.33 10C18.33 5.4 14.6 1.67 10 1.67ZM8.33 14.17L4.17 10L5.34 8.83L8.33 11.82L14.66 5.49L15.83 6.66L8.33 14.17Z"
                                fill="#00A336"
                              />
                            </svg>
                            <span className="text-[12px] md:text-[14px] text-[#00A336] hidden md:inline">
                              Complete
                            </span>
                          </>
                        ) : (
                          <>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 20 20"
                              fill="none"
                              className="md:w-5 md:h-5"
                            >
                              <circle
                                cx="10"
                                cy="10"
                                r="8.33"
                                stroke="#D9D9D9"
                                strokeWidth="1.67"
                                fill="none"
                              />
                            </svg>
                            <span className="text-[12px] md:text-[14px] text-[#D9D9D9] hidden md:inline">
                              Pending
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Column */}
                <div className="w-[100px] md:w-[134px]">
                  <div className="border-b border-black p-3 md:p-6 text-center">
                    <h3 className="text-[14px] md:text-[16px] font-semibold text-black">Action</h3>
                  </div>
                  {quizHistoryData.map(quiz => (
                    <div
                      key={quiz.id}
                      className="border-b border-[#CCCCCC] p-3 md:p-6 h-[48px] md:h-[56px] flex items-center justify-center"
                    >
                      <button
                        onClick={() => handleQuizAction(quiz.action, quiz.id)}
                        className="bg-[#1E1E1E] text-white rounded px-2 py-1 flex items-center gap-1 hover:bg-gray-800 transition-colors"
                      >
                        {quiz.action === 'retake' ? (
                          <>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 20 20"
                              fill="none"
                              className="md:w-5 md:h-5"
                            >
                              <path
                                d="M14.17 2.5L12.92 3.75L15.42 6.25H10C6.55 6.25 3.75 9.05 3.75 12.5C3.75 15.95 6.55 18.75 10 18.75C13.45 18.75 16.25 15.95 16.25 12.5H14.58C14.58 15.03 12.53 17.08 10 17.08C7.47 17.08 5.42 15.03 5.42 12.5C5.42 9.97 7.47 7.92 10 7.92H15.42L12.92 10.42L14.17 11.67L18.33 7.5L14.17 2.5Z"
                                fill="white"
                              />
                            </svg>
                            <span className="text-[12px] md:text-[14px] hidden md:inline">
                              Retake
                            </span>
                          </>
                        ) : (
                          <>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 20 20"
                              fill="none"
                              className="md:w-5 md:h-5"
                            >
                              <path d="M6.67 4.17V15.83L15.83 10L6.67 4.17Z" fill="white" />
                            </svg>
                            <span className="text-[12px] md:text-[14px] hidden md:inline">
                              Start
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyPage;
