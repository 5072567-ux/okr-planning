// components/sprint/KanbanColumn.tsx
'use client';
import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { TaskStatus, Task } from '@/types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  accentColor: string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, title, tasks, accentColor }) => {
  const updateTask = useAppStore((s) => s.updateTask);
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsOver(true);
  };

  const handleDragLeave = () => setIsOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTask(taskId, { status });
    }
  };

  const totalPomodoros = tasks.reduce((sum, t) => sum + t.pomodoroActual, 0);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col rounded-xl border-2 transition-colors min-h-[400px] ${
        isOver ? 'border-[#9aafba] bg-[#eef3f4]' : 'border-[#e5e8e4] bg-[#f4f5f2]'
      }`}
    >
      {/* Заголовок колонки */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e8e4]">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${accentColor}`} />
          <h3 className="font-semibold text-[#35434a] text-sm">{title}</h3>
          <span className="text-xs text-[#849096] bg-white px-2 py-0.5 rounded-full border border-[#e5e8e4]">
            {tasks.length}
          </span>
        </div>
        {totalPomodoros > 0 && (
          <span className="text-xs text-rose-600 font-medium">
            🍅 {totalPomodoros}
          </span>
        )}
      </div>

      {/* Список задач */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-sm text-[#a0aaa7] italic">
            Перетащите задачу сюда
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
