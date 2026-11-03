// components/dashboard/KeyResultItem.tsx
'use client';
import React, { useState } from 'react';
import { Award, Calendar } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';
import { useAppStore } from '@/store';
import { KeyResult } from '@/types';

interface KeyResultItemProps {
  keyResult: KeyResult;
}

const KeyResultItem: React.FC<KeyResultItemProps> = ({ keyResult }) => {
  const updateValue = useAppStore((s) => s.updateKeyResultValue);
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(keyResult.currentValue);

  const handleSave = () => {
    updateValue(keyResult.id, tempValue);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2 flex-1">
          <Award size={18} className="text-indigo-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 leading-snug">{keyResult.title}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(keyResult.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                {' → '}
                {new Date(keyResult.endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => { setTempValue(keyResult.currentValue); setIsEditing(!isEditing); }}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap"
        >
          {isEditing ? 'Отмена' : 'Обновить'}
        </button>
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2 mt-2">
          <input
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(Number(e.target.value))}
            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-xs text-gray-500">из {keyResult.targetValue} {keyResult.unit}</span>
          <button
            onClick={handleSave}
            className="ml-auto px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Сохранить
          </button>
        </div>
      ) : (
        <ProgressBar current={keyResult.currentValue} target={keyResult.targetValue} unit={keyResult.unit} />
      )}
    </div>
  );
};

export default KeyResultItem;
