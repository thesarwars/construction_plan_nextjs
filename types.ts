
export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export interface Employee {
  id: string;
  name: string;
  skills: string[];
  vacationDays: string[]; // ISO dates
}

export interface Car {
  id: string;
  licensePlate: string;
}

export interface ConstructionSite {
  id: string;
  name: string;
  address: string;
  priority: number; // 0-5
  permanentComments: string;
  siteManager: string;
  requiredSkills: string[];
}

export interface DailyAssignment {
  employeeId: string;
  siteId: string;
}

export interface SitePlan {
  siteId: string;
  comeToWarehouse: boolean;
  dailyComment: string;
  assignedCarIds: string[];
}

export interface DaySchedule {
  date: string; // ISO date
  assignments: DailyAssignment[];
  sitePlans: SitePlan[];
}

export interface AppState {
  employees: Employee[];
  cars: Car[];
  sites: ConstructionSite[];
  schedules: Record<string, DaySchedule>; // keyed by ISO date
}
