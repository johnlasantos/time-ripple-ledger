
import { TimeEntry, TimeBank } from "../types/time";

// Format minutes to hours and minutes (e.g. 90 -> "1h 30m")
export const formatMinutes = (minutes: number): string => {
  if (minutes === 0) return "0h";
  
  const hours = Math.floor(Math.abs(minutes) / 60);
  const mins = Math.abs(minutes) % 60;
  
  const sign = minutes < 0 ? "-" : "";
  const hoursStr = hours > 0 ? `${hours}h` : "";
  const minsStr = mins > 0 ? `${mins}m` : "";
  const separator = hours > 0 && mins > 0 ? " " : "";
  
  return `${sign}${hoursStr}${separator}${minsStr}`;
};

// Calculate duration between two dates in minutes
export const calculateDuration = (start: Date, end: Date): number => {
  return Math.round((end.getTime() - start.getTime()) / 60000);
};

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Calculate the time bank balances
export const calculateBalances = (entries: TimeEntry[]): TimeBank => {
  let overtimeBalance = 0;
  let absenceBalance = 0;
  
  entries.forEach(entry => {
    if (entry.status === 'completed' || entry.status === 'planned') {
      if (entry.type === 'overtime') {
        overtimeBalance += entry.duration;
      } else if (entry.type === 'absence') {
        absenceBalance += entry.duration;
      }
    }
  });
  
  const netBalance = overtimeBalance - absenceBalance;
  
  return {
    overtimeBalance,
    absenceBalance,
    netBalance,
    entries
  };
};

// Get a readable date string
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Get a simplified time string (HH:MM)
export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
