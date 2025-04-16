
export interface TimeEntry {
  id: string;
  type: 'overtime' | 'absence';
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  description?: string;
  status: 'active' | 'completed' | 'planned';
  userId?: string; // Added for multi-user support
}

export interface TimeBank {
  overtimeBalance: number; // in minutes
  absenceBalance: number; // in minutes
  netBalance: number; // in minutes
  entries: TimeEntry[];
  userId?: string; // Added for multi-user support
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface Report {
  id: string;
  userId: string;
  month: number;
  year: number;
  generatedAt: Date;
  sentAt?: Date;
  netBalance: number;
  entries: TimeEntry[];
}

export interface TimeBankStats {
  totalOvertimeHours: number;
  totalAbsenceHours: number;
  netBalanceHours: number;
  activeDays: number;
  longestStreak: number;
  averageOvertimePerDay: number;
}
