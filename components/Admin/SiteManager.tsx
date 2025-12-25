
import React, { useState } from 'react';
import { AppState, ConstructionSite } from '../../types';
import { Plus, Search, Trash2, Edit2, MapPin, Star } from 'lucide-react';

interface SiteManagerProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const SiteManager: React.FC<SiteManagerProps> = ({ state, setState }) => {
  const [search, setSearch] = useState('');
  const [editingSite, setEditingSite] = useState<ConstructionSite | null>(null);

  const filteredSites = state.sites.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddOrUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const priority = parseInt(formData.get('priority') as string);
    const siteManager = formData.get('siteManager') as string;
    const id = formData.get('id') as string;
    const permanentComments = formData.get('permanentComments') as string;

    const siteData = { name, address, priority, siteManager, id, permanentComments, requiredSkills: [] };

    if (editingSite) {
      setState(prev => ({
        ...prev,
        sites: prev.sites.map(s => s.id === editingSite.id ? { ...s, ...siteData } : s)
      }));
    } else {
      setState(prev => ({ ...prev, sites: [...prev.sites, siteData] }));
    }
    setEditingSite(null);
    e.currentTarget.reset();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border h-fit">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{editingSite ? 'Edit Site' : 'Add New Construction Site'}</h3>
        <form onSubmit={handleAddOrUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site ID</label>
              <input name="id" defaultValue={editingSite?.id} required className="w-full border rounded-lg px-3 py-2 uppercase" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority (0-5)</label>
              <input name="priority" type="number" min="0" max="5" defaultValue={editingSite?.priority ?? 3} required className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input name="name" defaultValue={editingSite?.name} required className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input name="address" defaultValue={editingSite?.address} required className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Manager</label>
            <input name="siteManager" defaultValue={editingSite?.siteManager} required className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Comments</label>
            <textarea name="permanentComments" defaultValue={editingSite?.permanentComments} className="w-full border rounded-lg px-3 py-2" rows={3} />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">
            {editingSite ? 'Update Site' : 'Register Site'}
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
            placeholder="Search sites..." 
          />
        </div>
        <div className="divide-y max-h-[700px] overflow-y-auto">
          {filteredSites.map(site => (
            <div key={site.id} className={`p-4 flex items-start justify-between hover:bg-gray-50 group ${site.priority === 0 ? 'opacity-50' : ''}`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gray-400">#{site.id}</span>
                  <p className="font-bold text-gray-800">{site.name}</p>
                  <div className="flex">
                    {[...Array(site.priority)].map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={12} /> {site.address}
                </div>
                <p className="text-xs text-blue-600 font-medium italic">Managed by: {site.siteManager}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditingSite(site)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                <button onClick={() => setState(prev => ({ ...prev, sites: prev.sites.filter(s => s.id !== site.id) }))} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SiteManager;
