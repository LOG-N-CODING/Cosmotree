// src/components/admin/SeedList.tsx
import React, { useState } from 'react';
import { deleteAllModules, seedAllModules } from './utils/astronomySeed';

export const SeedList = () => {
  const [log, setLog] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<{
    modulesAdded: number;
    modulesSkipped: number;
    lessonsAdded: number;
    lessonsUpdated: number;
  } | null>(null);

  const appendLog = (msg: string) => setLog(prev => [...prev, msg]);

  const handleSeed = async () => {
    setLog([]);
    setStats(null);
    setIsRunning(true);
    try {
      // 🔧 seedAllModules는 { onLog } 객체를 받습니다.
      const result = await seedAllModules({ onLog: appendLog });
      setStats(result);
    } finally {
      setIsRunning(false);
    }
  };

  const handleDelete = async () => {
    setLog([]);
    setIsRunning(true);
    try {
      // deleteAllModules는 콜백 함수 그대로 받도록 작성되어 있음
      await deleteAllModules(appendLog);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 border rounded-lg bg-white space-y-4">
      <h2 className="text-2xl font-semibold">Astronomy Seed</h2>

      <div className="flex gap-3">
        <button
          onClick={handleSeed}
          disabled={isRunning}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded"
        >
          {isRunning ? 'Processing…' : 'Seed All'}
        </button>

        <button
          onClick={handleDelete}
          disabled={isRunning}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded"
        >
          {isRunning ? 'Processing…' : 'Delete All'}
        </button>
      </div>

      {stats && (
        <div className="text-sm text-gray-700">
          Modules — added: <b>{stats.modulesAdded}</b>, skipped: <b>{stats.modulesSkipped}</b>
          <br />
          Lessons — added: <b>{stats.lessonsAdded}</b>, updated: <b>{stats.lessonsUpdated}</b>
        </div>
      )}

      <div className="border rounded p-3 bg-gray-50 max-h-64 overflow-auto text-sm font-mono">
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
};
