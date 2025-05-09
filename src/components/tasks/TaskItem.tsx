import React from 'react';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { 
  Check, 
  Clock, 
  Edit, 
  Trash, 
  AlertCircle, 
  CalendarClock, 
  Activity 
} from 'lucide-react';
import { Task } from '../../types';
import { completeTaskAtom, deleteTaskAtom, selectedTaskAtom } from '../../store/taskStore';
import { formatPersianDate, getDaysUntil } from '../../utils/date';
import { 
  getPriorityColor, 
  getCategoryColor, 
  getPriorityName, 
  getCategoryName 
} from '../../utils/taskUtils';
import Badge from '../common/Badge';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [, completeTask] = useAtom(completeTaskAtom);
  const [, deleteTask] = useAtom(deleteTaskAtom);
  const [, setSelectedTask] = useAtom(selectedTaskAtom);
  
  // Handle task actions
  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    completeTask(task.id);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTask(task);
  };
  
  const handleTaskClick = () => {
    setSelectedTask(task);
  };
  
  // Determine due date status
  const getDueDateStatus = () => {
    if (!task.dueDate) return null;
    
    const daysLeft = getDaysUntil(task.dueDate);
    
    if (daysLeft < 0) {
      return { text: 'گذشته', variant: 'error' as const };
    } else if (daysLeft === 0) {
      return { text: 'امروز', variant: 'warning' as const };
    } else if (daysLeft <= 2) {
      return { text: `${daysLeft} روز مانده`, variant: 'warning' as const };
    } else {
      return { text: `${daysLeft} روز مانده`, variant: 'success' as const };
    }
  };
  
  const dueDateStatus = getDueDateStatus();
  
  return (
    <motion.div 
      className="card card-hover mb-3 cursor-pointer"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleTaskClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold mr-2">{task.title}</h3>
            {task.isRecurring && task.streak > 0 && (
              <div className="flex items-center mr-2">
                <Activity className="h-4 w-4 text-secondary-600 mr-1" />
                <span className="text-sm text-secondary-600">{task.streak} روز متوالی</span>
              </div>
            )}
          </div>
          
          {task.description && (
            <p className="text-gray-600 mb-3 text-sm">{task.description}</p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="primary" className={getPriorityColor(task.priority)}>
              {getPriorityName(task.priority)}
            </Badge>
            
            <Badge variant="secondary" className={getCategoryColor(task.category)}>
              {getCategoryName(task.category)}
            </Badge>
            
            {dueDateStatus && task.dueDate && (
              <Badge variant={dueDateStatus.variant} className="flex items-center">
                <Clock className="h-3 w-3 ml-1" />
                <span>{dueDateStatus.text}</span>
              </Badge>
            )}
            
            {task.isRecurring && (
              <Badge variant="accent">
                <CalendarClock className="h-3 w-3 ml-1" />
                <span>تکرارشونده</span>
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 mr-4">
          <button 
            className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
            onClick={handleComplete}
            title="تکمیل"
          >
            <Check className="h-4 w-4" />
          </button>
          
          <button 
            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            onClick={handleEdit}
            title="ویرایش"
          >
            <Edit className="h-4 w-4" />
          </button>
          
          <button 
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            onClick={handleDelete}
            title="حذف"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {task.dueDate && (
        <div className="mt-3 text-sm text-gray-500 flex items-center">
          <CalendarClock className="h-4 w-4 ml-1" />
          <span>موعد: {formatPersianDate(task.dueDate)}</span>
        </div>
      )}
    </motion.div>
  );
};

export default TaskItem;