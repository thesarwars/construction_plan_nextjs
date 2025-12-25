
import React, { useState } from 'react';
import { UserRole, Employee } from '../../types';
import { LogIn, ShieldCheck, User } from 'lucide-react';

interface LoginProps {
  onLogin: (user: { role: UserRole; id: string }) => void;
  employees: Employee[];
}

const Login: React.FC<LoginProps> = ({ onLogin, employees }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.ADMIN);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(employees[0]?.id || '');

  const handleLogin = () => {
    onLogin({
      role: selectedRole,
      id: selectedRole === UserRole.ADMIN ? 'admin' : selectedEmployeeId
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-900 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">ConstruPlan Pro</h1>
          <p className="text-gray-500 mt-2">Workforce Management System</p>
        </div>

        <div className="space-y-6">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setSelectedRole(UserRole.ADMIN)}
              className={`flex-1 py-2 rounded-md transition-all ${selectedRole === UserRole.ADMIN ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Admin
            </button>
            <button
              onClick={() => setSelectedRole(UserRole.EMPLOYEE)}
              className={`flex-1 py-2 rounded-md transition-all ${selectedRole === UserRole.EMPLOYEE ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Employee
            </button>
          </div>

          {selectedRole === UserRole.EMPLOYEE && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Identity</label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
          )}

          {selectedRole === UserRole.ADMIN && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                defaultValue="admin"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Enter password"
              />
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn size={20} />
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
