// components/sprint/TaskForm.tsx
'use client';
import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { Task, ImpactLevel, EffortLevel } from '@/types';
import Button from '@/components/ui/Button';

interface TaskFormProps {
  sprintId: string;
  onSuccess: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ sprintId, onSuccess }) => {
  const addTask = useAppStore((s) => s.addTask);
  const keyResults = useAppStore((s) => s.keyResults);

  const [title, setTitle] = useState('');
  const [keyResultId, setKeyResultId] = useState('');
  const [impact, setImpact] = useState<ImpactLevel>('Medium');
  const [effort, setEffort] = useState<EffortLevel>('Medium');
  const [pomodoroEstimate, setPomodoroEstimate] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !keyResultId) return;

    const newTask: Omit<Task, 'id'> = {
      title,
      sprintId,
      keyResultId,
      status: 'Todo',
      impact,
      effort,
      pomodoroEstimate,
      pomodoroActual: 0,
    };

    addTask(newTask);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#53636b] mb-1">
          Название задачи *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="field-control"
          placeholder="Конкретное операционное действие..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#53636b] mb-1">
          🎯 Связь с Ключевым результатом *
        </label>
        <select
          value={keyResultId}
          onChange={(e) => setKeyResultId(e.target.value)}
          className="field-control bg-white"
          required
        >
          <option value="">Выберите ключевой результат...</option>
          {keyResults.map((kr) => (
            <option key={kr.id} value={kr.id}>
              {kr.title} ({kr.currentValue}/{kr.targetValue} {kr.unit})
            </option>
          ))}
        </select>
        <p className="text-xs text-[#849096] mt-1">
          Каждая задача должна закрывать конкретный измеримый результат
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-[#53636b] mb-1">
            💥 Влияние на OKR
          </label>
          <select
            value={impact}
            onChange={(e) => setImpact(e.target.value as ImpactLevel)}
            className="field-control bg-white"
          >
            <option value="High">Высокое</option>
            <option value="Medium">Среднее</option>
            <option value="Low">Низкое</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#53636b] mb-1">
            🧠 Усилия
          </label>
          <select
            value={effort}
            onChange={(e) => setEffort(e.target.value as EffortLevel)}
            className="field-control bg-white"
          >
            <option value="Small">Малые</option>
            <option value="Medium">Средние</option>
            <option value="Large">Большие</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#53636b] mb-1">
          🍅 Оценка в помидорах (25 мин)
        </label>
        <input
          type="number"
          min={1}
          max={20}
          value={pomodoroEstimate}
          onChange={(e) => setPomodoroEstimate(Number(e.target.value))}
          className="field-control"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onSuccess}>
          Отмена
        </Button>
        <Button type="submit">Добавить задачу</Button>
      </div>
    </form>
  );
};

export default TaskForm;
