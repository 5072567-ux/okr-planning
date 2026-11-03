// components/ui/Badge.tsx
import React from 'react';
import { ImpactLevel, EffortLevel, TaskStatus, EntityStatus } from '@/types';

interface BadgeProps {
  type: 'impact' | 'effort' | 'status' | 'principle';
  value: ImpactLevel | EffortLevel | TaskStatus | EntityStatus | string;
}

const Badge: React.FC<BadgeProps> = ({ type, value }) => {
  const getStyles = () => {
    switch (type) {
      case 'impact':
        switch (value as ImpactLevel) {
          case 'High': return 'bg-rose-100 text-rose-800 border-rose-200';
          case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
          case 'Low': return 'bg-slate-100 text-slate-800 border-slate-200';
        }
      case 'effort':
        switch (value as EffortLevel) {
          case 'Large': return 'bg-purple-100 text-purple-800 border-purple-200';
          case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
          case 'Small': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        }
      case 'status':
        switch (value as TaskStatus | EntityStatus) {
          case 'Done':
          case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
          case 'In Progress':
          case 'Active': return 'bg-blue-100 text-blue-800 border-blue-200';
          case 'Todo':
          case 'Archived': return 'bg-gray-100 text-gray-800 border-gray-200';
        }
      case 'principle':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyles()}`}>
      {value}
    </span>
  );
};

export default Badge;
