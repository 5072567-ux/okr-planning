// components/ui/Card.tsx
import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlight';
}

const Card: React.FC<CardProps> = ({ title, subtitle, children, action, className = '', variant = 'default' }) => {
  const bgClass = variant === 'highlight' ? 'bg-indigo-50/50 border-indigo-100' : 'bg-white border-gray-200';

  return (
    <div className={`rounded-xl border shadow-sm p-5 ${bgClass} ${className}`}>
      {(title || action) && (
        <div className="flex justify-between items-start mb-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card;
