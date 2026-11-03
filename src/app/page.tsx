// app/page.tsx
'use client';
import React, { useState } from 'react';
import Header, { ViewType } from '@/components/layout/Header';
import Dashboard from '@/components/dashboard/Dashboard';
import SprintView from '@/components/sprint/SprintView';
import Analytics from '@/components/analytics/Analytics';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'sprints':
        return <SprintView />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            OKR Tree System • Методология OKR + Agile/Scrum • 
            Создано для системного планирования целей и операционной работы
          </p>
        </div>
      </footer>
    </div>
  );
}
