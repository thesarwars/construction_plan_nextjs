
import React, { useState } from 'react';
import { AppState, Car } from '../../types';
import { Plus, Search, Trash2, Edit2, Car as CarIcon } from 'lucide-react';

interface CarManagerProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const CarManager: React.FC<CarManagerProps> = ({ state, setState }) => {
  const [search, setSearch] = useState('');
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const filteredCars = state.cars.filter(c => 
    c.id.toLowerCase().includes(search.toLowerCase()) || 
    c.licensePlate.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddOrUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = formData.get('id') as string;
    const licensePlate = formData.get('licensePlate') as string;

    if (editingCar) {
      setState(prev => ({
        ...prev,
        cars: prev.cars.map(c => c.id === editingCar.id ? { ...c, id, licensePlate } : c)
      }));
    } else {
      setState(prev => ({ ...prev, cars: [...prev.cars, { id, licensePlate }] }));
    }
    setEditingCar(null);
    e.currentTarget.reset();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border h-fit">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{editingCar ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
        <form onSubmit={handleAddOrUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle ID</label>
            <input name="id" defaultValue={editingCar?.id} required className="w-full border rounded-lg px-3 py-2 uppercase" placeholder="e.g. C05" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
            <input name="licensePlate" defaultValue={editingCar?.licensePlate} required className="w-full border rounded-lg px-3 py-2 uppercase" placeholder="e.g. B-CP-505" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">
            {editingCar ? 'Update' : 'Register Vehicle'}
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex items-center gap-3">
          <Search className="text-gray-400" size={20} />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm" 
            placeholder="Search by ID or license plate..." 
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          {filteredCars.map(car => (
            <div key={car.id} className="p-4 border rounded-xl flex items-center justify-between hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <CarIcon size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-800 uppercase">{car.id}</p>
                  <p className="text-xs text-gray-500 font-mono">{car.licensePlate}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditingCar(car)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                <button onClick={() => setState(prev => ({ ...prev, cars: prev.cars.filter(c => c.id !== car.id) }))} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarManager;
