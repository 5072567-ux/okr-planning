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

  // Burndown: идеальная траектория и фактический остаток на текущую дату.
  // Исторических снимков статусов в модели нет, поэтому промежуточные фактические точки не выдумываем.
  const burndownData = useMemo(() => {
    const activeSprint = sprints.find((s) => s.status === 'Active') || sprints[0];
    if (!activeSprint) return [];

    const sprintTasks = tasks.filter((task) => task.sprintId === activeSprint.id);
    const totalTasks = sprintTasks.length;
    const startDate = new Date(`${activeSprint.startDate}T00:00:00`);
    const endDate = new Date(`${activeSprint.endDate}T00:00:00`);
    const totalDays = Math.round((endDate.getTime() - startDate.getTime()) / 86400000);

    if (!Number.isFinite(totalDays) || totalDays <= 0) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const elapsedDays = Math.floor((today.getTime() - startDate.getTime()) / 86400000);
    const currentDay = Math.max(0, Math.min(totalDays, elapsedDays));
    const remainingTasks = sprintTasks.filter((task) => task.status !== 'DONE').length;

    return Array.from({ length: totalDays + 1 }, (_, day) => ({
      day,
      ideal: Math.round(totalTasks * (1 - day / totalDays)),
      actual: day === currentDay ? remainingTasks : null,
    }));
  }, [sprints, tasks]);

  // Общая статистика
  const stats = useMemo(() => {
    const totalKR = keyResults.length;
    const avgProgress = totalKR > 0 
      ? Math.round(keyResults.reduce((sum, kr) => sum + kr.progressPercent, 0) / totalKR)
      : 0;
    const completedTasks = tasks.filter(t => t.status === 'DONE').length;
    const totalTasks = tasks.length;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { totalKR, avgProgress, completedTasks, totalTasks, taskCompletionRate };
  }, [keyResults, tasks]);

  return (
    <div className="space-y-8 animate-in">
      {/* Заголовок */}
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-[#202a32] flex items-center gap-3">
          <span className="inline-flex rounded-2xl bg-[#eaf0f3] p-2.5"><BarChart3 className="text-[#31576a]" size={23} /></span>
          Аналитика
        </h2>
        <p className="text-sm text-[#737d83] mt-2">
          Визуализация прогресса и эффективности системы
        </p>
      </div>

      {/* Сводная статистика */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <Card className="!p-4 sm:!p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#eaf0f3] rounded-xl">
              <Target size={20} className="text-[#31576a]" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-[#849096]">Ключевых результатов</div>
              <div className="text-2xl font-semibold tracking-tight text-[#263943]">{stats.totalKR}</div>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#eef5f0] rounded-xl">
              <TrendingUp size={20} className="text-[#527b68]" />
            </div>
            <div>
              <div className="text-xs text-[#849096]">Средний прогресс</div>
              <div className="text-2xl font-bold text-[#202a32]">{stats.avgProgress}%</div>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#f8f3e9] rounded-xl">
              <Zap size={20} className="text-[#a77b37]" />
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
            <div className="p-2.5 bg-[#f8efed] rounded-xl">
              <BarChart3 size={20} className="text-[#a85c54]" />
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
        <h3 className="text-base font-semibold text-[#202a32] mb-4 flex items-center gap-2">
          <Target size={20} className="text-indigo-600" />
          Прогресс по Ключевым результатам
        </h3>
        {krProgressData.length === 0 ? (
          <div className="text-center py-14 text-[#849096]">
            Нет ключевых результатов для отображения
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={krProgressData} layout="vertical" margin={{ left: 20, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e8e4" />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Прогресс']}
                labelFormatter={(label) => `КР: ${label}`}
              />
              <Bar dataKey="progress" fill="#7893a1" radius={[0, 4, 4, 0]} />
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
                stroke="#b7c0bd" 
                strokeDasharray="5 5"
                name="Идеальный burndown"
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#527b68" 
                strokeWidth={2}
                name="Фактический burndown"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
};

export default Analytics;
