import { motion } from 'framer-motion';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import Icon from '../components/UI/Icon';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 md:p-6 lg:p-10 space-y-6 md:space-y-8">
        {/* Top Section - Learning Progress and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Learning Progress Summary */}
          <motion.div
            className="lg:col-span-2 bg-gray-100 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-lg "
            style={{
              backgroundImage: `url('/images/dashboard-sec.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-lg md:text-xl font-semibold text-white mt-4 mb-6 md:mb-8">
              Learning Progress Summary
            </h2>

            {/* Progress Visualization */}
            <div className="flex items-center gap-0 md:gap-0 lg:gap-0 mb-6 md:mb-8 overflow-x-auto">
              {/* Rocket Icons for completed modules */}
              <div className="bg-white rounded-xl md:rounded-2xl p-2 md:p-4 shadow-sm flex-shrink-0">
              <Icon name="rocket" size={20} className="md:w-6 md:h-6" />
              </div>
              {/* Divider */}
              <div className="w-7 h-0 border-t border-white mx-1 md:mx-2"></div>
              <div className="bg-white rounded-xl md:rounded-2xl p-2 md:p-4 shadow-sm flex-shrink-0">
              <Icon name="rocket" size={24} />
              </div>
              {/* Divider */}
              <div className="w-7 h-0 border-t border-white mx-1 md:mx-2"></div>
              {/* Empty progress slots with dividers */}
              {Array.from({ length: 8 }).map((_, i) => (
              <React.Fragment key={i}>
                <div className="bg-white rounded-2xl w-16 h-16 shadow-sm flex-shrink-0"></div>
                {i < 7 && (
                <div className="w-7 h-0 border-t border-white mx-1 md:mx-2"></div>
                )}
              </React.Fragment>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-400 border-dashed my-6"></div>

            {/* Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Moon Phases Card */}
              <motion.div
                className="bg-white rounded-3xl p-6 border border-gray-300 flex items-center gap-4"
                style={{
                  boxShadow: '0px 4px 60px 0px rgba(0, 0, 0, 0.15)'
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-lg p-2 w-10 h-10 flex items-center justify-center">
                  <Icon name="planet" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-black text-lg">Moon Phases & Lunar Cycles</h3>
                  <p className="text-black text-base">of 10 total</p>
                </div>
              </motion.div>

              {/* Quiz Completion Card */}
              <motion.div
                className="bg-white rounded-3xl p-6 border border-gray-300 flex items-center gap-4"
                style={{
                  boxShadow: '0px 4px 60px 0px rgba(0, 0, 0, 0.15)'
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-lg p-2 w-10 h-10 flex items-center justify-center">
                  <Icon name="book" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-black text-lg">Quizzes Completed</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-black text-base">Stellar Classification</span>
                    <span className="bg-white border border-gray-300 px-2 py-1 rounded text-sm font-semibold text-black">
                      95%
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="bg-black rounded-3xl p-8 shadow-lg "
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className='flex items-center justify-around mb-0'>
              <h2 className="text-xl font-normal text-white mb-8">Quick Actions</h2>

              {/* Moon Icon */}
              <div className="flex justify-center mb-8">
                <Icon name="moonStars" size={64} />
              </div>

            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <motion.button
                className="w-full bg-white p-4 flex justify-between items-center hover:bg-gray-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-black font-medium">Continue Learning</span>
                <div className="w-10 h-10ex items-center justify-center">
                  <Icon name="arrowBack" size={20} className="" />
                </div>
              </motion.button>

              <motion.button
                className="w-full bg-white p-4 flex justify-between items-center hover:bg-gray-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-black font-medium">Take a Quiz</span>
                <div className="w-10 h-10ex items-center justify-center">
                  <Icon name="arrowBack" size={20} className="" />
                </div>
              </motion.button>

              <motion.button
                className="w-full bg-white p-4 flex justify-between items-center hover:bg-gray-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-black font-medium">View Achievements</span>
                <div className="w-10 h-10ex items-center justify-center">
                  <Icon name="arrowBack" size={20} className="" />
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Resource Library Section */}
        <motion.div
          className="rounded-3xl p-8 border border-gray-400"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-black mb-8">Resource Library</h2>

          {/* Resource Cards Slider */}
          <Swiper
            modules={[FreeMode, Mousewheel]}
            spaceBetween={24}
            slidesPerView="auto"
            freeMode={true}
            mousewheel={true}
            grabCursor={true}
            className="resource-swiper"
          >
            {/* Astronomy 101 Card */}
            <SwiperSlide style={{ width: '300px' }}>
              <motion.div
                className="bg-white rounded-3xl p-6 border border-gray-300 shadow-sm flex flex-col h-[180px]"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="rounded-full py-4 ps-2 pe-6 w-fit">
                    <Icon name="book" size={24} />
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-semibold text-black text-base mb-2 line-clamp-1" title="Astronomy 101: Essential terms">
                      Astronomy 101: Essential terms
                    </h3>
                    <p className="text-black text-sm line-clamp-2 mb-2">
                      Basic concepts and terminology
                    </p>
                    <span className="bg-black text-white px-2 py-2 rounded text-xs font-semibold">
                      Guide
                    </span>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>

            {/* Astrobiology Card */}
            <SwiperSlide style={{ width: '300px' }}>
              <motion.div
                className="bg-white rounded-3xl p-6 border border-gray-300 shadow-sm flex flex-col h-[180px]"
                
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="rounded-full py-4 ps-2 pe-6 w-fit">
                    <Icon name="book" size={24} />
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-semibold text-black text-base mb-2 line-clamp-1" title="Astrobiology: Life in Universe">
                      Astrobiology: Life in Universe
                    </h3>
                    <p className="text-black text-sm line-clamp-2 mb-2">
                      Life beyond Earth exploration
                    </p>
                    <span className="bg-black text-white px-2 py-2 rounded text-xs font-semibold">
                      Research
                    </span>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>

            {/* Black Holes Card */}
            <SwiperSlide style={{ width: '300px' }}>
              <motion.div
                className="bg-white rounded-3xl p-6 border border-gray-300 shadow-sm flex flex-col h-[180px]"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="rounded-full py-4 ps-2 pe-6 w-fit">
                    <Icon name="book" size={24} />
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-semibold text-black text-base mb-2 line-clamp-1" title="Black Holes: Cosmic Mysteries">
                      Black Holes: Cosmic Mysteries
                    </h3>
                    <p className="text-black text-sm line-clamp-2 mb-2">
                      Enigmatic spacetime regions
                    </p>
                    <span className="bg-black text-white px-2 py-2 rounded text-xs font-semibold">
                      Theory
                    </span>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>

            {/* Big Bang Card */}
            <SwiperSlide style={{ width: '300px' }}>
              <motion.div
                className="bg-white rounded-3xl p-6 border border-gray-300 shadow-sm flex flex-col h-[180px]"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="rounded-full py-4 ps-2 pe-6 w-fit">
                    <Icon name="book" size={24} />
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-semibold text-black text-base mb-2 line-clamp-1" title="Big Bang: Universe Origins">
                      Big Bang: Universe Origins
                    </h3>
                    <p className="text-black text-sm line-clamp-2 mb-2">
                      Birth and expansion of cosmos
                    </p>
                    <span className="bg-black text-white px-2 py-2 rounded text-xs font-semibold">
                      Concept
                    </span>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>

            {/* Solar System Card */}
            <SwiperSlide style={{ width: '300px' }}>
              <motion.div
                className="bg-white rounded-3xl p-6 border border-gray-300 shadow-sm flex flex-col h-[180px]"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="rounded-full py-4 ps-2 pe-6 w-fit">
                    <Icon name="book" size={24} />
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-semibold text-black text-base mb-2 line-clamp-1" title="Solar System Exploration">
                      Solar System Exploration
                    </h3>
                    <p className="text-black text-sm line-clamp-2 mb-2">
                      Planets, moons, and more
                    </p>
                    <span className="bg-black text-white px-2 py-2 rounded text-xs font-semibold">
                      Discovery
                    </span>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>

            {/* Stellar Evolution Card */}
            <SwiperSlide style={{ width: '300px' }}>
              <motion.div
                className="bg-white rounded-3xl p-6 border border-gray-300 shadow-sm flex flex-col h-[180px]"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="rounded-full py-4 ps-2 pe-6 w-fit">
                    <Icon name="book" size={24} />
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-semibold text-black text-base mb-2 line-clamp-1" title="Stellar Evolution">
                      Stellar Evolution
                    </h3>
                    <p className="text-black text-sm line-clamp-2 mb-2">
                      Life cycle of stars
                    </p>
                    <span className="bg-black text-white px-2 py-2 rounded text-xs font-semibold">
                      Process
                    </span>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          </Swiper>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
