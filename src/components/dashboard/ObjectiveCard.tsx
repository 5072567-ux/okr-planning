// components/dashboard/ObjectiveCard.tsx
'use client';
import React, { useState, useMemo } from 'react';
import { Target, ChevronDown, ChevronRight, Lightbulb, TrendingUp, Plus } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import KeyResultItem from './KeyResultItem';
import { useAppStore } from '@/store';
import { Objective } from '@/types';

interface ObjectiveCardProps {
  objective: Objective;
  onAddKeyResult: (objectiveId: string) => void;
}

const ObjectiveCard: React.FC<ObjectiveCardProps> = ({ objective, onAddKeyResult }) => {
  const keyResults = useAppStore((s) => s.keyResults).filter(kr => kr.objectiveId === objective.id);
  const [isExpanded, setIsExpanded] = useState(false);

  const aggregatedProgress = useMemo(() => {
    if (keyResults.length === 0) return 0;
    const sum = keyResults.reduce((acc, kr) => acc + kr.progressPercent, 0);
    return Math.round(sum / keyResults.length);
  }, [keyResults]);

  const statusColor = aggregatedProgress >= 70 ? 'text-emerald-600' 
    : aggregatedProgress >= 40 ? 'text-[#a77b37]' : 'text-[#a85c54]';

  return (
    <div className="rounded-xl border border-[#e7ebe7] bg-white p-4 sm:p-5 shadow-[0_1px_5px_rgba(25,45,54,.025)]">
      {/* Заголовок цели */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-1 text-[#849096] hover:text-[#31576a] transition-colors"
        >
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
        
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-start gap-2 flex-1">
              <Target size={18} className="text-[#31576a] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-[#202a32] leading-snug">{objective.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-[#849096]">{objective.timeframe}</span>
                  <Badge type="status" value={objective.status} />
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className={`text-2xl font-bold ${statusColor}`}>{aggregatedProgress}%</div>
              <div className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                <TrendingUp size={12} /> общий прогресс
              </div>
            </div>
          </div>

          {/* Драйвер: Факт + Потребность */}
          <div className="rounded-xl border border-[#e8ece8] bg-[#f8f9f6] p-3.5 mb-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Lightbulb size={13} className="text-amber-500" />
                  <span className="text-xs font-semibold text-[#53636b] uppercase tracking-wide">Факт</span>
                </div>
                <p className="text-xs text-[#5f6d73] leading-relaxed">{objective.driverFact}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp size={13} className="text-[#527b68]" />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Потребность</span>
                </div>
                <p className="text-xs text-[#5f6d73] leading-relaxed">{objective.driverNeed}</p>
              </div>
            </div>
          </div>

          {/* Агрегированный прогресс-бар цели */}
          <ProgressBar current={aggregatedProgress} target={100} unit="%" />
        </div>
      </div>

      {/* Раскрытые Key Results */}
      {isExpanded && (
        <div className="mt-4 ml-7 space-y-2 border-l border-[#e6ebe7] pl-4">
          <button
            onClick={() => onAddKeyResult(objective.id)}
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-[#123b53]"
          >
            <Plus size={14} /> Добавить ключевой результат
          </button>
          {keyResults.length === 0 ? (
            <p className="text-sm text-gray-400 italic py-2">Нет ключевых результатов. Добавьте первый.</p>
          ) : (
            keyResults.map(kr => <KeyResultItem key={kr.id} keyResult={kr} />)
          )}
        </div>
      )}
    </div>
  );
};

export default ObjectiveCard;
