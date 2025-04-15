
export interface TimeEntry {
  id: string;
  type: 'overtime' | 'absence';
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  description?: string;
  status: 'active' | 'completed' | 'planned';
}

export interface TimeBank {
  overtimeBalance: number; // in minutes
  absenceBalance: number; // in minutes
  netBalance: number; // in minutes
  entries: TimeEntry[];
}
