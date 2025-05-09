import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import TaskList from './components/tasks/TaskList';
import CalendarView from './components/calendar/CalendarView';
import StatsView from './components/stats/StatsView';
import SettingsView from './components/settings/SettingsView';
import TaskDetail from './components/tasks/TaskDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TaskList />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="stats" element={<StatsView />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      
      {/* Global components */}
      <TaskDetail />
    </BrowserRouter>
  );
}

export default App;