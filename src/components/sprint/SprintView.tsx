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
    const done = sprintTasks.filter(t => t.status === 'DONE').length;
    const inProgress = sprintTasks.filter(t => t.status === 'DOING').length;
    const todo = sprintTasks.filter(t => t.status === 'TODO').length;
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
          <ListTodo size={48} className="mx-auto text-[#c5ceca] mb-4" />
          <h3 className="text-lg font-semibold text-[#53636b] mb-2">
            Нет спринтов в системе
          </h3>
          <p className="text-[#849096]">
            Создайте спринт через хранилище данных или импорт JSON
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      {/* Заголовок */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#202a32] flex items-center gap-3">
            <Zap className="text-[#b18b4a]" />
            Спринты
          </h2>
          <p className="text-[#737d83] mt-2 text-sm">
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
              <Zap size={18} className="text-[#b18b4a]" />
              <h3 className="text-lg font-bold text-[#202a32]">{activeSprint.name}</h3>
            </div>
            <div className="flex items-center gap-1.5 mb-3 text-xs text-[#849096]">
              <span>
                {new Date(activeSprint.startDate).toLocaleDateString('ru-RU')} →{' '}
                {new Date(activeSprint.endDate).toLocaleDateString('ru-RU')}
              </span>
            </div>
            <div className="rounded-xl border border-[#e8ece8] bg-[#f8f9f6] p-3.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Target size={13} className="text-[#31576a]" />
                <span className="text-xs font-semibold text-[#53636b] uppercase tracking-wide">
                  Ценность спринта (Outcome)
                </span>
              </div>
              <p className="text-sm text-[#53636b] leading-relaxed">
                {activeSprint.outcomeDescription}
              </p>
            </div>
          </div>

          {/* Статистика спринта */}
          <div className="grid grid-cols-2 gap-2 min-w-[200px]">
            <div className="rounded-xl border border-[#e5e8e4] bg-white p-3 text-center">
              <div className="text-2xl font-bold text-[#31576a]">{stats.completionRate}%</div>
              <div className="text-xs text-[#849096] flex items-center gap-1 justify-center">
                <TrendingUp size={11} /> выполнение
              </div>
            </div>
            <div className="rounded-xl border border-[#e5e8e4] bg-white p-3 text-center">
              <div className="text-2xl font-bold text-[#b18b4a]">🍅 {stats.totalPomodoros}</div>
              <div className="text-xs text-[#849096]">помидоров</div>
            </div>
            <div className="rounded-xl border border-[#e5e8e4] bg-white p-2 text-center">
              <div className="text-sm font-semibold text-[#31576a]">{stats.done}/{stats.total}</div>
              <div className="text-xs text-[#849096]">задач</div>
            </div>
            <div className="rounded-xl border border-[#e5e8e4] bg-white p-2 text-center">
              <div className="text-sm font-semibold text-[#31576a]">{stats.relatedKRs.length}</div>
              <div className="text-xs text-[#849096]">КР в работе</div>
            </div>
          </div>
        </div>

        {/* Связанные Key Results */}
        {stats.relatedKRs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#e5eae6]">
            <div className="text-xs font-semibold text-[#53636b] uppercase tracking-wide mb-2">
              🎯 Ключевые результаты в этом спринте
            </div>
            <div className="space-y-1.5">
              {stats.relatedKRs.map((kr) => (
                <div key={kr.id} className="flex items-center justify-between text-sm rounded-lg border border-[#e5e8e4] bg-white px-3 py-1.5">
                  <span className="text-[#53636b] truncate">{kr.title}</span>
                  <span className="text-xs font-semibold text-[#31576a] ml-2 flex-shrink-0">
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
