import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const variants = {
    primary: 'bg-[#123b53] text-white shadow-sm hover:bg-[#0b2e43] focus:ring-[#7893a1]',
    secondary: 'border border-[#dfe4e1] bg-white text-[#35434a] hover:bg-[#f6f8f6] focus:ring-[#7893a1]',
    danger: 'bg-[#a85c54] text-white hover:bg-[#914b44] focus:ring-[#a85c54]',
    ghost: 'text-[#53636b] hover:bg-[#eef2f1] hover:text-[#202a32] focus:ring-[#7893a1]',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-sm',
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
