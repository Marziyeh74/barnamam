import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Filter, Plus, Search } from 'lucide-react';
import { 
  tasksAtom,
  pendingTasksAtom,
  completedTasksAtom,
  inProgressTasksAtom,
} from '../../store/taskStore';
import { TaskCategory, TaskPriority, TaskStatus } from '../../types';
import TaskItem from './TaskItem';
import Button from '../common/Button';
import TaskModal from './TaskModal';

const TaskList: React.FC = () => {
  const [tasks] = useAtom(tasksAtom);
  const [pendingTasks] = useAtom(pendingTasksAtom);
  const [completedTasks] = useAtom(completedTasksAtom);
  const [inProgressTasks] = useAtom(inProgressTasksAtom);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TaskStatus>(TaskStatus.Pending);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  
  // Filter and search tasks
  const getFilteredTasks = () => {
    let filteredTasks = [];
    
    // First filter by status (tab)
    switch (activeTab) {
      case TaskStatus.Pending:
        filteredTasks = pendingTasks;
        break;
      case TaskStatus.Completed:
        filteredTasks = completedTasks;
        break;
      case TaskStatus.InProgress:
        filteredTasks = inProgressTasks;
        break;
      default:
        filteredTasks = tasks;
    }
    
    // Then filter by category if selected
    if (categoryFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.category === categoryFilter);
    }
    
    // Then filter by priority if selected
    if (priorityFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
    }
    
    // Finally, filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filteredTasks = filteredTasks.filter(
        task => 
          task.title.toLowerCase().includes(term) || 
          (task.description && task.description.toLowerCase().includes(term))
      );
    }
    
    return filteredTasks;
  };
  
  const filteredTasks = getFilteredTasks();
  
  return (
    <div className="min-h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">مدیریت وظایف</h1>
        
        <Button 
          variant="primary" 
          leftIcon={<Plus className="h-5 w-5" />}
          onClick={() => setShowAddModal(true)}
        >
          وظیفه جدید
        </Button>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="form-input pr-10"
              placeholder="جستجوی وظایف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button
            variant="outline"
            leftIcon={<Filter className="h-5 w-5" />}
            onClick={() => setShowFilters(!showFilters)}
          >
            فیلترها
          </Button>
        </div>
        
        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="categoryFilter" className="form-label">دسته‌بندی</label>
              <select
                id="categoryFilter"
                className="form-input"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as TaskCategory | 'all')}
              >
                <option value="all">همه دسته‌بندی‌ها</option>
                <option value={TaskCategory.Personal}>شخصی</option>
                <option value={TaskCategory.Work}>کاری</option>
                <option value={TaskCategory.Study}>تحصیلی</option>
                <option value={TaskCategory.Health}>سلامتی</option>
                <option value={TaskCategory.Finance}>مالی</option>
                <option value={TaskCategory.Other}>سایر</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="priorityFilter" className="form-label">اولویت</label>
              <select
                id="priorityFilter"
                className="form-input"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
              >
                <option value="all">همه اولویت‌ها</option>
                <option value={TaskPriority.Low}>کم</option>
                <option value={TaskPriority.Medium}>متوسط</option>
                <option value={TaskPriority.High}>بالا</option>
                <option value={TaskPriority.Urgent}>فوری</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            className={`mr-1 py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === TaskStatus.Pending
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab(TaskStatus.Pending)}
          >
            در انتظار ({pendingTasks.length})
          </button>
          
          <button
            className={`mr-1 py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === TaskStatus.InProgress
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab(TaskStatus.InProgress)}
          >
            در حال انجام ({inProgressTasks.length})
          </button>
          
          <button
            className={`mr-1 py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === TaskStatus.Completed
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab(TaskStatus.Completed)}
          >
            تکمیل شده ({completedTasks.length})
          </button>
        </nav>
      </div>
      
      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-500">هیچ وظیفه‌ای یافت نشد</h3>
            <p className="text-gray-400 mt-2">
              می‌توانید با کلیک بر روی دکمه «وظیفه جدید» یک وظیفه ایجاد کنید
            </p>
          </div>
        )}
      </div>
      
      {/* Task Modal */}
      {showAddModal && (
        <TaskModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
        />
      )}
    </div>
  );
};

export default TaskList;