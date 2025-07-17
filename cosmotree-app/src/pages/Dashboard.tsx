import { motion } from 'framer-motion';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-white">

      <div className="p-4 md:p-6 lg:p-10 space-y-6 md:space-y-8">
        {/* Top Section - Learning Progress and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Learning Progress Summary */}
          <motion.div 
            className="lg:col-span-2 bg-gray-100 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-lg"
            style={{
              backgroundImage: `url('/images/main-sec.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-lg md:text-xl font-semibold text-black mb-6 md:mb-8">Learning Progress Summary</h2>
            
            {/* Progress Visualization */}
            <div className="flex gap-3 md:gap-6 lg:gap-9 mb-6 md:mb-8 overflow-x-auto">
              {/* Rocket Icons for completed modules */}
              <div className="bg-white rounded-xl md:rounded-2xl p-2 md:p-4 shadow-sm flex-shrink-0">
                <div className="w-4 h-4 md:w-6 md:h-6 bg-black rounded">🚀</div>
              </div>
              <div className="bg-white rounded-xl md:rounded-2xl p-2 md:p-4 shadow-sm flex-shrink-0">
                <div className="w-6 h-6 bg-black rounded">🚀</div>
              </div>
              {/* Empty progress slots */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl w-16 h-16 shadow-sm"></div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-400 border-dashed my-6"></div>

            {/* Progress Grid */}
            <div className="grid grid-cols-9 gap-8 mb-8">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-7 h-0 border-t border-white"></div>
              ))}
            </div>

            {/* Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Moon Phases Card */}
              <motion.div 
                className="bg-white rounded-3xl p-6 border border-gray-300 flex items-center gap-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-gray-100 rounded-full p-3">
                  <div className="w-8 h-8 text-xl">🪐</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-black text-lg">Moon Phases & Lunar Cycles</h3>
                  <p className="text-black text-base">of 10 total</p>
                </div>
              </motion.div>

              {/* Quiz Completion Card */}
              <motion.div 
                className="bg-white rounded-3xl p-6 border border-gray-300 flex items-center gap-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-gray-100 rounded-full p-3">
                  <div className="w-8 h-8 text-xl">🪐</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-black text-lg">Quizzes Completed</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-black text-base">Stellar Classification</span>
                    <span className="bg-white border border-gray-300 px-2 py-1 rounded text-sm font-semibold text-black">95%</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="bg-black rounded-3xl p-8 shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-xl font-normal text-white mb-8">Quick Actions</h2>
            
            {/* Moon Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 text-4xl">🌙</div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <motion.button 
                className="w-full bg-white border border-black rounded-lg p-4 flex justify-between items-center hover:bg-gray-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-black font-medium">Continue Learning</span>
                <div className="w-10 h-10 border border-black rounded flex items-center justify-center">
                  <span className="text-black">→</span>
                </div>
              </motion.button>

              <motion.button 
                className="w-full bg-white border border-black rounded-lg p-4 flex justify-between items-center hover:bg-gray-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-black font-medium">Take a Quiz</span>
                <div className="w-10 h-10 border border-black rounded flex items-center justify-center">
                  <span className="text-black">→</span>
                </div>
              </motion.button>

              <motion.button 
                className="w-full bg-white border border-black rounded-lg p-4 flex justify-between items-center hover:bg-gray-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-black font-medium">View Achievements</span>
                <div className="w-10 h-10 border border-black rounded flex items-center justify-center">
                  <span className="text-black">→</span>
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
          
          {/* Resource Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Astronomy 101 Card */}
            <motion.div 
              className="bg-blue-100 rounded-3xl p-6 border border-gray-300 shadow-sm"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gray-100 rounded-full p-3 w-fit mb-4">
                <div className="w-8 h-8 text-xl">📚</div>
              </div>
              <h3 className="font-semibold text-black text-lg mb-2">Astronomy 101: Essential terms and ideas</h3>
              <p className="text-black text-base mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <span className="bg-black text-white px-2 py-1 rounded text-sm font-semibold">Guide</span>
            </motion.div>

            {/* Astrobiology Card */}
            <motion.div 
              className="bg-yellow-100 rounded-3xl p-6 border border-gray-300 shadow-sm"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gray-100 rounded-full p-3 w-fit mb-4">
                <div className="w-8 h-8 text-xl">📚</div>
              </div>
              <h3 className="font-semibold text-black text-lg mb-2">Astrobiology: Life in the Universe</h3>
              <p className="text-black text-base mb-4">Explores the potential for life beyond Earth.</p>
              <span className="bg-black text-white px-2 py-1 rounded text-sm font-semibold">Research</span>
            </motion.div>

            {/* Black Holes Card */}
            <motion.div 
              className="bg-white rounded-3xl p-6 border border-gray-300 shadow-sm"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gray-100 rounded-full p-3 w-fit mb-4">
                <div className="w-8 h-8 text-xl">📚</div>
              </div>
              <h3 className="font-semibold text-black text-lg mb-2">Black Holes: Mysteries of the Cosmos</h3>
              <p className="text-black text-base mb-4">Understanding these enigmatic regions of spacetime.</p>
              <span className="bg-black text-white px-2 py-1 rounded text-sm font-semibold">Theory</span>
            </motion.div>

            {/* Big Bang Card */}
            <motion.div 
              className="bg-white rounded-3xl p-6 border border-gray-300 shadow-sm"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gray-100 rounded-full p-3 w-fit mb-4">
                <div className="w-8 h-8 text-xl">📚</div>
              </div>
              <h3 className="font-semibold text-black text-lg mb-2">The Big Bang: Origins of the Universe</h3>
              <p className="text-black text-base mb-4">Examining the birth and expansion of everything we know.</p>
              <span className="bg-black text-white px-2 py-1 rounded text-sm font-semibold">Concept</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
