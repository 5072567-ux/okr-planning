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
      <div className="bg-[#f8f4eb] border border-[#eee4d1] rounded-xl p-4 text-sm text-[#80663a]">
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
                ? 'bg-[#123b53] text-white border-[#123b53] shadow-sm'
                : 'bg-white text-[#53636b] border-[#e5e8e4] hover:border-[#b7c8ce] hover:bg-[#f5f8f7]'
            }`}
          >
            <Zap size={16} className={isActive ? 'text-[#e4cfaa]' : 'text-[#b18b4a]'} />
            <div className="text-left">
              <div className="text-sm font-semibold">{sprint.name}</div>
              <div className={`text-xs flex items-center gap-1 ${isActive ? 'text-[#dce7eb]' : 'text-[#849096]'}`}>
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
