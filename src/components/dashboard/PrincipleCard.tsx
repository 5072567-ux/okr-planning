// components/dashboard/PrincipleCard.tsx
'use client';
import React, { useState, useMemo } from 'react';
import { TreePine, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import ObjectiveCard from './ObjectiveCard';
import { useAppStore } from '@/store';
import { Principle } from '@/types';

interface PrincipleCardProps {
  principle: Principle;
  onAddObjective: (principleId: string) => void;
}

const PrincipleCard: React.FC<PrincipleCardProps> = ({ principle, onAddObjective }) => {
  const objectives = useAppStore((s) => s.objectives).filter(o => o.principleId === principle.id);
  const [isExpanded, setIsExpanded] = useState(true);

  const aggregatedProgress = useMemo(() => {
    if (objectives.length === 0) return 0;
    const store = useAppStore.getState();
    let totalProgress = 0;
    let count = 0;
    
    objectives.forEach(obj => {
      const krs = store.keyResults.filter(kr => kr.objectiveId === obj.id);
      if (krs.length > 0) {
        const objProgress = krs.reduce((acc, kr) => acc + kr.progressPercent, 0) / krs.length;
        totalProgress += objProgress;
        count++;
      }
    });
    
    return count > 0 ? Math.round(totalProgress / count) : 0;
  }, [objectives]);

  return (
    <Card
      variant="highlight"
      action={
        <button
          onClick={() => onAddObjective(principle.id)}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <Plus size={16} /> Цель
        </button>
      }
    >
      {/* Заголовок принципа */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-start gap-3 w-full text-left"
      >
        <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
          <TreePine size={22} className="text-indigo-700" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge type="principle" value={principle.category} />
            <span className="text-xs text-gray-500">{objectives.length} целей</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">{principle.name}</h3>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{principle.description}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-700">{aggregatedProgress}%</div>
            <div className="text-xs text-gray-500">корень</div>
          </div>
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </button>

      {/* Раскрытые цели */}
      {isExpanded && (
        <div className="mt-4 space-y-3 ml-2">
          {objectives.length === 0 ? (
            <p className="text-sm text-gray-400 italic py-4 text-center">
              У этого принципа пока нет целей
            </p>
          ) : (
            objectives.map(obj => <ObjectiveCard key={obj.id} objective={obj} />)
          )}
        </div>
      )}
    </Card>
  );
};

export default PrincipleCard;
