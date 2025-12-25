
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, DaySchedule, DailyAssignment, SitePlan, ConstructionSite, Employee } from '../../types';
import { ChevronLeft, ChevronRight, Save, Calendar, AlertCircle, Warehouse, MessageSquare, Car as CarIcon } from 'lucide-react';

interface PlanningGridProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const PlanningGrid: React.FC<PlanningGridProps> = ({ state, setState }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [draftSchedule, setDraftSchedule] = useState<DaySchedule | null>(null);
  const [hoverRow, setHoverRow] = useState<string | null>(null);
  const [hoverCol, setHoverCol] = useState<string | null>(null);

  // Initialize draft schedule for selected date
  useEffect(() => {
    const existing = state.schedules[selectedDate];
    if (existing) {
      setDraftSchedule(JSON.parse(JSON.stringify(existing)));
    } else {
      // Logic: Today's schedule copied to tomorrow by default if no tomorrow exists
      const yesterday = new Date(new Date(selectedDate).getTime() - 86400000).toISOString().split('T')[0];
      const prevSchedule = state.schedules[yesterday];
      
      setDraftSchedule({
        date: selectedDate,
        assignments: prevSchedule ? JSON.parse(JSON.stringify(prevSchedule.assignments)) : [],
        sitePlans: state.sites.map(site => ({
          siteId: site.id,
          comeToWarehouse: false,
          dailyComment: '',
          assignedCarIds: []
        }))
      });
    }
  }, [selectedDate, state.schedules, state.sites]);

  const activeSites = useMemo(() => 
    state.sites
      .filter(s => s.priority > 0)
      .sort((a, b) => b.priority - a.priority),
    [state.sites]
  );

  const handleToggleAssignment = (empId: string, siteId: string) => {
    if (!draftSchedule) return;
    
    // Employee on vacation check
    const emp = state.employees.find(e => e.id === empId);
    if (emp?.vacationDays.includes(selectedDate)) return;

    const isAssigned = draftSchedule.assignments.some(a => a.employeeId === empId && a.siteId === siteId);
    
    setDraftSchedule(prev => {
      if (!prev) return null;
      if (isAssigned) {
        return { ...prev, assignments: prev.assignments.filter(a => !(a.employeeId === empId && a.siteId === siteId)) };
      } else {
        return { ...prev, assignments: [...prev.assignments, { employeeId: empId, siteId }] };
      }
    });
  };

  const handleUpdateSitePlan = (siteId: string, updates: Partial<SitePlan>) => {
    if (!draftSchedule) return;
    setDraftSchedule(prev => {
      if (!prev) return null;
      const newSitePlans = prev.sitePlans.map(sp => sp.siteId === siteId ? { ...sp, ...updates } : sp);
      return { ...prev, sitePlans: newSitePlans };
    });
  };

  const handleSave = () => {
    if (!draftSchedule) return;
    setState(prev => ({
      ...prev,
      schedules: {
        ...prev.schedules,
        [selectedDate]: draftSchedule
      }
    }));
    alert('Schedule published successfully!');
  };

  const isDoubleBooked = (empId: string) => {
    return draftSchedule?.assignments.filter(a => a.employeeId === empId).length! > 1;
  };

  const isCarDoubleUsed = (carId: string) => {
    const usage = draftSchedule?.sitePlans.reduce((acc, sp) => acc + sp.assignedCarIds.filter(id => id === carId).length, 0);
    return usage! > 1;
  };

  const isSiteUnscheduled = (siteId: string) => {
    return !draftSchedule?.assignments.some(a => a.siteId === siteId);
  };

  if (!draftSchedule) return <div>Loading grid...</div>;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setSelectedDate(prev => new Date(new Date(prev).getTime() - 86400000).toISOString().split('T')[0])}
              className="p-2 hover:bg-white rounded-md shadow-sm transition-all"
            ><ChevronLeft size={20} /></button>
            <div className="px-4 font-semibold flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              {selectedDate}
            </div>
            <button 
              onClick={() => setSelectedDate(prev => new Date(new Date(prev).getTime() + 86400000).toISOString().split('T')[0])}
              className="p-2 hover:bg-white rounded-md shadow-sm transition-all"
            ><ChevronRight size={20} /></button>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-lg shadow-blue-200"
          >
            <Save size={20} />
            Publish Changes
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="sticky left-0 z-20 bg-gray-50 p-4 text-left border-r min-w-[300px] shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Construction Site / Details</span>
                </th>
                {state.employees.map(emp => {
                  const onVacation = emp.vacationDays.includes(selectedDate);
                  const hasWarning = isDoubleBooked(emp.id);
                  return (
                    <th 
                      key={emp.id} 
                      className={`p-4 min-w-[120px] text-center transition-colors border-r ${onVacation ? 'bg-blue-50' : hoverCol === emp.id ? 'bg-blue-50' : ''}`}
                      onMouseEnter={() => setHoverCol(emp.id)}
                      onMouseLeave={() => setHoverCol(null)}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-sm font-semibold truncate max-w-[100px] ${onVacation ? 'text-blue-700' : 'text-gray-700'}`}>
                          {emp.name}
                        </span>
                        {onVacation && <span className="text-[10px] bg-blue-200 text-blue-700 px-1.5 py-0.5 rounded uppercase font-bold">Vacation</span>}
                        {hasWarning && <AlertCircle size={14} className="text-orange-500" title="Double booked!" />}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {activeSites.map(site => {
                const sitePlan = draftSchedule.sitePlans.find(sp => sp.siteId === site.id) || { siteId: site.id, comeToWarehouse: false, dailyComment: '', assignedCarIds: [] };
                const unassigned = isSiteUnscheduled(site.id);

                return (
                  <tr 
                    key={site.id} 
                    className={`border-b transition-colors ${hoverRow === site.id ? 'bg-blue-50/30' : ''}`}
                    onMouseEnter={() => setHoverRow(site.id)}
                    onMouseLeave={() => setHoverRow(null)}
                  >
                    {/* Site Info Column */}
                    <td className="sticky left-0 z-10 bg-white p-4 border-r shadow-[2px_0_5px_rgba(0,0,0,0.05)] min-w-[320px]">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-gray-400">#{site.id}</span>
                              <h3 className="font-bold text-gray-800">{site.name}</h3>
                              {unassigned && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="No employees assigned"></div>}
                            </div>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{site.address}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${site.priority === 5 ? 'bg-red-500' : site.priority >= 3 ? 'bg-amber-500' : 'bg-gray-400'}`}>
                            P{site.priority}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input 
                              type="checkbox" 
                              checked={sitePlan.comeToWarehouse} 
                              onChange={(e) => handleUpdateSitePlan(site.id, { comeToWarehouse: e.target.checked })}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <Warehouse size={14} className="text-gray-400 group-hover:text-blue-500" />
                            <span className="text-[11px] font-medium text-gray-600">Warehouse</span>
                          </label>
                          <div className="flex items-center gap-1">
                            <CarIcon size={14} className="text-gray-400" />
                            <select 
                              multiple
                              value={sitePlan.assignedCarIds}
                              // Fix: Explicitly cast elements of selectedOptions to HTMLOptionElement to access the 'value' property
                              onChange={(e) => {
                                const selected = Array.from(e.target.selectedOptions, option => (option as HTMLOptionElement).value);
                                handleUpdateSitePlan(site.id, { assignedCarIds: selected });
                              }}
                              className="text-[10px] bg-gray-50 border-none p-1 rounded focus:ring-1 focus:ring-blue-500"
                            >
                              {state.cars.map(car => (
                                <option key={car.id} value={car.id}>
                                  {car.id} {isCarDoubleUsed(car.id) ? '⚠️' : ''}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <MessageSquare size={14} className="text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="Daily note..."
                            value={sitePlan.dailyComment}
                            onChange={(e) => handleUpdateSitePlan(site.id, { dailyComment: e.target.value })}
                            className="flex-1 text-[11px] border-b border-gray-200 focus:border-blue-500 outline-none py-1"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Employee Cells */}
                    {state.employees.map(emp => {
                      const onVacation = emp.vacationDays.includes(selectedDate);
                      const assigned = draftSchedule.assignments.some(a => a.employeeId === emp.id && a.siteId === site.id);
                      
                      return (
                        <td 
                          key={emp.id}
                          onClick={() => !onVacation && handleToggleAssignment(emp.id, site.id)}
                          className={`border-r p-0 cursor-pointer grid-cell-transition relative ${
                            onVacation ? 'bg-blue-100/50 cursor-not-allowed' :
                            assigned ? 'bg-green-100/80 hover:bg-green-200' :
                            'hover:bg-blue-50'
                          }`}
                        >
                          <div className="h-20 w-full flex items-center justify-center">
                            {assigned && <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm ring-2 ring-white"></div>}
                            {onVacation && <div className="text-[9px] text-blue-400 font-bold uppercase rotate-45 pointer-events-none">O.O.O</div>}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid Legend */}
      <div className="flex items-center gap-6 text-sm text-gray-500 bg-white p-4 rounded-xl border">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Assigned</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-300 rounded-full"></div> Vacation</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Unscheduled Site</div>
        <div className="flex items-center gap-2"><AlertCircle size={16} className="text-orange-500" /> Double Booking</div>
      </div>
    </div>
  );
};

export default PlanningGrid;
