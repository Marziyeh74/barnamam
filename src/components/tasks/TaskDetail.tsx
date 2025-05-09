import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Edit, 
  Trash, 
  Clock, 
  CalendarClock, 
  CheckCircle, 
  Activity
} from 'lucide-react';
import { selectedTaskAtom, deleteTaskAtom, completeTaskAtom } from '../../store/taskStore';
import { formatPersianDate, formatPersianDateTime } from '../../utils/date';
import { 
  getPriorityName, 
  getCategoryName, 
  getStatusName, 
  getRecurrenceTypeName
} from '../../utils/taskUtils';
import Badge from '../common/Badge';
import Button from '../common/Button';
import TaskModal from './TaskModal';

const TaskDetail: React.FC = () => {
  const [selectedTask, setSelectedTask] = useAtom(selectedTaskAtom);
  const [, deleteTask] = useAtom(deleteTaskAtom);
  const [, completeTask] = useAtom(completeTaskAtom);
  const [showEditModal, setShowEditModal] = useState(false);
  
  if (!selectedTask) return null;
  
  const handleClose = () => {
    setSelectedTask(null);
  };
  
  const handleDelete = () => {
    deleteTask(selectedTask.id);
    handleClose();
  };
  
  const handleComplete = () => {
    completeTask(selectedTask.id);
    handleClose();
  };
  
  const handleEdit = () => {
    setShowEditModal(true);
  };
  
  return (
    <>
      <AnimatePresence>
        {selectedTask && !showEditModal && (
          <Dialog
            as={motion.div}
            static
            open={!!selectedTask}
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
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Dialog.Title className="text-2xl font-bold text-gray-900">
                    {selectedTask.title}
                  </Dialog.Title>
                  
                  {selectedTask.isRecurring && selectedTask.streak > 0 && (
                    <div className="flex items-center mt-2">
                      <Activity className="h-5 w-5 text-secondary-600 ml-2" />
                      <span className="text-secondary-600 font-medium">
                        {selectedTask.streak} روز متوالی
                      </span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mt-6 space-y-6">
                {selectedTask.description && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">توضیحات</h3>
                    <p className="text-gray-700 whitespace-pre-line">{selectedTask.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">جزئیات</h3>
                    <dl className="space-y-2">
                      <div className="flex">
                        <dt className="w-32 text-gray-500">وضعیت:</dt>
                        <dd className="font-medium text-gray-900">{getStatusName(selectedTask.status)}</dd>
                      </div>
                      
                      <div className="flex">
                        <dt className="w-32 text-gray-500">اولویت:</dt>
                        <dd className="font-medium text-gray-900">{getPriorityName(selectedTask.priority)}</dd>
                      </div>
                      
                      <div className="flex">
                        <dt className="w-32 text-gray-500">دسته‌بندی:</dt>
                        <dd className="font-medium text-gray-900">{getCategoryName(selectedTask.category)}</dd>
                      </div>
                      
                      {selectedTask.isRecurring && (
                        <div className="flex">
                          <dt className="w-32 text-gray-500">تکرار:</dt>
                          <dd className="font-medium text-gray-900">
                            {getRecurrenceTypeName(selectedTask.recurrenceType)}
                            {selectedTask.recurrenceInterval && selectedTask.recurrenceInterval > 1 && 
                              ` (هر ${selectedTask.recurrenceInterval} روز)`
                            }
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">زمان‌بندی</h3>
                    <dl className="space-y-2">
                      <div className="flex">
                        <dt className="w-32 text-gray-500">تاریخ ایجاد:</dt>
                        <dd className="font-medium text-gray-900">
                          {formatPersianDate(selectedTask.createdAt)}
                        </dd>
                      </div>
                      
                      {selectedTask.dueDate && (
                        <div className="flex">
                          <dt className="w-32 text-gray-500">سررسید:</dt>
                          <dd className="font-medium text-gray-900">
                            {formatPersianDateTime(selectedTask.dueDate)}
                          </dd>
                        </div>
                      )}
                      
                      {selectedTask.completedAt && (
                        <div className="flex">
                          <dt className="w-32 text-gray-500">تکمیل شده:</dt>
                          <dd className="font-medium text-gray-900">
                            {formatPersianDateTime(selectedTask.completedAt)}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
                
                {selectedTask.tags && selectedTask.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">برچسب‌ها</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.tags.map((tag) => (
                        <Badge key={tag} variant="default">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex items-center justify-end space-x-4 space-x-reverse">
                {selectedTask.status !== 'completed' && (
                  <Button
                    variant="accent"
                    leftIcon={<CheckCircle className="h-5 w-5" />}
                    onClick={handleComplete}
                  >
                    تکمیل وظیفه
                  </Button>
                )}
                
                <Button
                  variant="secondary"
                  leftIcon={<Edit className="h-5 w-5" />}
                  onClick={handleEdit}
                >
                  ویرایش
                </Button>
                
                <Button
                  variant="outline"
                  leftIcon={<Trash className="h-5 w-5" />}
                  className="text-red-600 hover:bg-red-50"
                  onClick={handleDelete}
                >
                  حذف
                </Button>
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
      
      {showEditModal && (
        <TaskModal 
          isOpen={showEditModal} 
          onClose={() => setShowEditModal(false)} 
        />
      )}
    </>
  );
};

export default TaskDetail;