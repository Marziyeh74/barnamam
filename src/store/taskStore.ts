import { atom } from 'jotai';
import { Task, TaskStatus, TaskPriority, TaskCategory } from '../types';

// Mock initial tasks
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'خرید اقلام هفتگی',
    description: 'خرید میوه، سبزیجات و مواد غذایی مورد نیاز',
    createdAt: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    priority: TaskPriority.Medium,
    category: TaskCategory.Personal,
    status: TaskStatus.Pending,
    isRecurring: true,
    recurrenceType: 'weekly',
    streak: 3,
    tags: ['خرید', 'هفتگی']
  },
  {
    id: '2',
    title: 'تکمیل گزارش پروژه',
    description: 'نهایی‌سازی گزارش پیشرفت پروژه برای جلسه فردا',
    createdAt: new Date(),
    dueDate: new Date(new Date().setHours(new Date().getHours() + 20)),
    priority: TaskPriority.High,
    category: TaskCategory.Work,
    status: TaskStatus.InProgress,
    isRecurring: false,
    recurrenceType: 'none',
    streak: 0,
  },
  {
    id: '3',
    title: 'مطالعه روزانه',
    description: 'مطالعه حداقل 30 دقیقه کتاب',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
    dueDate: new Date(new Date().setHours(23, 59, 59, 0)),
    priority: TaskPriority.Medium,
    category: TaskCategory.Personal,
    status: TaskStatus.Pending,
    isRecurring: true,
    recurrenceType: 'daily',
    streak: 5,
    tags: ['مطالعه', 'روزانه']
  },
  {
    id: '4',
    title: 'پیاده‌روی',
    description: 'پیاده‌روی روزانه به مدت 30 دقیقه',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 20)),
    dueDate: new Date(new Date().setHours(21, 0, 0, 0)),
    priority: TaskPriority.Low,
    category: TaskCategory.Health,
    status: TaskStatus.Pending,
    isRecurring: true,
    recurrenceType: 'daily',
    streak: 12,
    tags: ['ورزش', 'سلامتی']
  }
];

// Tasks atom
export const tasksAtom = atom<Task[]>(initialTasks);

// Filtered tasks atom based on status
export const pendingTasksAtom = atom((get) => 
  get(tasksAtom).filter(task => task.status === TaskStatus.Pending)
);

export const completedTasksAtom = atom((get) => 
  get(tasksAtom).filter(task => task.status === TaskStatus.Completed)
);

export const inProgressTasksAtom = atom((get) => 
  get(tasksAtom).filter(task => task.status === TaskStatus.InProgress)
);

// Task stats atom
export const taskStatsAtom = atom((get) => {
  const tasks = get(tasksAtom);
  
  const completed = tasks.filter(t => t.status === TaskStatus.Completed).length;
  const pending = tasks.filter(t => t.status === TaskStatus.Pending).length;
  const inProgress = tasks.filter(t => t.status === TaskStatus.InProgress).length;
  const total = tasks.length;
  
  const byCategory = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<TaskCategory, number>);
  
  const byPriority = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<TaskPriority, number>);
  
  const completionRate = total > 0 ? (completed / total) * 100 : 0;
  
  return {
    total,
    completed,
    pending,
    inProgress,
    byCategory,
    byPriority,
    completionRate
  };
});

// Selected task atom for viewing/editing
export const selectedTaskAtom = atom<Task | null>(null);

// Actions
export const addTaskAtom = atom(
  null,
  (get, set, newTask: Task) => {
    const tasks = [...get(tasksAtom)];
    set(tasksAtom, [...tasks, newTask]);
  }
);

export const updateTaskAtom = atom(
  null,
  (get, set, updatedTask: Task) => {
    const tasks = [...get(tasksAtom)];
    const index = tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      set(tasksAtom, tasks);
    }
  }
);

export const deleteTaskAtom = atom(
  null,
  (get, set, taskId: string) => {
    const tasks = [...get(tasksAtom)];
    set(tasksAtom, tasks.filter(task => task.id !== taskId));
  }
);

export const completeTaskAtom = atom(
  null,
  (get, set, taskId: string) => {
    const tasks = [...get(tasksAtom)];
    const index = tasks.findIndex(task => task.id === taskId);
    
    if (index !== -1) {
      const task = tasks[index];
      const now = new Date();
      
      // Update task status
      tasks[index] = {
        ...task,
        status: TaskStatus.Completed,
        completedAt: now,
        streak: task.isRecurring ? task.streak + 1 : 0,
        lastCompletedDate: now
      };
      
      set(tasksAtom, tasks);
    }
  }
);