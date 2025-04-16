
import { TimeEntry, TimeBank, TimeBankStats } from "../types/time";

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

// Format a date as dd/mm/yyyy
export const formatDateShort = (date: Date): string => {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

// Calculate statistics for user timebank
export const calculateStats = (timeBank: TimeBank): TimeBankStats => {
  const { entries, overtimeBalance, absenceBalance, netBalance } = timeBank;

  // Convert to hours for stats
  const totalOvertimeHours = overtimeBalance / 60;
  const totalAbsenceHours = absenceBalance / 60;
  const netBalanceHours = netBalance / 60;

  // Get unique days with activity
  const activeDays = new Set(
    entries.map(entry => 
      new Date(entry.startTime).toISOString().split('T')[0]
    )
  ).size;

  // Calculate longest streak
  const sortedDates = entries
    .map(entry => new Date(entry.startTime).toISOString().split('T')[0])
    .sort();
  
  let currentStreak = 1;
  let longestStreak = 1;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i-1]);
    const currDate = new Date(sortedDates[i]);
    
    // If it's the next day, continue the streak
    if (currDate.getTime() - prevDate.getTime() === 86400000) {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else if (currDate.getTime() !== prevDate.getTime()) {
      // Different day but not consecutive
      currentStreak = 1;
    }
  }

  // Calculate average overtime per active day (if there are active days)
  const averageOvertimePerDay = activeDays > 0 ? totalOvertimeHours / activeDays : 0;

  return {
    totalOvertimeHours,
    totalAbsenceHours,
    netBalanceHours,
    activeDays,
    longestStreak,
    averageOvertimePerDay
  };
};

// Generate a monthly report text
export const generateReportText = (
  userName: string,
  entries: TimeEntry[],
  netBalance: number
): string => {
  const lines = [userName];
  
  // Sort entries by date
  const sortedEntries = [...entries].sort((a, b) => 
    a.startTime.getTime() - b.startTime.getTime()
  );
  
  // Add entry lines
  sortedEntries.forEach(entry => {
    const date = formatDateShort(entry.startTime);
    const startTime = formatTime(entry.startTime);
    const endTime = entry.endTime ? formatTime(entry.endTime) : 'ongoing';
    const balance = entry.type === 'overtime' ? `+${formatMinutes(entry.duration)}` : `-${formatMinutes(entry.duration)}`;
    
    lines.push(`${date} - ${startTime} to ${endTime} ~ ${balance}`);
  });
  
  // Add total
  lines.push(`Total: ${netBalance >= 0 ? '+' : ''}${formatMinutes(netBalance)}`);
  
  return lines.join('\n');
};
