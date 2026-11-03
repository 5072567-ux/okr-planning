// store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { AppState, Principle, Objective, KeyResult, Sprint, Task, KeyResultStatus } from './types';

// Демо-данные. Идентификаторы связаны между собой: Principle -> Objective -> KeyResult -> Task.
const mockPrinciples: Principle[] = [
  {
    id: 'p1',
    name: 'Системная передача знаний',
    category: 'Самореализация',
    description: 'Я структурирую свой опыт и делаю его доступным для масштабирования.',
  },
  {
    id: 'p2',
    name: 'Финансовая устойчивость',
    category: 'Финансы',
    description: 'Доходы системно превышают расходы, формируя финансовую устойчивость.',
  },
];

const mockObjectives: Objective[] = [
  {
    id: 'o1',
    title: 'Подготовить рукопись практического пособия',
    timeframe: '2026 Q1-Q2',
    status: 'Active',
    driverFact: 'Материалы и экспертный опыт пока не собраны в единую рукопись.',
    driverNeed: 'Создать структурированную рукопись, готовую к редактуре.',
    principleId: 'p1',
  },
  {
    id: 'o2',
    title: 'Диверсифицировать источники дохода и сформировать капитал',
    timeframe: '2026 Q1-Q4',
    status: 'Active',
    driverFact: 'Основной доход зависит от одного вида активности — консультаций.',
    driverNeed: 'Создать дополнительный источник дохода через цифровой продукт.',
    principleId: 'p2',
  },
];

const mockKeyResults: KeyResult[] = [
  {
    id: 'kr1',
    title: 'Подготовлено и вычитано черновиков глав',
    objectiveId: 'o1',
    targetValue: 5,
    currentValue: 2,
    unit: 'глав',
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    progressPercent: 40,
    status: 'В работе',
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
    progressPercent: 0,
    status: 'Ожидает',
  },
];

const mockSprints: Sprint[] = [
  {
    id: 's1',
    name: 'Спринт 1: Структура и глава 1',
    startDate: '2026-01-15',
    endDate: '2026-01-28',
    outcomeDescription: 'Утверждённое оглавление и черновик первой главы пособия.',
    status: 'Active',
  },
];

const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Составить детальное оглавление пособия',
    sprintId: 's1',
    keyResultId: 'kr1',
    status: 'DONE',
    impact: 'High',
    effort: 'Medium',
    pomodoroEstimate: 4,
    pomodoroActual: 3,
  },
  {
    id: 't2',
    title: 'Написать черновик введения (2000 слов)',
    sprintId: 's1',
    keyResultId: 'kr1',
    status: 'DOING',
    impact: 'High',
    effort: 'Large',
    pomodoroEstimate: 8,
    pomodoroActual: 2,
  },
  {
    id: 't3',
    title: 'Исследовать 3 платформы для размещения цифрового продукта',
    sprintId: 's1',
    keyResultId: 'kr2',
    status: 'TODO',
    impact: 'Medium',
    effort: 'Small',
    pomodoroEstimate: 2,
    pomodoroActual: 0,
  },
];

type ImportedData = Pick<AppState, 'principles' | 'objectives' | 'keyResults' | 'sprints' | 'tasks'>;

const KEY_RESULT_STATUSES: KeyResultStatus[] = ['В работе', 'Ожидает', 'Завершен'];

function getProgressPercent(currentValue: number, targetValue: number): number {
  if (!Number.isFinite(currentValue) || !Number.isFinite(targetValue) || targetValue <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((currentValue / targetValue) * 100)));
}

function normalizeKeyResult(kr: KeyResult): KeyResult {
  const targetValue = Number(kr.targetValue);
  const currentValue = Number(kr.currentValue);
  if (!Number.isFinite(targetValue) || targetValue <= 0) {
    throw new Error(`У ключевого результата «${kr.title}» целевое значение должно быть больше нуля.`);
  }
  if (!Number.isFinite(currentValue) || currentValue < 0) {
    throw new Error(`У ключевого результата «${kr.title}» текущее значение должно быть неотрицательным числом.`);
  }
  const progressPercent = getProgressPercent(currentValue, targetValue);
  const validStatus = KEY_RESULT_STATUSES.includes(kr.status as KeyResultStatus);
  const status: KeyResultStatus = progressPercent >= 100
    ? 'Завершен'
    : kr.status === 'Завершен' || !validStatus
      ? (progressPercent > 0 ? 'В работе' : 'Ожидает')
      : kr.status as KeyResultStatus;
  return { ...kr, targetValue, currentValue, progressPercent, status };
}


