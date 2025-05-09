import { format, parse, addDays, isSameDay, isToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns-jalali';

// Format a date in Persian format
export const formatPersianDate = (date: Date | null | undefined): string => {
  if (!date) return '';
  return format(date, 'yyyy/MM/dd');
};

// Format a date with time in Persian format
export const formatPersianDateTime = (date: Date | null | undefined): string => {
  if (!date) return '';
  return format(date, 'yyyy/MM/dd HH:mm');
};

// Get short weekday name
export const getWeekdayName = (date: Date): string => {
  return format(date, 'E');
};

// Get month name
export const getMonthName = (date: Date): string => {
  return format(date, 'MMMM');
};

// Parse a Persian date string
export const parsePersianDate = (dateString: string): Date => {
  return parse(dateString, 'yyyy/MM/dd', new Date());
};

// Check if two dates are the same day
export const isSamePersianDay = (date1: Date | null | undefined, date2: Date | null | undefined): boolean => {
  if (!date1 || !date2) return false;
  return isSameDay(date1, date2);
};

// Check if a date is today
export const isPersianToday = (date: Date | null | undefined): boolean => {
  if (!date) return false;
  return isToday(date);
};

// Get an array of dates for the current week
export const getCurrentWeekDays = (): Date[] => {
  const now = new Date();
  const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 6 }); // Saturday as first day
  const endOfCurrentWeek = endOfWeek(now, { weekStartsOn: 6 });
  
  return eachDayOfInterval({
    start: startOfCurrentWeek,
    end: endOfCurrentWeek
  });
};

// Get an array of dates for the current month
export const getCurrentMonthDays = (): Date[] => {
  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const endOfCurrentMonth = endOfMonth(now);
  
  return eachDayOfInterval({
    start: startOfCurrentMonth,
    end: endOfCurrentMonth
  });
};

// Calculate days left until a deadline
export const getDaysUntil = (dueDate: Date | null | undefined): number => {
  if (!dueDate) return 0;
  
  const now = new Date();
  const diffTime = dueDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get date for streak calculations
export const getStreakDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Check if a streak is active (completed in the last day)
export const isStreakActive = (lastCompletedDate: Date | null | undefined): boolean => {
  if (!lastCompletedDate) return false;
  
  const oneDayAgo = addDays(new Date(), -1);
  return lastCompletedDate >= oneDayAgo;
};