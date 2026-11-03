import React from 'react';
import { ImpactLevel, EffortLevel, TaskStatus, EntityStatus } from '@/types';

interface BadgeProps {
  type: 'impact' | 'effort' | 'status' | 'principle';
  value: ImpactLevel | EffortLevel | TaskStatus | EntityStatus | string;
}

const Badge: React.FC<BadgeProps> = ({ type, value }) => {
  let styles = 'border-[#e3e8e5] bg-[#f3f5f3] text-[#5e6c70]';
  if (type === 'principle') styles = 'border-[#dce5e8] bg-[#edf3f4] text-[#31576a]';
  if (type === 'impact') {
    styles = value === 'High' ? 'border-[#ead8d4] bg-[#f8efed] text-[#96584f]' : value === 'Medium' ? 'border-[#eadfc9] bg-[#f8f3e9] text-[#92703a]' : 'border-[#e3e8e5] bg-[#f3f5f3] text-[#687579]';
  }
  if (type === 'effort') {
    styles = value === 'Large' ? 'border-[#e2dbea] bg-[#f3eff7] text-[#715b87]' : value === 'Medium' ? 'border-[#dce5e8] bg-[#edf3f4] text-[#426576]' : 'border-[#dce7df] bg-[#eef5f0] text-[#557765]';
  }
  if (type === 'status') {
    styles = ['Done', 'Completed'].includes(value) ? 'border-[#dce7df] bg-[#eef5f0] text-[#557765]' :
      ['In Progress', 'Active'].includes(value) ? 'border-[#dce5e8] bg-[#edf3f4] text-[#426576]' :
      'border-[#e3e8e5] bg-[#f3f5f3] text-[#687579]';
  }
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none ${styles}`}>{value}</span>;
};

export default Badge;
