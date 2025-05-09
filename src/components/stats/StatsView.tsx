import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { tasksAtom, taskStatsAtom } from '../../store/taskStore';
import { TaskStatus, TaskCategory, TaskPriority } from '../../types';
import { getCategoryName, getPriorityName } from '../../utils/taskUtils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// RTL Plugin for ChartJS
const rtlPlugin = {
  id: 'rtlPlugin',
  beforeInit: (chart: any) => {
    const originalFit = chart.legend.fit;
    chart.legend.fit = function fit() {
      originalFit.call(this);
      this.height += 10;
    };
  }
};

// Set default ChartJS options for RTL
ChartJS.defaults.font.family = 'Vazirmatn, sans-serif';
ChartJS.defaults.color = '#4B5563';
ChartJS.defaults.plugins.tooltip.rtl = true;
ChartJS.defaults.plugins.tooltip.titleAlign = 'right';
ChartJS.defaults.plugins.tooltip.bodyAlign = 'right';
ChartJS.defaults.plugins.legend.rtl = true;
ChartJS.defaults.plugins.title.align = 'right';

const StatsView: React.FC = () => {
  const [tasks] = useAtom(tasksAtom);
  const [stats] = useAtom(taskStatsAtom);
  
  // Chart colors
  const chartColors = {
    primary: 'rgba(13, 148, 136, 0.8)',
    secondary: 'rgba(139, 92, 246, 0.8)',
    accent: 'rgba(245, 158, 11, 0.8)',
    success: 'rgba(34, 197, 94, 0.8)',
    warning: 'rgba(217, 119, 6, 0.8)',
    error: 'rgba(220, 38, 38, 0.8)',
    gray: 'rgba(107, 114, 128, 0.8)',
  };
  
  // Status Chart Data
  const statusChartData = {
    labels: ['تکمیل شده', 'در انتظار', 'در حال انجام'],
    datasets: [
      {
        data: [stats.completed, stats.pending, stats.inProgress],
        backgroundColor: [chartColors.success, chartColors.warning, chartColors.primary],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(217, 119, 6, 1)',
          'rgba(13, 148, 136, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Category Chart Data
  const categoryChartData = {
    labels: Object.keys(stats.byCategory).map(cat => getCategoryName(cat as TaskCategory)),
    datasets: [
      {
        label: 'تعداد وظایف',
        data: Object.values(stats.byCategory),
        backgroundColor: chartColors.secondary,
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Priority Chart Data
  const priorityChartData = {
    labels: Object.keys(stats.byPriority).map(prio => getPriorityName(prio as TaskPriority)),
    datasets: [
      {
        label: 'تعداد وظایف',
        data: Object.values(stats.byPriority),
        backgroundColor: [
          chartColors.success, 
          chartColors.primary, 
          chartColors.warning, 
          chartColors.error
        ],
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };
  
  // Activity over time (last 7 days)
  const getActivityData = () => {
    const dates = [];
    const completedCounts = [];
    
    // Get the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      // Format date for display
      const formattedDate = new Date(date).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' });
      dates.push(formattedDate);
      
      // Count completed tasks for this day
      const completedToday = tasks.filter(task => {
        if (!task.completedAt) return false;
        const taskDate = new Date(task.completedAt);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === date.getTime();
      }).length;
      
      completedCounts.push(completedToday);
    }
    
    return {
      labels: dates,
      datasets: [
        {
          label: 'وظایف تکمیل شده',
          data: completedCounts,
          fill: false,
          borderColor: chartColors.accent,
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };
  
  const activityChartData = getActivityData();
  
  const chartOptions = {
    plugins: {
      rtlPlugin,
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: 'Vazirmatn, sans-serif',
          },
        },
      },
      title: {
        display: true,
        font: {
          size: 16,
          family: 'Vazirmatn, sans-serif',
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  
  return (
    <div className="min-h-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">آمار و گزارش‌ها</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">کل وظایف</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.total}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">تکمیل شده</h3>
          <p className="text-3xl font-bold text-success-600">{stats.completed}</p>
          <p className="text-sm text-gray-500 mt-1">
            {stats.total > 0 ? `${Math.round(stats.completionRate)}٪ از کل` : '0٪ از کل'}
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">در انتظار</h3>
          <p className="text-3xl font-bold text-warning-600">{stats.pending}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">در حال انجام</h3>
          <p className="text-3xl font-bold text-secondary-600">{stats.inProgress}</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">توزیع وضعیت وظایف</h3>
          <div className="h-64">
            <Doughnut 
              data={statusChartData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: 'توزیع وظایف بر اساس وضعیت',
                  },
                },
              }} 
            />
          </div>
        </div>
        
        {/* Activity Over Time */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">فعالیت در ۷ روز اخیر</h3>
          <div className="h-64">
            <Line 
              data={activityChartData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: 'وظایف تکمیل شده در ۷ روز اخیر',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }} 
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by Category */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">وظایف بر اساس دسته‌بندی</h3>
          <div className="h-64">
            <Bar 
              data={categoryChartData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: 'تعداد وظایف در هر دسته‌بندی',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }} 
            />
          </div>
        </div>
        
        {/* Tasks by Priority */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">وظایف بر اساس اولویت</h3>
          <div className="h-64">
            <Doughnut 
              data={priorityChartData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: 'توزیع وظایف بر اساس اولویت',
                  },
                },
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsView;