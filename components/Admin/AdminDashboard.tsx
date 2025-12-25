
import React, { useState } from 'react';
import { AppState, UserRole } from '../../types';
import PlanningGrid from './PlanningGrid';
import EmployeeManager from './EmployeeManager';
import CarManager from './CarManager';
import SiteManager from './SiteManager';
import { LayoutDashboard, Users, Car, MapPin, LogOut } from 'lucide-react';

interface AdminDashboardProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onLogout: () => void;
}

enum AdminView {
  PLANNING = 'PLANNING',
  EMPLOYEES = 'EMPLOYEES',
  CARS = 'CARS',
  SITES = 'SITES'
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ state, setState, onLogout }) => {
  const [currentView, setCurrentView] = useState<AdminView>(AdminView.PLANNING);

  const sidebarItems = [
    { id: AdminView.PLANNING, label: 'Planning Grid', icon: LayoutDashboard },
    { id: AdminView.EMPLOYEES, label: 'Employees', icon: Users },
    { id: AdminView.CARS, label: 'Car Fleet', icon: Car },
    { id: AdminView.SITES, label: 'Construction Sites', icon: MapPin },
  ];

  const renderContent = () => {
    switch (currentView) {
      case AdminView.PLANNING:
        return <PlanningGrid state={state} setState={setState} />;
      case AdminView.EMPLOYEES:
        return <EmployeeManager state={state} setState={setState} />;
      case AdminView.CARS:
        return <CarManager state={state} setState={setState} />;
      case AdminView.SITES:
        return <SiteManager state={state} setState={setState} />;
      default:
        return <PlanningGrid state={state} setState={setState} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight">ConstruPlan Admin</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  currentView === item.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-100">
        <header className="bg-white border-b px-8 py-4 sticky top-0 z-30 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            {sidebarItems.find(i => i.id === currentView)?.label}
          </h1>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>
        
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
