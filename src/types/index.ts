// Task types
export enum TaskPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Urgent = 'urgent'
}

export enum TaskCategory {
  Personal = 'personal',
  Work = 'work',
  Study = 'study',
  Health = 'health',
  Finance = 'finance',
  Other = 'other'
}

export enum TaskStatus {
  Pending = 'pending',
  Completed = 'completed',
  InProgress = 'in-progress',
  Cancelled = 'cancelled'
}

export enum RecurrenceType {
  None = 'none',
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Custom = 'custom'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
  isRecurring: boolean;
  recurrenceType: RecurrenceType;
  recurrenceInterval?: number;
  streak: number;
  lastCompletedDate?: Date;
  tags?: string[];
}

// User types
export interface UserPreferences {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  reminderTime: number; // Minutes before due time
  defaultTaskView: 'list' | 'calendar';
  defaultTaskCategory: TaskCategory;
  defaultTaskPriority: TaskPriority;
  streakTrackingEnabled: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
}

// Calendar types
export interface CalendarDay {
  date: Date;
  tasks: Task[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

export interface CalendarWeek {
  weekNumber: number;
  days: CalendarDay[];
}

export interface CalendarMonth {
  month: number;
  year: number;
  weeks: CalendarWeek[];
}

// Statistics types
export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byCategory: Record<TaskCategory, number>;
  byPriority: Record<TaskPriority, number>;
  completionRate: number;
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalDaysCompleted: number;
  streakHistory: { date: Date; completed: boolean }[];
}