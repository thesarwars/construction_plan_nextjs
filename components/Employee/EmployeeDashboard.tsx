
import React, { useState, useMemo } from 'react';
import { AppState, UserRole } from '../../types';
import { MapPin, Navigation, PhoneCall, Warehouse, MessageCircle, LogOut, ChevronRight, User } from 'lucide-react';

interface EmployeeDashboardProps {
  state: AppState;
  employeeId: string;
  onLogout: () => void;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ state, employeeId, onLogout }) => {
  const [activeDay, setActiveDay] = useState<'today' | 'tomorrow'>('today');
  
  const targetDate = useMemo(() => {
    const d = new Date();
    if (activeDay === 'tomorrow') d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, [activeDay]);

  const schedule = state.schedules[targetDate];
  const employee = state.employees.find(e => e.id === employeeId);
  const myAssignments = schedule?.assignments.filter(a => a.employeeId === employeeId) || [];
  
  const assignedSites = useMemo(() => {
    return myAssignments.map(a => {
      const site = state.sites.find(s => s.id === a.siteId);
      const plan = schedule?.sitePlans.find(p => p.siteId === a.siteId);
      const colleagues = schedule?.assignments
        .filter(oa => oa.siteId === a.siteId && oa.employeeId !== employeeId)
        .map(oa => state.employees.find(e => e.id === oa.employeeId)?.name);
      
      return { site, plan, colleagues };
    });
  }, [myAssignments, state.sites, state.employees, schedule, employeeId]);

  const handleHelpRequest = (siteName: string) => {
    alert(`Help request sent for ${siteName}. A site manager will contact you shortly.`);
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-20 shadow-xl border-x">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 rounded-b-3xl shadow-lg sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center ring-2 ring-white/30">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold leading-none">{employee?.name}</h2>
              <p className="text-blue-100 text-sm mt-1">Personnel Schedule</p>
            </div>
          </div>
          <button onClick={onLogout} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
            <LogOut size={20} />
          </button>
        </div>

        <div className="flex bg-blue-700/50 p-1 rounded-xl">
          <button
            onClick={() => setActiveDay('today')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeDay === 'today' ? 'bg-white text-blue-600 shadow-md' : 'text-blue-200'}`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveDay('tomorrow')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeDay === 'tomorrow' ? 'bg-white text-blue-600 shadow-md' : 'text-blue-200'}`}
          >
            Tomorrow
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {assignedSites.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <MapPin size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No Assignments</h3>
            <p className="text-gray-500 mt-2">You are not scheduled for {activeDay}. Enjoy your day off!</p>
          </div>
        ) : (
          assignedSites.map(({ site, plan, colleagues }) => {
            if (!site) return null;
            
            return (
              <div key={site.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col transition-transform active:scale-[0.98]">
                {/* Site Header */}
                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-100 px-2 py-0.5 rounded">
                        SITE ID: {site.id}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800 mt-2 leading-tight">{site.name}</h3>
                      <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                        <MapPin size={14} className="text-red-500" />
                        <span className="truncate">{site.address}</span>
                      </div>
                    </div>
                    {plan?.comeToWarehouse && (
                      <div className="bg-orange-100 text-orange-600 p-2 rounded-2xl flex flex-col items-center justify-center min-w-[60px]" title="Visit Warehouse">
                        <Warehouse size={20} />
                        <span className="text-[9px] font-bold mt-1 uppercase">WH FIRST</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Map Preview Mockup */}
                <div className="h-32 bg-gray-200 relative group overflow-hidden">
                   <img 
                    src={`https://picsum.photos/seed/${site.id}/400/200`} 
                    alt="Map preview" 
                    className="w-full h-full object-cover grayscale-[0.2]"
                  />
                  <div className="absolute inset-0 bg-black/5"></div>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`}
                    target="_blank"
                    className="absolute bottom-3 right-3 bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-300"
                  >
                    <Navigation size={14} /> Open GPS
                  </a>
                </div>

                {/* Details */}
                <div className="p-5 space-y-4">
                   {/* Comments */}
                  <div className="space-y-3">
                    {site.permanentComments && (
                      <div className="bg-gray-50 p-3 rounded-2xl border border-dashed">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                          <MessageCircle size={14} />
                          <span className="text-[10px] font-bold uppercase">Permanent Rules</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{site.permanentComments}</p>
                      </div>
                    )}
                    {plan?.dailyComment && (
                      <div className="bg-yellow-50 p-3 rounded-2xl border border-yellow-100">
                        <div className="flex items-center gap-2 text-yellow-600 mb-1">
                          <MessageCircle size={14} />
                          <span className="text-[10px] font-bold uppercase">Today's Note</span>
                        </div>
                        <p className="text-sm text-gray-700 font-medium leading-relaxed">{plan.dailyComment}</p>
                      </div>
                    )}
                  </div>

                  {/* Resource Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-50">
                      <span className="text-[10px] font-bold text-blue-400 uppercase">Assigned Vehicles</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {plan?.assignedCarIds && plan.assignedCarIds.length > 0 ? (
                          plan.assignedCarIds.map(cid => (
                            <span key={cid} className="bg-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm border border-blue-100">{cid}</span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">None</span>
                        )}
                      </div>
                    </div>
                    <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-50">
                      <span className="text-[10px] font-bold text-blue-400 uppercase">Colleagues</span>
                      <div className="mt-1 text-xs font-bold text-gray-700 truncate">
                        {colleagues && colleagues.length > 0 ? colleagues.join(', ') : 'Solo task'}
                      </div>
                    </div>
                  </div>

                  {/* Call for Help */}
                  <button 
                    onClick={() => handleHelpRequest(site.name)}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-3 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors"
                  >
                    <PhoneCall size={18} />
                    Request Call for Help
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t p-4 px-8 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center gap-1 text-blue-600">
          <MapPin size={24} />
          <span className="text-[10px] font-bold">Sites</span>
        </button>
        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center -mt-10 border-4 border-white shadow-lg">
          <Navigation size={24} />
        </div>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <User size={24} />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default EmployeeDashboard;
