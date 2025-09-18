// src/components/admin/SeedList.tsx
import React, { useState } from 'react';
import { deleteAllModules, seedAllModules } from './utils/astronomySeed';
import { clearAllQuizzes, seedAllQuizzes } from './utils/astronomyQuizSeed';
import { AdminGuideCard } from './AdminGuideCard';
import { useAuth } from '../../../context/AuthContext';

export const SeedList = () => {
  const { isAdmin } = useAuth();
  const [log, setLog] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<{
    modulesAdded: number;
    modulesSkipped: number;
    lessonsAdded: number;
    lessonsUpdated: number;
    modulesQuizUpdated?: number;
    questionsSeeded?: number;
  } | null>(null);

  const appendLog = (msg: string) => setLog(prev => [...prev, msg]);

  const handleSeed = async () => {
    setLog([]);
    setStats(null);
    setIsRunning(true);
    try {
      // 1) 모듈 & 레슨 시드
      const modResult = await seedAllModules({ onLog: appendLog });

      // 2) 퀴즈 시드 (모듈이 있어야 하므로 뒤에)
      const quizResult = await seedAllQuizzes({ onLog: appendLog });

      setStats({
        ...modResult,
        modulesQuizUpdated: quizResult.modulesQuizUpdated,
        questionsSeeded: quizResult.questionsSeeded,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleDelete = async () => {
    // 확인 대화상자 추가
    if (!window.confirm('⚠️ This will permanently delete ALL data including modules, lessons, and quizzes. Are you sure?')) {
      return;
    }

    setLog([]);
    setStats(null);
    setIsRunning(true);
    
    try {
      appendLog('🗑️ Starting delete process...');
      appendLog('⚠️ Checking admin permissions...');
      
      // 전체 모듈 삭제 (quizzes 포함 전체 제거)
      await deleteAllModules(appendLog);
      await clearAllQuizzes(appendLog);
      
      appendLog('✅ All data successfully deleted');
    } catch (error: any) {
      console.error('Delete operation failed:', error);
      
      if (error.code === 'permission-denied') {
        appendLog('❌ Permission denied - Admin access required');
        appendLog('💡 Make sure you are logged in as an admin user');
      } else {
        appendLog(`❌ Delete failed: ${error.message}`);
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-3xl">
      {/* 도움말 카드 */}
      <AdminGuideCard
        icon="database"
        title="Database Seeding Guide"
        description="Initialize your learning platform with comprehensive astronomy content and quiz data."
        tips={[
          "Use 'Seed All' to populate the database with astronomy modules, lessons, and quizzes",
          "Seeding is safe - existing content will be preserved and only new items will be added",
          "Use 'Delete All' only for development - this will remove ALL content permanently",
          "Check the log output to monitor the seeding progress and results",
          "Seeding includes 10+ astronomy modules with detailed lessons and interactive quizzes"
        ]}
      />

      <div className="border rounded-lg bg-white p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Astronomy Seed</h2>

      <div className="flex gap-3">
        <button
          onClick={handleSeed}
          disabled={isRunning}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white disabled:opacity-60 disabled:cursor-not-allowed font-medium flex items-center gap-2 hover:from-green-700 hover:to-emerald-700 transition-all"
        >
          {isRunning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>🌱</span>
              <span>Seed All Data</span>
            </>
          )}
        </button>

        <button
          onClick={handleDelete}
          disabled={isRunning || !isAdmin}
          className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
            !isAdmin 
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-red-600 to-pink-600 text-white disabled:opacity-60 disabled:cursor-not-allowed hover:from-red-700 hover:to-pink-700'
          }`}
          title={!isAdmin ? 'Admin privileges required' : ''}
        >
          {isRunning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>🗑️</span>
              <span>Delete All Data</span>
            </>
          )}
        </button>
      </div>

      {/* 관리자 권한 경고 메시지 */}
      {!isAdmin && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <span className="text-yellow-600 text-xl">⚠️</span>
          <div className="flex-1">
            <h4 className="font-medium text-yellow-800 mb-1">Admin Access Required</h4>
            <p className="text-yellow-700 text-sm">
              The "Delete All Data" function requires administrator privileges. 
              Contact your system administrator if you need to perform this operation.
            </p>
          </div>
        </div>
      )}

      {stats && (
        <div className="text-sm text-gray-700">
          Modules — added: <b>{stats.modulesAdded}</b>, skipped: <b>{stats.modulesSkipped}</b>
          <br />
          Lessons — added: <b>{stats.lessonsAdded}</b>, updated: <b>{stats.lessonsUpdated}</b>
          {typeof stats.modulesQuizUpdated !== 'undefined' && (
            <>
              <br />
              Quizzes — modules updated: <b>{stats.modulesQuizUpdated}</b>, questions seeded:{' '}
              <b>{stats.questionsSeeded}</b>
            </>
          )}
        </div>
      )}

      <div className="border rounded p-3 bg-gray-50 max-h-64 overflow-auto text-sm font-mono">
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      </div>
    </div>
  );
};
