
import React, { useState } from 'react';
import { AppState, Employee } from '../../types';
import { Plus, Search, Trash2, Edit2, Tag, Calendar as CalendarIcon } from 'lucide-react';

interface EmployeeManagerProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const EmployeeManager: React.FC<EmployeeManagerProps> = ({ state, setState }) => {
  const [search, setSearch] = useState('');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const filteredEmployees = state.employees.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddOrUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const skills = (formData.get('skills') as string).split(',').map(s => s.trim()).filter(s => s);
    const vacation = (formData.get('vacation') as string).split(',').map(v => v.trim()).filter(v => v);

    if (editingEmployee) {
      setState(prev => ({
        ...prev,
        employees: prev.employees.map(emp => emp.id === editingEmployee.id ? { ...emp, name, skills, vacationDays: vacation } : emp)
      }));
    } else {
      const newEmp: Employee = {
        id: `e${Date.now()}`,
        name,
        skills,
        vacationDays: vacation
      };
      setState(prev => ({ ...prev, employees: [...prev.employees, newEmp] }));
    }
    setEditingEmployee(null);
    e.currentTarget.reset();
  };

  const deleteEmployee = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setState(prev => ({ ...prev, employees: prev.employees.filter(e => e.id !== id) }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
          <form onSubmit={handleAddOrUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input name="name" defaultValue={editingEmployee?.name} required className="w-full border rounded-lg px-3 py-2" placeholder="e.g. Jane Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
              <input name="skills" defaultValue={editingEmployee?.skills.join(', ')} className="w-full border rounded-lg px-3 py-2" placeholder="e.g. Concrete, Welding" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vacation (YYYY-MM-DD, comma separated)</label>
              <input name="vacation" defaultValue={editingEmployee?.vacationDays.join(', ')} className="w-full border rounded-lg px-3 py-2" placeholder="e.g. 2024-12-25" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">
                {editingEmployee ? 'Update' : 'Add Employee'}
              </button>
              {editingEmployee && (
                <button type="button" onClick={() => setEditingEmployee(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b flex items-center gap-3">
            <Search className="text-gray-400" size={20} />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-sm" 
              placeholder="Search by name or skill..." 
            />
          </div>
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {filteredEmployees.map(emp => (
              <div key={emp.id} className="p-4 flex items-center justify-between hover:bg-gray-50 group">
                <div className="space-y-1">
                  <p className="font-bold text-gray-800">{emp.name}</p>
                  <div className="flex flex-wrap gap-1">
                    {emp.skills.map(s => (
                      <span key={s} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded flex items-center gap-1">
                        <Tag size={10} /> {s}
                      </span>
                    ))}
                  </div>
                  {emp.vacationDays.length > 0 && (
                    <div className="text-[10px] text-blue-600 flex items-center gap-1">
                      <CalendarIcon size={10} /> {emp.vacationDays.length} planned days
                    </div>
                  )}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingEmployee(emp)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                  <button onClick={() => deleteEmployee(emp.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManager;
