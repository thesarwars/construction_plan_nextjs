
import React, { useState, useEffect } from 'react';
import { UserRole, AppState } from './types';
import Login from './components/Auth/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import EmployeeDashboard from './components/Employee/EmployeeDashboard';
import { initialData } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<{ role: UserRole; id: string } | null>(null);
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('construplan_state');
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('construplan_state', JSON.stringify(state));
  }, [state]);

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={setUser} employees={state.employees} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user.role === UserRole.ADMIN ? (
        <AdminDashboard 
          state={state} 
          setState={setState} 
          onLogout={handleLogout} 
        />
      ) : (
        <EmployeeDashboard 
          state={state} 
          employeeId={user.id} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
};

export default App;
