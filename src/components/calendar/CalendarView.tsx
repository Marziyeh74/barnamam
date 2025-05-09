import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, PlusCircle } from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns-jalali';
import { tasksAtom, selectedTaskAtom } from '../../store/taskStore';
import { formatPersianDate } from '../../utils/date';
import { getPriorityColor } from '../../utils/taskUtils';
import Button from '../common/Button';
import TaskModal from '../tasks/TaskModal';
import TaskDetail from '../tasks/TaskDetail';

const CalendarView: React.FC = () => {
  const [tasks] = useAtom(tasksAtom);
  const [, setSelectedTask] = useAtom(selectedTaskAtom);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };
  
  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };
  
  // Get calendar days
  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    
    // Start from Saturday (6) for Persian calendar
    const startDate = startOfWeek(start, { weekStartsOn: 6 });
    const endDate = endOfWeek(end, { weekStartsOn: 6 });
    
    return eachDayOfInterval({ start: startDate, end: endDate });
  };
  
  const days = getDaysInMonth();
  
  // Get tasks for a specific day
  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(task.dueDate, day);
    });
  };
  
  // Day cell renderer
  const renderDay = (day: Date, index: number) => {
    const dayTasks = getTasksForDay(day);
    const isCurrentMonth = isSameMonth(day, currentDate);
    const isCurrentDay = isToday(day);
    const dayNumber = format(day, 'd');
    const dayName = format(day, 'EEEE');
    
    return (
      <div 
        key={index}
        className={`min-h-32 border border-gray-200 p-2 ${!isCurrentMonth ? 'bg-gray-50' : ''}`}
      >
        <div className={`flex justify-between items-center mb-1 ${!isCurrentMonth ? 'opacity-50' : ''}`}>
          <span className={`text-sm ${isCurrentDay ? 'bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
            {dayNumber}
          </span>
          <span className="text-xs text-gray-500">{dayName}</span>
        </div>
        
        <div className="overflow-y-auto max-h-24 space-y-1">
          {dayTasks.map(task => (
            <motion.div 
              key={task.id}
              className={`p-1 rounded text-xs cursor-pointer truncate ${getPriorityColor(task.priority)}`}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedTask(task)}
            >
              {task.title}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">تقویم</h1>
        
        <Button 
          variant="primary" 
          leftIcon={<PlusCircle className="h-5 w-5" />}
          onClick={() => setShowAddModal(true)}
        >
          وظیفه جدید
        </Button>
      </div>
      
      {/* Calendar Navigation */}
      <div className="flex justify-between items-center mb-6 bg-white rounded-lg p-4 shadow-sm">
        <button 
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={goToPreviousMonth}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        
        <div className="text-xl font-bold">
          {format(currentDate, 'MMMM yyyy')}
        </div>
        
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            className="text-sm text-primary-600 hover:text-primary-700 p-2"
            onClick={goToCurrentMonth}
          >
            برو به امروز
          </button>
          
          <button 
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={goToNextMonth}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 text-center py-2 border-b border-gray-200 bg-gray-50">
          {['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'].map((day, index) => (
            <div key={index} className="text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => renderDay(day, index))}
        </div>
      </div>
      
      {/* Task Modals */}
      {showAddModal && (
        <TaskModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
        />
      )}
      
      <TaskDetail />
    </div>
  );
};

export default CalendarView;