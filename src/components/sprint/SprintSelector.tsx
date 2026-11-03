// components/sprint/SprintSelector.tsx
'use client';
import React from 'react';
import { Calendar, Zap } from 'lucide-react';
import { useAppStore } from '@/store';
import { Sprint } from '@/types';

interface SprintSelectorProps {
  activeSprintId: string;
  onSelect: (id: string) => void;
}

const SprintSelector: React.FC<SprintSelectorProps> = ({ activeSprintId, onSelect }) => {
  const sprints = useAppStore((s) => s.sprints);

  if (sprints.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        Нет активных спринтов. Создайте первый спринт, чтобы начать операционную работу.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {sprints.map((sprint) => {
        const isActive = sprint.id === activeSprintId;
        return (
          <button
            key={sprint.id}
            onClick={() => onSelect(sprint.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              isActive
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
            }`}
          >
            <Zap size={16} className={isActive ? 'text-amber-300' : 'text-amber-500'} />
            <div className="text-left">
              <div className="text-sm font-semibold">{sprint.name}</div>
              <div className={`text-xs flex items-center gap-1 ${isActive ? 'text-indigo-100' : 'text-gray-500'}`}>
                <Calendar size={11} />
                {new Date(sprint.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                {' → '}
                {new Date(sprint.endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default SprintSelector;
