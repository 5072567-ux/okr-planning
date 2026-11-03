// components/ui/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  current: number;
  target: number;
  unit?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, target, unit = '' }) => {
  const rawPercentage = target > 0 ? (current / target) * 100 : 0;
  const percentage = Number.isFinite(rawPercentage)
    ? Math.max(0, Math.min(100, Math.round(rawPercentage)))
    : 0;

  let colorClass = 'bg-red-500';
  if (percentage >= 70) colorClass = 'bg-emerald-500';
  else if (percentage >= 40) colorClass = 'bg-amber-500';

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <span className="text-sm font-medium text-gray-700">
          {current} / {target} {unit}
        </span>
        <span className="text-sm font-bold text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
