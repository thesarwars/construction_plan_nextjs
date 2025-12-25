
import { AppState } from './types';

export const initialData: AppState = {
  employees: [
    { id: 'e1', name: 'John Miller', skills: ['Concrete', 'Welding'], vacationDays: ['2023-12-25', '2025-05-15'] },
    { id: 'e2', name: 'Sarah Schmidt', skills: ['Electrical', 'Wiring'], vacationDays: [] },
    { id: 'e3', name: 'Mike Weber', skills: ['Plumbing', 'HVAC'], vacationDays: [] },
    { id: 'e4', name: 'Anna Braun', skills: ['Painting', 'Finishing'], vacationDays: ['2025-06-10'] },
    { id: 'e5', name: 'Lukas Wagner', skills: ['Heavy Lifting', 'Forklift'], vacationDays: [] },
  ],
  cars: [
    { id: 'C01', licensePlate: 'B-CP-101' },
    { id: 'C02', licensePlate: 'B-CP-102' },
    { id: 'C03', licensePlate: 'B-CP-103' },
  ],
  sites: [
    { 
      id: 'S101', 
      name: 'Riverfront Plaza', 
      address: 'Friedrichstraße 12, Berlin', 
      priority: 5, 
      permanentComments: 'Safety vest mandatory. Ask for Mr. Klein.',
      siteManager: 'Robert Smith',
      requiredSkills: ['Concrete']
    },
    { 
      id: 'S202', 
      name: 'Eco Village Ph2', 
      address: 'Sonnenallee 45, Berlin', 
      priority: 3, 
      permanentComments: 'Key code: 1234. No loud noise before 8am.',
      siteManager: 'Julia Berg',
      requiredSkills: ['Electrical']
    },
    { 
      id: 'S0', 
      name: 'Hidden Project', 
      address: 'Top Secret', 
      priority: 0, 
      permanentComments: 'Do not schedule yet.',
      siteManager: 'None',
      requiredSkills: []
    }
  ],
  schedules: {}
};
