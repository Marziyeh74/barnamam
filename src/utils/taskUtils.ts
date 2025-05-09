import { Task, TaskPriority, TaskCategory, TaskStatus, RecurrenceType } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Create a new task with default values
export const createTask = (taskData: Partial<Task>): Task => {
  return {
    id: uuidv4(),
    title: taskData.title || '',
    description: taskData.description || '',
    createdAt: new Date(),
    dueDate: taskData.dueDate,
    completedAt: undefined,
    priority: taskData.priority || TaskPriority.Medium,
    category: taskData.category || TaskCategory.Personal,
    status: TaskStatus.Pending,
    isRecurring: taskData.isRecurring || false,
    recurrenceType: taskData.recurrenceType || RecurrenceType.None,
    recurrenceInterval: taskData.recurrenceInterval,
    streak: 0,
    lastCompletedDate: undefined,
    tags: taskData.tags || [],
  };
};

// Mark a task as complete and handle streak
export const completeTask = (task: Task): Task => {
  const now = new Date();
  const updatedTask = { ...task };
  
  updatedTask.status = TaskStatus.Completed;
  updatedTask.completedAt = now;
  
  // Handle streak
  if (updatedTask.isRecurring) {
    const lastCompletedDate = updatedTask.lastCompletedDate;
    const isFirstCompletion = !lastCompletedDate;
    const isConsecutiveDay = lastCompletedDate ? 
      isConsecutiveCompletion(lastCompletedDate, now) : 
      false;
    
    if (isFirstCompletion || isConsecutiveDay) {
      updatedTask.streak += 1;
    } else {
      // Streak broken
      updatedTask.streak = 1;
    }
    
    updatedTask.lastCompletedDate = now;
  }
  
  return updatedTask;
};

// Check if a completion is on a consecutive day to maintain streak
const isConsecutiveCompletion = (lastDate: Date, currentDate: Date): boolean => {
  // Reset times to compare just the dates
  const last = new Date(lastDate);
  last.setHours(0, 0, 0, 0);
  
  const current = new Date(currentDate);
  current.setHours(0, 0, 0, 0);
  
  // Check if it's the next day (86400000 ms = 1 day)
  const diffTime = current.getTime() - last.getTime();
  return diffTime <= 86400000;
};

// Get color for priority
export const getPriorityColor = (priority: TaskPriority): string => {
  switch (priority) {
    case TaskPriority.Low:
      return 'bg-green-100 text-green-800';
    case TaskPriority.Medium:
      return 'bg-blue-100 text-blue-800';
    case TaskPriority.High:
      return 'bg-orange-100 text-orange-800';
    case TaskPriority.Urgent:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get color for category
export const getCategoryColor = (category: TaskCategory): string => {
  switch (category) {
    case TaskCategory.Personal:
      return 'bg-purple-100 text-purple-800';
    case TaskCategory.Work:
      return 'bg-blue-100 text-blue-800';
    case TaskCategory.Study:
      return 'bg-yellow-100 text-yellow-800';
    case TaskCategory.Health:
      return 'bg-green-100 text-green-800';
    case TaskCategory.Finance:
      return 'bg-teal-100 text-teal-800';
    case TaskCategory.Other:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get Persian translation for priority
export const getPriorityName = (priority: TaskPriority): string => {
  switch (priority) {
    case TaskPriority.Low:
      return 'کم';
    case TaskPriority.Medium:
      return 'متوسط';
    case TaskPriority.High:
      return 'بالا';
    case TaskPriority.Urgent:
      return 'فوری';
    default:
      return '';
  }
};

// Get Persian translation for category
export const getCategoryName = (category: TaskCategory): string => {
  switch (category) {
    case TaskCategory.Personal:
      return 'شخصی';
    case TaskCategory.Work:
      return 'کاری';
    case TaskCategory.Study:
      return 'تحصیلی';
    case TaskCategory.Health:
      return 'سلامتی';
    case TaskCategory.Finance:
      return 'مالی';
    case TaskCategory.Other:
      return 'سایر';
    default:
      return '';
  }
};

// Get Persian translation for status
export const getStatusName = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.Pending:
      return 'در انتظار';
    case TaskStatus.Completed:
      return 'تکمیل شده';
    case TaskStatus.InProgress:
      return 'در حال انجام';
    case TaskStatus.Cancelled:
      return 'لغو شده';
    default:
      return '';
  }
};

// Get Persian translation for recurrence type
export const getRecurrenceTypeName = (type: RecurrenceType): string => {
  switch (type) {
    case RecurrenceType.None:
      return 'بدون تکرار';
    case RecurrenceType.Daily:
      return 'روزانه';
    case RecurrenceType.Weekly:
      return 'هفتگی';
    case RecurrenceType.Monthly:
      return 'ماهانه';
    case RecurrenceType.Custom:
      return 'سفارشی';
    default:
      return '';
  }
};