// components/dashboard/Dashboard.tsx
'use client';
import React, { useState } from 'react';
import { TreePine, Target, Award, ListTodo, Zap } from 'lucide-react';
import Card from '@/components/ui/Card';
import PrincipleCard from './PrincipleCard';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useAppStore } from '@/store';
import { Principle, Objective, KeyResult } from '@/types';

const Dashboard: React.FC = () => {
  const principles = useAppStore((s) => s.principles);
  const objectives = useAppStore((s) => s.objectives);
  const keyResults = useAppStore((s) => s.keyResults);
  const sprints = useAppStore((s) => s.sprints);
  const tasks = useAppStore((s) => s.tasks);

  const [modalType, setModalType] = useState<'principle' | 'objective' | 'keyResult' | null>(null);
  const [parentPrincipleId, setParentPrincipleId] = useState<string>('');
  const [parentObjectiveId, setParentObjectiveId] = useState<string>('');

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

  const handleAddKeyResult = (objectiveId: string) => {
    setParentObjectiveId(objectiveId);
    setModalType('keyResult');
  };

  return (
    <div className="space-y-8 animate-in">
      {/* Заголовок и статистика */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div><p className="eyebrow mb-2">Личная система управления</p><h1 className="text-3xl font-semibold tracking-tight text-[#202a32] flex items-center gap-3">
            <span className="inline-flex rounded-2xl bg-[#eaf0f3] p-2.5"><TreePine className="text-[#31576a]" size={23} /></span>
            Дерево целей
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737d83]">
            Иерархическая система планирования: от принципов к задачам
          </p></div>
        <Button size="lg" onClick={() => setModalType('principle')}>
          <TreePine size={16} className="mr-2" />
          Новый принцип
        </Button>
      </div>

      {/* Сводная статистика */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Card className="!p-4 sm:!p-5">
          <div className="flex items-center gap-2">
            <TreePine size={18} className="text-[#52768a]" />
            <div>
              <div className="text-[11px] font-medium text-[#849096]">Принципы</div>
              <div className="text-2xl font-semibold tracking-tight text-[#263943]">{stats.totalPrinciples}</div>
            </div>
          </div>
        </Card>
        <Card className="!p-4 sm:!p-5">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-[#52768a]" />
            <div>
              <div className="text-[11px] font-medium text-[#849096]">Цели</div>
              <div className="text-2xl font-semibold tracking-tight text-[#263943]">{stats.totalObjectives}</div>
            </div>
          </div>
        </Card>
        <Card className="!p-4 sm:!p-5">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-[#52768a]" />
            <div>
              <div className="text-[11px] font-medium text-[#849096]">КР</div>
              <div className="text-2xl font-semibold tracking-tight text-[#263943]">{stats.totalKeyResults}</div>
            </div>
          </div>
        </Card>
        <Card className="!p-4 sm:!p-5">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-[#b18b4a]" />
            <div>
              <div className="text-[11px] font-medium text-[#849096]">Спринты</div>
              <div className="text-2xl font-semibold tracking-tight text-[#263943]">{stats.activeSprints}</div>
            </div>
          </div>
        </Card>
        <Card className="!p-4 sm:!p-5">
          <div className="flex items-center gap-2">
            <ListTodo size={18} className="text-[#527b68]" />
            <div>
              <div className="text-[11px] font-medium text-[#849096]">Задачи</div>
              <div className="text-2xl font-semibold tracking-tight text-[#263943]">
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
            <div className="text-center py-14">
              <TreePine size={48} className="mx-auto text-[#c5ceca] mb-4" />
              <h3 className="text-lg font-semibold text-[#35434a] mb-2">
                Начните с корней вашей системы
              </h3>
              <p className="text-sm text-[#737d83] mb-5">
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
              onAddKeyResult={handleAddKeyResult}
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

      {/* Модальное окно: Новый ключевой результат */}
      <Modal
        isOpen={modalType === 'keyResult'}
        onClose={() => setModalType(null)}
        title="Новый ключевой результат (Ветвь)"
      >
        <KeyResultForm
          objectiveId={parentObjectiveId}
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
          className="w-full px-3 py-2 border border-[#dfe4e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7893a1]"
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
          className="w-full px-3 py-2 border border-[#dfe4e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7893a1]"
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
          className="w-full px-3 py-2 border border-[#dfe4e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7893a1]"
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
          className="w-full px-3 py-2 border border-[#dfe4e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7893a1]"
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
          className="w-full px-3 py-2 border border-[#dfe4e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7893a1]"
          placeholder="2026 Q1-Q2"
        />
      </div>
      <div className="bg-[#f8f4eb] border border-[#eee4d1] rounded-xl p-3.5">
        <label className="block text-sm font-semibold text-[#80663a] mb-1">
          💡 Факт (текущее состояние системы) *
        </label>
        <textarea
          value={driverFact}
          onChange={(e) => setDriverFact(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-[#e8d9bd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b18b4a] bg-white"
          placeholder="Что есть сейчас? Какова точка А?"
          required
        />
      </div>
      <div className="bg-[#eef5f0] border border-[#dce9df] rounded-xl p-3.5">
        <label className="block text-sm font-semibold text-[#527b68] mb-1">
          🎯 Потребность (желаемое состояние) *
        </label>
        <textarea
          value={driverNeed}
          onChange={(e) => setDriverNeed(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-[#dce9df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#527b68] bg-white"
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


const KeyResultForm: React.FC<{ objectiveId: string; onSuccess: () => void }> = ({ objectiveId, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [targetValue, setTargetValue] = useState(1);
  const [unit, setUnit] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !unit.trim() || targetValue <= 0 || !endDate || endDate < startDate) return;

    const newKeyResult: Omit<KeyResult, 'id'> = {
      title: title.trim(),
      objectiveId,
      targetValue,
      currentValue: 0,
      unit: unit.trim(),
      startDate,
      endDate,
      progressPercent: 0,
    };

    useAppStore.setState((state) => ({
      keyResults: [...state.keyResults, { ...newKeyResult, id: crypto.randomUUID() }],
    }));
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Название результата *</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required
          className="w-full px-3 py-2 border border-[#dfe4e1] rounded-lg"
          placeholder="Измеримое изменение или достигнутый результат" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Целевое значение *</label>
          <input type="number" min={1} value={targetValue}
            onChange={(e) => setTargetValue(Number(e.target.value))} required
            className="w-full px-3 py-2 border border-[#dfe4e1] rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Единица измерения *</label>
          <input value={unit} onChange={(e) => setUnit(e.target.value)} required
            className="w-full px-3 py-2 border border-[#dfe4e1] rounded-lg" placeholder="клиентов, ₽, глав" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Начало *</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required
            className="w-full px-3 py-2 border border-[#dfe4e1] rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Срок *</label>
          <input type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} required
            className="w-full px-3 py-2 border border-[#dfe4e1] rounded-lg" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onSuccess}>Отмена</Button>
        <Button type="submit" disabled={!title.trim() || !unit.trim() || targetValue <= 0 || !endDate || endDate < startDate}>
          Создать результат
        </Button>
      </div>
    </form>
  );
};

export default Dashboard;
