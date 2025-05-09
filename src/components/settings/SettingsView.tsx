import React from 'react';
import { useAtom } from 'jotai';
import { 
  Bell, 
  Moon, 
  Sun, 
  Calendar, 
  List, 
  Award, 
  Save 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { UserPreferences, TaskCategory, TaskPriority } from '../../types';
import { userAtom, preferencesAtom } from '../../store/userStore';
import Button from '../common/Button';

const SettingsView: React.FC = () => {
  const [user] = useAtom(userAtom);
  const [preferences, updatePreferences] = useAtom(preferencesAtom);
  
  // Form state
  const [name, setName] = React.useState(user.name);
  const [email, setEmail] = React.useState(user.email);
  const [formPreferences, setFormPreferences] = React.useState<UserPreferences>({...preferences});
  const [isSaving, setIsSaving] = React.useState(false);
  
  // Handle input changes
  const handlePreferenceChange = (field: keyof UserPreferences, value: any) => {
    setFormPreferences({
      ...formPreferences,
      [field]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      updatePreferences(formPreferences);
      setIsSaving(false);
    }, 1000);
  };
  
  return (
    <div className="max-w-3xl mx-auto min-h-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">تنظیمات</h1>
      
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">اطلاعات کاربری</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="name" className="form-label">نام</label>
            <input
              id="name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="form-label">ایمیل</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-end">
          <Button 
            variant="primary"
            leftIcon={<Save className="h-5 w-5" />}
          >
            ذخیره تغییرات
          </Button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">تنظیمات نمایش</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {formPreferences.theme === 'dark' ? <Moon className="h-5 w-5 ml-2" /> : <Sun className="h-5 w-5 ml-2" />}
                  <span className="text-sm font-medium text-gray-700">حالت نمایش</span>
                </div>
                <div className="flex items-center">
                  <span className={`text-sm mr-2 ${formPreferences.theme === 'light' ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                    روشن
                  </span>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                    <input
                      type="checkbox"
                      id="theme-toggle"
                      className="absolute w-0 h-0 opacity-0"
                      checked={formPreferences.theme === 'dark'}
                      onChange={(e) => handlePreferenceChange('theme', e.target.checked ? 'dark' : 'light')}
                    />
                    <label
                      htmlFor="theme-toggle"
                      className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 ${
                        formPreferences.theme === 'dark' ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute w-4 h-4 bg-white rounded-full transition-all duration-300 transform ${
                          formPreferences.theme === 'dark' ? 'translate-x-2 translate-y-1' : 'translate-x-6 translate-y-1'
                        }`}
                      />
                    </label>
                  </div>
                  <span className={`text-sm mr-2 ${formPreferences.theme === 'dark' ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                    تیره
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 ml-2" />
                <span className="text-sm font-medium text-gray-700">نمای پیش‌فرض وظایف</span>
              </div>
              <div className="flex space-x-3 space-x-reverse">
                <div className="flex items-center">
                  <input
                    id="default-view-list"
                    type="radio"
                    name="default-view"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    checked={formPreferences.defaultTaskView === 'list'}
                    onChange={() => handlePreferenceChange('defaultTaskView', 'list')}
                  />
                  <label htmlFor="default-view-list" className="mr-2 text-sm text-gray-700">
                    لیستی
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="default-view-calendar"
                    type="radio"
                    name="default-view"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    checked={formPreferences.defaultTaskView === 'calendar'}
                    onChange={() => handlePreferenceChange('defaultTaskView', 'calendar')}
                  />
                  <label htmlFor="default-view-calendar" className="mr-2 text-sm text-gray-700">
                    تقویمی
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">تنظیمات وظایف</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="default-category" className="form-label">دسته‌بندی پیش‌فرض</label>
                <select
                  id="default-category"
                  className="form-input"
                  value={formPreferences.defaultTaskCategory}
                  onChange={(e) => handlePreferenceChange('defaultTaskCategory', e.target.value)}
                >
                  <option value={TaskCategory.Personal}>شخصی</option>
                  <option value={TaskCategory.Work}>کاری</option>
                  <option value={TaskCategory.Study}>تحصیلی</option>
                  <option value={TaskCategory.Health}>سلامتی</option>
                  <option value={TaskCategory.Finance}>مالی</option>
                  <option value={TaskCategory.Other}>سایر</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="default-priority" className="form-label">اولویت پیش‌فرض</label>
                <select
                  id="default-priority"
                  className="form-input"
                  value={formPreferences.defaultTaskPriority}
                  onChange={(e) => handlePreferenceChange('defaultTaskPriority', e.target.value)}
                >
                  <option value={TaskPriority.Low}>کم</option>
                  <option value={TaskPriority.Medium}>متوسط</option>
                  <option value={TaskPriority.High}>بالا</option>
                  <option value={TaskPriority.Urgent}>فوری</option>
                </select>
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <Award className="h-5 w-5 ml-2" />
                <span className="text-sm font-medium text-gray-700">پیگیری زنجیره‌ها</span>
              </div>
              <div className="flex items-center">
                <input
                  id="streak-tracking"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={formPreferences.streakTrackingEnabled}
                  onChange={(e) => handlePreferenceChange('streakTrackingEnabled', e.target.checked)}
                />
                <label htmlFor="streak-tracking" className="mr-2 text-sm text-gray-700">
                  فعال‌سازی پیگیری زنجیره‌ها برای وظایف تکرارشونده
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">تنظیمات اعلان‌ها</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 ml-2" />
                  <span className="text-sm font-medium text-gray-700">اعلان‌ها</span>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                  <input
                    type="checkbox"
                    id="notifications-toggle"
                    className="absolute w-0 h-0 opacity-0"
                    checked={formPreferences.notificationsEnabled}
                    onChange={(e) => handlePreferenceChange('notificationsEnabled', e.target.checked)}
                  />
                  <label
                    htmlFor="notifications-toggle"
                    className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 ${
                      formPreferences.notificationsEnabled ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute w-4 h-4 bg-white rounded-full transition-all duration-300 transform ${
                        formPreferences.notificationsEnabled ? 'translate-x-2 translate-y-1' : 'translate-x-6 translate-y-1'
                      }`}
                    />
                  </label>
                </div>
              </div>
              
              {formPreferences.notificationsEnabled && (
                <div className="mt-4">
                  <label htmlFor="reminder-time" className="form-label">زمان یادآوری (دقیقه قبل از موعد)</label>
                  <input
                    id="reminder-time"
                    type="number"
                    min="1"
                    max="1440"
                    className="form-input"
                    value={formPreferences.reminderTime}
                    onChange={(e) => handlePreferenceChange('reminderTime', parseInt(e.target.value) || 30)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              leftIcon={<Save className="h-5 w-5" />}
            >
              ذخیره تنظیمات
            </Button>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default SettingsView;