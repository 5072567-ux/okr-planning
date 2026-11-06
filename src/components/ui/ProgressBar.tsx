import React from 'react';

interface ProgressBarProps {
  current: number;
  target: number;
  unit?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, target, unit = '' }) => {
  const raw = target > 0 ? (current / target) * 100 : 0;
  const percentage = Number.isFinite(raw) ? Math.max(0, Math.min(100, Math.round(raw))) : 0;
  return (
    <div className="w-full">
      <div className="mb-2 flex items-end justify-between gap-3">
        <span className="text-xs text-[#737d83]">{current} / {target} {unit}</span>
        <span className="text-sm font-semibold tabular-nums text-[#263943]">{percentage}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#edf0ed]">
        <div className="h-full rounded-full bg-[#7893a1] transition-all duration-500" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
