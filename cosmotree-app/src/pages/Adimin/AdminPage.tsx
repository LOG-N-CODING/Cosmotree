// src/pages/Adimin/AdminPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { UserList } from '../../components/layout/Admin/UserList';
import { Sidebar } from '../../components/layout/Admin/Sidebar';

export default function AdminPage() {
  const [searchParams] = useSearchParams();
  const defaultSection = (searchParams.get('section') as any) || 'Users';
  const [section, setSection] = useState<'Users' | 'Words' | 'Phrases' | 'Quizzes' | 'AdminTest'>(
    defaultSection
  );

  useEffect(() => {
    const sec = searchParams.get('section') as any;
    if (sec) setSection(sec);
  }, [searchParams]);

  return (
    <div className="flex mt-[120px]">
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-gray-100 lg:shadow">
        <Sidebar onSelect={sec => setSection(sec)} />
      </div>
      {/* 4) 메인 컨텐츠 */}
      <main className="flex-1 bg-white min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-lg mx-auto pt-16">{section === 'Users' && <UserList />}</div>
      </main>
    </div>
  );
}
