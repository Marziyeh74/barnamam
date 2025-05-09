import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { X, Calendar } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Task, 
  TaskPriority, 
  TaskCategory, 
  TaskStatus, 
  RecurrenceType 
} from '../../types';
import { 
  selectedTaskAtom, 
  addTaskAtom, 
  updateTaskAtom
} from '../../store/taskStore';
import { createTask } from '../../utils/taskUtils';
import Button from '../common/Button';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose }) => {
  const [selectedTask, setSelectedTask] = useAtom(selectedTaskAtom);
  const [, addTask] = useAtom(addTaskAtom);
  const [, updateTask] = useAtom(updateTaskAtom);
  
  const isEditMode = !!selectedTask;
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.Personal);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.Pending);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(RecurrenceType.None);
  const [recurrenceInterval, setRecurrenceInterval] = useState<number>(1);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  // Load task data if in edit mode
  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description || '');
      
      if (selectedTask.dueDate) {
        const date = new Date(selectedTask.dueDate);
        setDueDate(formatDateForInput(date));
        setDueTime(formatTimeForInput(date));
      }
      
      setPriority(selectedTask.priority);
      setCategory(selectedTask.category);
      setStatus(selectedTask.status);
      setIsRecurring(selectedTask.isRecurring);
      setRecurrenceType(selectedTask.recurrenceType);
      setRecurrenceInterval(selectedTask.recurrenceInterval || 1);
      setTags(selectedTask.tags || []);
    }
  }, [selectedTask]);
  
  // Reset form when modal closes
  const handleClose = () => {
    setSelectedTask(null);
    onClose();
  };
  
  // Helper functions for date handling
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  const formatTimeForInput = (date: Date): string => {
    return date.toTimeString().slice(0, 5);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine date and time
    let taskDueDate: Date | undefined;
    if (dueDate) {
      taskDueDate = new Date(`${dueDate}T${dueTime || '00:00'}`);
    }
    
    if (isEditMode && selectedTask) {
      // Update existing task
      const updatedTask: Task = {
        ...selectedTask,
        title,
        description,
        dueDate: taskDueDate,
        priority,
        category,
        status,
        isRecurring,
        recurrenceType,
        recurrenceInterval: isRecurring ? recurrenceInterval : undefined,
        tags
      };
      
      updateTask(updatedTask);
    } else {
      // Create new task
      const newTask = createTask({
        title,
        description,
        dueDate: taskDueDate,
        priority,
        category,
        isRecurring,
        recurrenceType: isRecurring ? recurrenceType : RecurrenceType.None,
        recurrenceInterval: isRecurring ? recurrenceInterval : undefined,
        tags
      });
      
      addTask(newTask);
    }
    
    handleClose();
  };
  
  // Handle tag input
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const modalTitle = isEditMode ? 'ویرایش وظیفه' : 'ایجاد وظیفه جدید';
  
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as={motion.div}
          static
          open={isOpen}
          onClose={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Dialog.Overlay
            as={motion.div}
            className="fixed inset-0 bg-black bg-opacity-25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          <motion.div
            className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-xl font-bold text-gray-900">
                {modalTitle}
              </Dialog.Title>
              
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="form-label">
                    عنوان<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="form-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label htmlFor="description" className="form-label">
                    توضیحات
                  </label>
                  <textarea
                    id="description"
                    className="form-input h-24"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                {/* Due Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dueDate" className="form-label">
                      تاریخ سررسید
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="dueDate"
                        type="date"
                        className="form-input pr-10"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="dueTime" className="form-label">
                      زمان سررسید
                    </label>
                    <input
                      id="dueTime"
                      type="time"
                      className="form-input"
                      value={dueTime}
                      onChange={(e) => setDueTime(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Priority and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="priority" className="form-label">
                      اولویت
                    </label>
                    <select
                      id="priority"
                      className="form-input"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    >
                      <option value={TaskPriority.Low}>کم</option>
                      <option value={TaskPriority.Medium}>متوسط</option>
                      <option value={TaskPriority.High}>بالا</option>
                      <option value={TaskPriority.Urgent}>فوری</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="form-label">
                      دسته‌بندی
                    </label>
                    <select
                      id="category"
                      className="form-input"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    >
                      <option value={TaskCategory.Personal}>شخصی</option>
                      <option value={TaskCategory.Work}>کاری</option>
                      <option value={TaskCategory.Study}>تحصیلی</option>
                      <option value={TaskCategory.Health}>سلامتی</option>
                      <option value={TaskCategory.Finance}>مالی</option>
                      <option value={TaskCategory.Other}>سایر</option>
                    </select>
                  </div>
                </div>
                
                {/* Status (only in edit mode) */}
                {isEditMode && (
                  <div>
                    <label htmlFor="status" className="form-label">
                      وضعیت
                    </label>
                    <select
                      id="status"
                      className="form-input"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    >
                      <option value={TaskStatus.Pending}>در انتظار</option>
                      <option value={TaskStatus.InProgress}>در حال انجام</option>
                      <option value={TaskStatus.Completed}>تکمیل شده</option>
                      <option value={TaskStatus.Cancelled}>لغو شده</option>
                    </select>
                  </div>
                )}
                
                {/* Recurring Task */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="isRecurring"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                    />
                    <label htmlFor="isRecurring" className="mr-2 text-sm font-medium text-gray-700">
                      وظیفه تکرارشونده
                    </label>
                  </div>
                  
                  {isRecurring && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label htmlFor="recurrenceType" className="form-label">
                          نوع تکرار
                        </label>
                        <select
                          id="recurrenceType"
                          className="form-input"
                          value={recurrenceType}
                          onChange={(e) => setRecurrenceType(e.target.value as RecurrenceType)}
                        >
                          <option value={RecurrenceType.Daily}>روزانه</option>
                          <option value={RecurrenceType.Weekly}>هفتگی</option>
                          <option value={RecurrenceType.Monthly}>ماهانه</option>
                          <option value={RecurrenceType.Custom}>سفارشی</option>
                        </select>
                      </div>
                      
                      {recurrenceType === RecurrenceType.Custom && (
                        <div>
                          <label htmlFor="recurrenceInterval" className="form-label">
                            فاصله تکرار (روز)
                          </label>
                          <input
                            id="recurrenceInterval"
                            type="number"
                            min="1"
                            className="form-input"
                            value={recurrenceInterval}
                            onChange={(e) => setRecurrenceInterval(parseInt(e.target.value))}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="form-label">
                    برچسب‌ها
                  </label>
                  <div className="flex">
                    <input
                      id="tagInput"
                      type="text"
                      className="form-input flex-grow"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="برچسب را وارد کنید و Enter را فشار دهید"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mr-2"
                      onClick={handleAddTag}
                    >
                      افزودن
                    </Button>
                  </div>
                  
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map((tag) => (
                        <div
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                        >
                          {tag}
                          <button
                            type="button"
                            className="ml-1 text-gray-500 hover:text-gray-700"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex items-center justify-end space-x-4 space-x-reverse">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  {isEditMode ? 'بروزرسانی' : 'ایجاد'}
                </Button>
              </div>
            </form>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;