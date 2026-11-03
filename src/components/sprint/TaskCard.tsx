// components/sprint/TaskCard.tsx
'use client';
import React from 'react';
import { GripVertical, Timer, Trash2, Target } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { useAppStore } from '@/store';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const incrementPomodoro = useAppStore((s) => s.incrementPomodoro);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const keyResult = useAppStore((s) => s.keyResults.find(kr => kr.id === task.keyResultId));

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Визуализация помидоров
  const renderPomodoros = () => {
    const actual = task.pomodoroActual;
    const estimate = task.pomodoroEstimate;
    const dots = [];
    for (let i = 0; i < Math.max(actual, estimate); i++) {
      dots.push(
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < actual ? 'bg-rose-500' : 'bg-gray-300'
          }`}
          title={i < actual ? 'Завершенный помидор' : 'Запланированный'}
        />
      );
    }
    return dots;
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="rounded-xl border border-[#e5e8e4] bg-white p-3.5 hover:shadow-sm hover:border-[#b7c8ce] transition-all cursor-grab active:cursor-grabbing group"
    >
      {/* Заголовок с grip-иконкой */}
      <div className="flex items-start gap-2 mb-2">
        <GripVertical size={16} className="text-[#b7c1bd] mt-0.5 flex-shrink-0 group-hover:text-[#66747a]" />
        <p className="text-sm font-medium text-[#202a32] leading-snug flex-1">{task.title}</p>
        <button
          onClick={() => deleteTask(task.id)}
          className="opacity-0 group-hover:opacity-100 text-[#a0aaa7] hover:text-[#a85c54] transition-opacity flex-shrink-0"
          title="Удалить задачу"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Связь с Key Result */}
      {keyResult && (
        <div className="flex items-center gap-1.5 mb-2.5 px-2 py-1.5 bg-[#edf3f4] rounded-lg border border-[#dce5e8]">
          <Target size={12} className="text-[#31576a] flex-shrink-0" />
          <span className="text-xs text-[#31576a] truncate" title={keyResult.title}>
            {keyResult.title}
          </span>
        </div>
      )}

      {/* Бейджи Impact и Effort */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        <Badge type="impact" value={task.impact} />
        <Badge type="effort" value={task.effort} />
      </div>

      {/* Помидоры и кнопка */}
      <div className="flex items-center justify-between pt-2 border-t border-[#edf0ed]">
        <div className="flex items-center gap-2">
          <Timer size={14} className="text-rose-500" />
          <div className="flex items-center gap-1">
            {renderPomodoros()}
          </div>
          <span className="text-xs text-[#849096] ml-1">
            {task.pomodoroActual}/{task.pomodoroEstimate}
          </span>
        </div>
        <button
          onClick={() => incrementPomodoro(task.id)}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
          title="Добавить завершенный помидор"
        >
          +1 🍅
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
