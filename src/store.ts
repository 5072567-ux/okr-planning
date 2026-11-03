// store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid'; // Убедитесь, что установлен uuid: npm i uuid
import { AppState, Task, KeyResult, EntityStatus } from './types';

// --- МОКОВЫЕ ДАННЫЕ (Абстрактные, профессионально релевантные) ---
const mockPrinciples = [
  {
    id: 'p1',
    name: 'Системная передача знаний',
    category: 'Самореализация',
    description: 'Я структурирую свой опыт и делаю его доступным для масштабирования.'
  },
  {
    id: 'p2',
    name: 'Финансовая устойчивость',
    category: 'Финансы',
    description: 'Доходы системно превышают расходы, формируя инвестиционный портфель.'
  }
];

const mockObjectives = [
  {
    id: 'o1',
    title: 'Создать и опубликовать фундаментальное методическое пособие',
    timeframe: '2026 Q1-Q2',
    status: 'Active',
    driverFact: 'Накоплен уникальный практический опыт работы с целевой аудиторией, но он фрагментирован.',
    driverNeed: 'Систематизировать знания в единый продукт для повышения экспертности и охвата.',
    principleId: 'p1'
  },
  {
    id: 'o2',
    title: 'Диверсифицировать источники дохода и сформировать капитал',
    timeframe: '2026 Q1-Q4',
    status: 'Active',
    driverFact: 'Основной доход зависит от одного вида активности (консультации).',
    driverNeed: 'Создать пассивный или полупассивный источник дохода через цифровые продукты.',
    principleId: 'p2'
  }
];

const mockKeyResults = [
  {
    id: 'kr1',
    title: 'Написано и вычитано черновиков глав',
    objectiveId: 'o1',
    targetValue: 5,
    currentValue: 2,
    unit: 'глав',
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    progressPercent: 40
  },
  {
    id: 'kr2',
    title: 'Сформирован и запущен пилотный цифровой продукт',
    objectiveId: 'o2',
    targetValue: 1,
    currentValue: 0,
    unit: 'продукт',
    startDate: '2026-02-01',
    endDate: '2026-04-30',
    progressPercent: 0
  }
];

const mockSprints = [
  {
    id: 's1',
    name: 'Спринт 1: Структура и Глава 1',
    startDate: '2026-01-15',
    endDate: '2026-01-28',
    outcomeDescription: 'Утвержденное детальное оглавление и готовый черновик первой главы пособия.',
    status: 'Active'
  }
];

const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Составить детальное оглавление пособия',
    sprintId: 's1',
    keyResultId: 'kr1',
    status: 'Done',
    impact: 'High',
    effort: 'Medium',
    pomodoroEstimate: 4,
    pomodoroActual: 3
  },
  {
    id: 't2',
    title: 'Написать черновик введения (2000 слов)',
    sprintId: 's1',
    keyResultId: 'kr1',
    status: 'In Progress',
    impact: 'High',
    effort: 'Large',
    pomodoroEstimate: 8,
    pomodoroActual: 2
  },
  {
    id: 't3',
    title: 'Исследовать 3 платформы для хостинга цифрового продукта',
    sprintId: 's1',
    keyResultId: 'kr2',
    status: 'Todo',
    impact: 'Medium',
    effort: 'Small',
    pomodoroEstimate: 2,
    pomodoroActual: 0
  }
];

// --- ZUSTAND STORE ---
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      principles: mockPrinciples,
      objectives: mockObjectives,
      keyResults: mockKeyResults,
      sprints: mockSprints,
      tasks: mockTasks,

      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, { ...task, id: uuidv4() }],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      incrementPomodoro: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, pomodoroActual: t.pomodoroActual + 1 } : t
          ),
        })),

      updateKeyResultValue: (id, newValue) =>
        set((state) => {
          const kr = state.keyResults.find((k) => k.id === id);
          if (!kr) return state;
          
          const newProgress = Math.min(100, Math.round((newValue / kr.targetValue) * 100));
          
          return {
            keyResults: state.keyResults.map((k) =>
              k.id === id
                ? { ...k, currentValue: newValue, progressPercent: newProgress }
                : k
            ),
          };
        }),

      exportData: () => {
        const state = get();
        return JSON.stringify(
          {
            principles: state.principles,
            objectives: state.objectives,
            keyResults: state.keyResults,
            sprints: state.sprints,
            tasks: state.tasks,
          },
          null,
          2
        );
      },

      importData: (jsonString) => {
        try {
          const data = JSON.parse(jsonString);
          set({
            principles: data.principles || [],
            objectives: data.objectives || [],
            keyResults: data.keyResults || [],
            sprints: data.sprints || [],
            tasks: data.tasks || [],
          });
        } catch (e) {
          console.error('Ошибка импорта данных:', e);
        }
      },

      resetToMockData: () =>
        set({
          principles: mockPrinciples,
          objectives: mockObjectives,
          keyResults: mockKeyResults,
          sprints: mockSprints,
          tasks: mockTasks,
        }),
    }),
    {
      name: 'okr-tree-storage', // Ключ в localStorage
    }
  )
);
