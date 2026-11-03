// types.ts

export type TaskStatus = 'Todo' | 'In Progress' | 'Done';
export type ImpactLevel = 'High' | 'Medium' | 'Low';
export type EffortLevel = 'Small' | 'Medium' | 'Large';
export type EntityStatus = 'Active' | 'Completed' | 'Archived';

export interface Principle {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface Objective {
  id: string;
  title: string;
  timeframe: string; // например, "2026 Q1-Q2"
  status: EntityStatus;
  driverFact: string; // Текущее состояние системы
  driverNeed: string; // Желаемое состояние системы
  principleId: string;
}

export interface KeyResult {
  id: string;
  title: string;
  objectiveId: string;
  targetValue: number;
  currentValue: number;
  unit: string; // например, "глав", "часов", "руб."
  startDate: string;
  endDate: string;
  progressPercent: number; // Вычисляется или задается вручную
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  outcomeDescription: string; // Ценность, которую должен принести спринт
  status: EntityStatus;
}

export interface Task {
  id: string;
  title: string;
  sprintId: string;
  keyResultId: string;
  status: TaskStatus;
  impact: ImpactLevel;
  effort: EffortLevel;
  pomodoroEstimate: number;
  pomodoroActual: number;
}

export interface AppState {
  // Данные
  principles: Principle[];
  objectives: Objective[];
  keyResults: KeyResult[];
  sprints: Sprint[];
  tasks: Task[];

  // Действия для задач
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  incrementPomodoro: (id: string) => void;

  // Действия для ключевых результатов (автопересчет прогресса)
  updateKeyResultValue: (id: string, newValue: number) => void;

  // Глобальные действия
  exportData: () => string;
  importData: (jsonString: string) => void;
  resetToMockData: () => void;
}