function validateImportedData(value: unknown): ImportedData {
  if (!value || typeof value !== 'object') {
    throw new Error('Файл должен содержать JSON-объект.');
  }

  const data = value as Record<string, unknown>;
  const keys = ['principles', 'objectives', 'keyResults', 'sprints', 'tasks'] as const;

  for (const key of keys) {
    if (!Array.isArray(data[key])) {
      throw new Error(`В файле отсутствует корректный массив "${key}".`);
    }
  }

  const imported = data as unknown as ImportedData;
  const legacyStatusMap: Record<string, Task['status']> = {
    Todo: 'TODO',
    'In Progress': 'DOING',
    Done: 'DONE',
  };
  imported.tasks = imported.tasks.map((task) => ({
    ...task,
    status: legacyStatusMap[String(task.status)] || task.status,
  }));
  imported.keyResults = imported.keyResults.map(normalizeKeyResult);
  const principleIds = new Set(imported.principles.map((item) => item.id));
  const objectiveIds = new Set(imported.objectives.map((item) => item.id));
  const keyResultIds = new Set(imported.keyResults.map((item) => item.id));
  const sprintIds = new Set(imported.sprints.map((item) => item.id));

  if (imported.objectives.some((item) => !principleIds.has(item.principleId))) {
    throw new Error('В данных есть цель без существующего родительского принципа.');
  }
  if (imported.keyResults.some((item) => !objectiveIds.has(item.objectiveId))) {
    throw new Error('В данных есть ключевой результат без существующей цели.');
  }
  if (imported.tasks.some((item) => !sprintIds.has(item.sprintId) || !keyResultIds.has(item.keyResultId))) {
    throw new Error('В данных есть задача с несуществующим спринтом или ключевым результатом.');
  }

  const validTaskStatuses = ['TODO', 'DOING', 'DONE', 'TO DISCUSS'];
  if (imported.tasks.some((item) => !validTaskStatuses.includes(item.status))) {
    throw new Error('В данных есть задача с неизвестным статусом.');
  }

  return imported;
}

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
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      incrementPomodoro: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, pomodoroActual: task.pomodoroActual + 1 } : task
          ),
        })),

      updateKeyResultStatus: (id, status) =>
        set((state) => ({
          keyResults: state.keyResults.map((item) => {
            if (item.id !== id) return item;
            if (status === 'Завершен') {
              return normalizeKeyResult({ ...item, currentValue: item.targetValue, status });
            }
            // Не допускаем противоречия: достигнутая цель не может иметь незавершённый статус.
            if (getProgressPercent(item.currentValue, item.targetValue) >= 100) {
              return normalizeKeyResult(item);
            }
            return { ...item, status };
          }),
        })),

      updateKeyResultValue: (id, newValue) =>
        set((state) => ({
          keyResults: state.keyResults.map((item) => {
            if (item.id !== id || !Number.isFinite(newValue) || newValue < 0) return item;
            const progressPercent = getProgressPercent(newValue, item.targetValue);
            const status: KeyResultStatus = progressPercent >= 100
              ? 'Завершен'
              : item.status === 'Завершен'
                ? 'В работе'
                : item.status || (progressPercent > 0 ? 'В работе' : 'Ожидает');
            return normalizeKeyResult({ ...item, currentValue: newValue, progressPercent, status });
          }),
        })),

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
        const data = validateImportedData(JSON.parse(jsonString));
        set({
          principles: data.principles,
          objectives: data.objectives,
          keyResults: data.keyResults,
          sprints: data.sprints,
          tasks: data.tasks,
        });
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
      name: 'okr-tree-storage',
      version: 2,
      migrate: (persistedState, version) => {
        if (version < 2 && persistedState && typeof persistedState === 'object') {
          const legacy = persistedState as Partial<AppState>;
          const statusMap: Record<string, Task['status']> = {
            Todo: 'TODO',
            'In Progress': 'DOING',
            Done: 'DONE',
          };
          return {
            ...legacy,
            tasks: Array.isArray(legacy.tasks)
              ? legacy.tasks.map((task) => ({
                  ...task,
                  status: statusMap[String(task.status)] || task.status,
                }))
              : [],
            keyResults: Array.isArray(legacy.keyResults)
              ? legacy.keyResults.map(normalizeKeyResult)
              : [],
          };
        }
        return persistedState as AppState;
      },
    }
  )
);
