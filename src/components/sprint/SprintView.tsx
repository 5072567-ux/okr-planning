// components/sprint/SprintView.tsx
'use client';
import React, { useState, useMemo } from 'react';
import { ListTodo, Target, Zap, TrendingUp, Plus } from 'lucide-react';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import SprintSelector from './SprintSelector';
import KanbanBoard from './KanbanBoard';
import TaskForm from './TaskForm';
import { useAppStore } from '@/store';

const SprintView: React.FC = () => {
  const sprints = useAppStore((s) => s.sprints);
  const tasks = useAppStore((s) => s.tasks);
  const keyResults = useAppStore((s) => s.keyResults);

  const [activeSprintId, setActiveSprintId] = useState<string>(
    sprints.find(s => s.status === 'Active')?.id || sprints[0]?.id || ''
  );
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const activeSprint = sprints.find(s => s.id === activeSprintId);
  const sprintTasks = useMemo(
    () => tasks.filter(t => t.sprintId === activeSprintId),
    [tasks, activeSprintId]
  );

  // Статистика спринта
  const stats = useMemo(() => {
    const total = sprintTasks.length;
    const done = sprintTasks.filter(t => t.status === 'Done').length;
    const inProgress = sprintTasks.filter(t => t.status === 'In Progress').length;
    const todo = sprintTasks.filter(t => t.status === 'Todo').length;
    const totalPomodoros = sprintTasks.reduce((sum, t) => sum + t.pomodoroActual, 0);
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

    // Связанные Key Results
    const relatedKRIds = Array.from(new Set(sprintTasks.map(t => t.keyResultId)));
    const relatedKRs = keyResults.filter(kr => relatedKRIds.includes(kr.id));

    return { total, done, inProgress, todo, totalPomodoros, completionRate, relatedKRs };
  }, [sprintTasks, keyResults]);

  if (!activeSprint) {
    return (
      <Card>
        <div className="text-center py-12">
          <ListTodo size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Нет спринтов в системе
          </h3>
          <p className="text-gray-500">
            Создайте спринт через хранилище данных или импорт JSON
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Заголовок */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="text-amber-500" />
            Спринты
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Операционная работа: задачи, помидоры, связь с ключевыми результатами
          </p>
        </div>
        <Button onClick={() => setIsTaskModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          Новая задача
        </Button>
      </div>

      {/* Переключатель спринтов */}
      <SprintSelector activeSprintId={activeSprintId} onSelect={setActiveSprintId} />

      {/* Карточка активного спринта */}
      <Card variant="highlight">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[250px]">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} className="text-amber-500" />
              <h3 className="text-lg font-bold text-gray-900">{activeSprint.name}</h3>
            </div>
            <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-500">
              <span>
                {new Date(activeSprint.startDate).toLocaleDateString('ru-RU')} →{' '}
                {new Date(activeSprint.endDate).toLocaleDateString('ru-RU')}
              </span>
            </div>
            <div className="bg-white/70 rounded-lg p-3 border border-indigo-100">
              <div className="flex items-center gap-1.5 mb-1">
                <Target size={13} className="text-indigo-600" />
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Ценность спринта (Outcome)
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {activeSprint.outcomeDescription}
              </p>
            </div>
          </div>

          {/* Статистика спринта */}
          <div className="grid grid-cols-2 gap-2 min-w-[200px]">
            <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.completionRate}%</div>
              <div className="text-xs text-gray-500 flex items-center gap-1 justify-center">
                <TrendingUp size={11} /> выполнение
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-rose-600">🍅 {stats.totalPomodoros}</div>
              <div className="text-xs text-gray-500">помидоров</div>
            </div>
            <div className="bg-white rounded-lg p-2 border border-gray-200 text-center">
              <div className="text-sm font-semibold text-gray-900">{stats.done}/{stats.total}</div>
              <div className="text-xs text-gray-500">задач</div>
            </div>
            <div className="bg-white rounded-lg p-2 border border-gray-200 text-center">
              <div className="text-sm font-semibold text-gray-900">{stats.relatedKRs.length}</div>
              <div className="text-xs text-gray-500">КР в работе</div>
            </div>
          </div>
        </div>

        {/* Связанные Key Results */}
        {stats.relatedKRs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-indigo-100">
            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              🎯 Ключевые результаты в этом спринте
            </div>
            <div className="space-y-1.5">
              {stats.relatedKRs.map((kr) => (
                <div key={kr.id} className="flex items-center justify-between text-sm bg-white rounded-md px-3 py-1.5 border border-gray-200">
                  <span className="text-gray-700 truncate">{kr.title}</span>
                  <span className="text-xs font-semibold text-indigo-600 ml-2 flex-shrink-0">
                    {kr.currentValue}/{kr.targetValue} {kr.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Kanban-доска */}
      <KanbanBoard sprintId={activeSprintId} />

      {/* Модальное окно добавления задачи */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Новая задача (Лист)"
      >
        <TaskForm
          sprintId={activeSprintId}
          onSuccess={() => setIsTaskModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default SprintView;
