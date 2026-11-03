// components/analytics/Analytics.tsx
'use client';
import React, { useMemo } from 'react';
import { BarChart3, Target, TrendingUp, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import Card from '@/components/ui/Card';
import { useAppStore } from '@/store';

const Analytics: React.FC = () => {
  const keyResults = useAppStore((s) => s.keyResults);
  const objectives = useAppStore((s) => s.objectives);
  const sprints = useAppStore((s) => s.sprints);
  const tasks = useAppStore((s) => s.tasks);

  // Данные для графика прогресса КР
  const krProgressData = useMemo(() => {
    return keyResults.map(kr => {
      const objective = objectives.find(o => o.id === kr.objectiveId);
      return {
        name: kr.title.length > 25 ? kr.title.substring(0, 25) + '...' : kr.title,
        progress: kr.progressPercent,
        target: 100,
        objective: objective?.title || 'Без цели',
      };
    });
  }, [keyResults, objectives]);

  // Данные для burndown chart активного спринта
  const burndownData = useMemo(() => {
    const activeSprint = sprints.find(s => s.status === 'Active') || sprints[0];
    if (!activeSprint) return [];

    const sprintTasks = tasks.filter(t => t.sprintId === activeSprint.id);
    const totalTasks = sprintTasks.length;
    const startDate = new Date(activeSprint.startDate);
    const endDate = new Date(activeSprint.endDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (totalDays === 0) return [];

    const idealBurndown = Array.from({ length: totalDays + 1 }, (_, i) => ({
      day: i,
      ideal: Math.round(totalTasks * (1 - i / totalDays)),
      actual: i === 0 ? totalTasks : null,
    }));

    // Подсчет выполненных задач по дням (упрощенно — распределяем равномерно)
    const doneTasks = sprintTasks.filter(t => t.status === 'Done').length;
    const daysPassed = Math.min(
      totalDays,
      Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    );

    return idealBurndown.map((item, index) => {
      if (index <= daysPassed && index > 0) {
        const tasksDoneByDay = Math.round((doneTasks / daysPassed) * index);
        return { ...item, actual: totalTasks - tasksDoneByDay };
      }
      return item;
    });
  }, [sprints, tasks]);

  // Общая статистика
  const stats = useMemo(() => {
    const totalKR = keyResults.length;
    const avgProgress = totalKR > 0 
      ? Math.round(keyResults.reduce((sum, kr) => sum + kr.progressPercent, 0) / totalKR)
      : 0;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    const totalTasks = tasks.length;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { totalKR, avgProgress, completedTasks, totalTasks, taskCompletionRate };
  }, [keyResults, tasks]);

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="text-indigo-600" />
          Аналитика
        </h2>
        <p className="text-gray-500 mt-1">
          Визуализация прогресса и эффективности системы
        </p>
      </div>

      {/* Сводная статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Target size={20} className="text-indigo-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Ключевых результатов</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalKR}</div>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp size={20} className="text-emerald-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Средний прогресс</div>
              <div className="text-2xl font-bold text-gray-900">{stats.avgProgress}%</div>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Zap size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Задач выполнено</div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.completedTasks}/{stats.totalTasks}
              </div>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-lg">
              <BarChart3 size={20} className="text-rose-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Эффективность задач</div>
              <div className="text-2xl font-bold text-gray-900">{stats.taskCompletionRate}%</div>
            </div>
          </div>
        </Card>
      </div>

      {/* График прогресса Ключевых результатов */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target size={20} className="text-indigo-600" />
          Прогресс по Ключевым результатам
        </h3>
        {krProgressData.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Нет ключевых результатов для отображения
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={krProgressData} layout="vertical" margin={{ left: 20, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Прогресс']}
                labelFormatter={(label) => `КР: ${label}`}
              />
              <Bar dataKey="progress" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Burndown Chart */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-emerald-600" />
          Burndown Chart (Активный спринт)
        </h3>
        {burndownData.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Нет активного спринта для отображения
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={burndownData} margin={{ left: 20, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" label={{ value: 'День', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Задач осталось', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="ideal" 
                stroke="#9ca3af" 
                strokeDasharray="5 5"
                name="Идеальный burndown"
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Фактический burndown"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
};

export default Analytics;
