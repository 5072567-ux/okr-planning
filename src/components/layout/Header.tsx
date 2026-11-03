'use client';
import React, { useState, useRef } from 'react';
import { TreePine, Zap, BarChart3, Download, Upload, RotateCcw, Menu, X } from 'lucide-react';
import { useAppStore } from '@/store';

export type ViewType = 'dashboard' | 'sprints' | 'analytics';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const exportData = useAppStore((s) => s.exportData);
  const importData = useAppStore((s) => s.importData);
  const resetToMockData = useAppStore((s) => s.resetToMockData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleExport = () => {
    const jsonData = exportData();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `okr-tree-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('✅ Данные успешно экспортированы');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        importData(content);
        alert('✅ Данные успешно импортированы');
      } catch (error) {
        alert('❌ Ошибка импорта: неверный формат файла');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    if (confirm('⚠️ Вы уверены? Все текущие данные будут заменены демо-данными.')) {
      resetToMockData();
      alert('✅ Данные сброшены к демо-версии');
    }
  };

  const navItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Дерево целей', icon: <TreePine size={18} /> },
    { id: 'sprints', label: 'Спринты', icon: <Zap size={18} /> },
    { id: 'analytics', label: 'Аналитика', icon: <BarChart3 size={18} /> },
  ];

  return (
    <header className="bg-white/95 border-b border-[#e5e8e4] sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#123b53] rounded-lg">
              <TreePine size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#202a32] leading-tight">OKR Tree</h1>
              <p className="text-xs text-[#849096] leading-tight hidden sm:block">Система целей и спринтов</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-[#eaf0f3] text-[#123b53]'
                    : 'text-[#66747a] hover:bg-[#f4f6f4] hover:text-[#202a32]'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button onClick={handleExport} className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#66747a] hover:bg-[#f2f4f1] rounded-lg">
              <Download size={16} /> Экспорт
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#66747a] hover:bg-[#f2f4f1] rounded-lg">
              <Upload size={16} /> Импорт
            </button>
            <button onClick={handleReset} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md" title="Сброс">
              <RotateCcw size={16} />
            </button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#edf0ed] space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onViewChange(item.id); setIsMenuOpen(false); }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm font-medium ${
                  currentView === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
