import { atom } from 'jotai';
import { User, UserPreferences, TaskCategory, TaskPriority } from '../types';

// Default user preferences
const defaultPreferences: UserPreferences = {
  theme: 'light',
  notificationsEnabled: true,
  reminderTime: 30, // 30 minutes before due time
  defaultTaskView: 'list',
  defaultTaskCategory: TaskCategory.Personal,
  defaultTaskPriority: TaskPriority.Medium,
  streakTrackingEnabled: true
};

// Mock initial user
const initialUser: User = {
  id: '1',
  name: 'کاربر',
  email: 'user@example.com',
  preferences: defaultPreferences
};

// User atom
export const userAtom = atom<User>(initialUser);

// User preferences atom for easy access
export const preferencesAtom = atom(
  (get) => get(userAtom).preferences,
  (get, set, updatedPreferences: Partial<UserPreferences>) => {
    const user = get(userAtom);
    set(userAtom, {
      ...user,
      preferences: {
        ...user.preferences,
        ...updatedPreferences
      }
    });
  }
);

// Theme atom (derived from preferences)
export const themeAtom = atom(
  (get) => get(preferencesAtom).theme
);

// Update user atom
export const updateUserAtom = atom(
  null,
  (get, set, updatedUser: Partial<User>) => {
    const user = get(userAtom);
    set(userAtom, {
      ...user,
      ...updatedUser
    });
  }
);