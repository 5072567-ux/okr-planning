// components/sprint/KanbanBoard.tsx
'use client';
import React from 'react';
import KanbanColumn from './KanbanColumn';
import { useAppStore } from '@/store';
import { TaskStatus } from '@/types';

interface KanbanBoardProps {
  sprintId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ sprintId }) => {
  const tasks = useAppStore((s) => s.tasks).filter(t => t.sprintId === sprintId);

  const columns: { status: TaskStatus; title: string; accentColor: string }[] = [
    { status: 'TODO', title: 'К выполнению', accentColor: 'bg-gray-400' },
    { status: 'DOING', title: 'В работе', accentColor: 'bg-blue-500' },
    { status: 'DONE', title: 'Готово', accentColor: 'bg-emerald-500' },
    { status: 'TO DISCUSS', title: 'Обсудить', accentColor: 'bg-amber-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {columns.map((col) => (
        <KanbanColumn
          key={col.status}
          status={col.status}
          title={col.title}
          accentColor={col.accentColor}
          tasks={tasks.filter(t => t.status === col.status)}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
