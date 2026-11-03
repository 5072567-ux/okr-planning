// components/dashboard/Dashboard.tsx
'use client';
import React, { useState } from 'react';
import { TreePine, Target, Award, ListTodo, Zap } from 'lucide-react';
import Card from '@/components/ui/Card';
import PrincipleCard from './PrincipleCard';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useAppStore } from '@/store';
import { Principle, Objective, KeyResult, Sprint, Task } from '@/types';

const Dashboard: React.FC = () => {
  const principles = useAppStore((s) => s.principles);
  const objectives = useAppStore((s) => s.objectives);
  const keyResults = useAppStore((s) => s.keyResults);
  const sprints = useAppStore((s) => s.sprints);
  const tasks = useAppStore((s) => s.tasks);

  const [modalType, setModalType] = useState<'principle' | 'objective' | 'keyResult' | null>(null);
  const [parentPrincipleId, setParentPrincipleId] = useState<string>('');

  // Статистика системы
  const stats = {
    totalPrinciples: principles.length,
    totalObjectives: objectives.length,
    totalKeyResults: keyResults.length,
    activeSprints: sprints.filter(s => s.status === 'Active').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'Done').length,
  };

  const handleAddObjective = (principleId: string) => {
    setParentPrincipleId(principleId);
    setModalType('objective');
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и статистика */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <TreePine className="text-indigo-600" />
            Дерево целей
          </h1>
          <p className="text-gray-500 mt-1">
            Иерархическая система планирования: от принципов к задачам
          </p>
        </div>
        <Button onClick={() => setModalType('principle')}>
          <TreePine size={16} className="mr-2" />
          Новый принцип
        </Button>
      </div>

      {/* Сводная статистика */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="!p-3">
          <div className="flex items-center gap-2">
            <TreePine size={18} className="text-indigo-600" />
            <div>
              <div className="text-xs text-gray-500">Принципы</div>
              <div className="text-xl font-bold">{stats.totalPrinciples}</div>
            </div>
          </div>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-indigo-600" />
            <div>
              <div className="text-xs text-gray-500">Цели</div>
              <div className="text-xl font-bold">{stats.totalObjectives}</div>
            </div>
          </div>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-indigo-600" />
            <div>
              <div className="text-xs text-gray-500">КР</div>
              <div className="text-xl font-bold">{stats.totalKeyResults}</div>
            </div>
          </div>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-amber-500" />
            <div>
              <div className="text-xs text-gray-500">Спринты</div>
              <div className="text-xl font-bold">{stats.activeSprints}</div>
            </div>
          </div>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-2">
            <ListTodo size={18} className="text-emerald-600" />
            <div>
              <div className="text-xs text-gray-500">Задачи</div>
              <div className="text-xl font-bold">
                {stats.completedTasks}/{stats.totalTasks}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Дерево принципов */}
      <div className="space-y-4">
        {principles.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <TreePine size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Начните с корней вашей системы
              </h3>
              <p className="text-gray-500 mb-4">
                Принципы — это фундаментальные убеждения, на которых строится всё дерево целей
              </p>
              <Button onClick={() => setModalType('principle')}>
                Создать первый принцип
              </Button>
            </div>
          </Card>
        ) : (
          principles.map(principle => (
            <PrincipleCard
              key={principle.id}
              principle={principle}
              onAddObjective={handleAddObjective}
            />
          ))
        )}
      </div>

      {/* Модальное окно: Новый принцип */}
      <Modal
        isOpen={modalType === 'principle'}
        onClose={() => setModalType(null)}
        title="Новый принцип (Корень)"
      >
        <PrincipleForm onSuccess={() => setModalType(null)} />
      </Modal>

      {/* Модальное окно: Новая цель */}
      <Modal
        isOpen={modalType === 'objective'}
        onClose={() => setModalType(null)}
        title="Новая цель (Ствол)"
      >
        <ObjectiveForm
          principleId={parentPrincipleId}
          onSuccess={() => setModalType(null)}
        />
      </Modal>
    </div>
  );
};

// --- Формы добавления ---
const PrincipleForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const add = useAppStore((s) => s.principles); // для проверки
  const store = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) return;
    
    const newPrinciple: Omit<Principle, 'id'> = {
      name, category, description
    };
    
    // Используем прямое обновление store
    useAppStore.setState((state) => ({
      principles: [...state.principles, { ...newPrinciple, id: crypto.randomUUID() }]
    }));
    
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Название принципа *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Например: Системное развитие"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Категория *</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Например: Самореализация, Здоровье, Финансы"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Фундаментальное убеждение, на котором строится система..."
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onSuccess}>Отмена</Button>
        <Button type="submit">Создать принцип</Button>
      </div>
    </form>
  );
};

const ObjectiveForm: React.FC<{ principleId: string; onSuccess: () => void }> = ({ principleId, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [driverFact, setDriverFact] = useState('');
  const [driverNeed, setDriverNeed] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !driverFact || !driverNeed) return;
    
    const newObjective: Omit<Objective, 'id'> = {
      title,
      timeframe: timeframe || '2026 Q1-Q2',
      status: 'Active',
      driverFact,
      driverNeed,
      principleId
    };
    
    useAppStore.setState((state) => ({
      objectives: [...state.objectives, { ...newObjective, id: crypto.randomUUID() }]
    }));
    
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Название цели *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Амбициозная, качественная цель..."
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Период</label>
        <input
          type="text"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="2026 Q1-Q2"
        />
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <label className="block text-sm font-semibold text-amber-900 mb-1">
          💡 Факт (текущее состояние системы) *
        </label>
        <textarea
          value={driverFact}
          onChange={(e) => setDriverFact(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          placeholder="Что есть сейчас? Какова точка А?"
          required
        />
      </div>
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
        <label className="block text-sm font-semibold text-emerald-900 mb-1">
          🎯 Потребность (желаемое состояние) *
        </label>
        <textarea
          value={driverNeed}
          onChange={(e) => setDriverNeed(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          placeholder="К чему стремимся? Какова точка Б?"
          required
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onSuccess}>Отмена</Button>
        <Button type="submit">Создать цель</Button>
      </div>
    </form>
  );
};

export default Dashboard;
