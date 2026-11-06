import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlight';
}

const Card: React.FC<CardProps> = ({ title, subtitle, children, action, className = '', variant = 'default' }) => (
  <section className={`surface-card p-5 sm:p-6 ${variant === 'highlight' ? 'border-[#d9e2e5] bg-[#fbfcfb]' : ''} ${className}`}>
    {(title || action) && (
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          {title && <h3 className="text-base font-semibold text-[#202a32]">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-[#737d83]">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    )}
    {children}
  </section>
);

export default Card;
