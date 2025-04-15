
import { useState, useEffect } from 'react';
import { TimeEntry, TimeBank } from '../types/time';
import { calculateBalances, generateId, calculateDuration } from '../utils/timeUtils';
import { useToast } from '@/hooks/use-toast';

// Initial timebank state
const initialTimeBank: TimeBank = {
  overtimeBalance: 0,
  absenceBalance: 0,
  netBalance: 0,
  entries: []
};

// Load data from localStorage
const loadTimeBank = (): TimeBank => {
  const saved = localStorage.getItem('timeBank');
  if (saved) {
    const parsed = JSON.parse(saved);
    
    // Convert string dates back to Date objects
    const entries = parsed.entries.map((entry: any) => ({
      ...entry,
      startTime: new Date(entry.startTime),
      endTime: entry.endTime ? new Date(entry.endTime) : undefined
    }));
    
    return {
      ...parsed,
      entries
    };
  }
  return initialTimeBank;
};

export const useTimeBank = () => {
  const [timeBank, setTimeBank] = useState<TimeBank>(loadTimeBank);
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const { toast } = useToast();

  // Save to localStorage whenever timeBank changes
  useEffect(() => {
    localStorage.setItem('timeBank', JSON.stringify(timeBank));
  }, [timeBank]);

  // Check for any active entries on load
  useEffect(() => {
    const active = timeBank.entries.find(entry => entry.status === 'active');
    if (active) {
      setActiveEntry(active);
    }
  }, []);

  // Start tracking overtime
  const startOvertime = (description?: string) => {
    if (activeEntry) {
      toast({
        title: "Active session in progress",
        description: "Please stop your current session before starting a new one.",
        variant: "destructive"
      });
      return;
    }

    const newEntry: TimeEntry = {
      id: generateId(),
      type: 'overtime',
      startTime: new Date(),
      duration: 0,
      description,
      status: 'active'
    };

    setActiveEntry(newEntry);
    
    const updatedEntries = [...timeBank.entries, newEntry];
    const updatedTimeBank = calculateBalances(updatedEntries);
    
    setTimeBank({
      ...updatedTimeBank,
      entries: updatedEntries
    });

    toast({
      title: "Overtime started",
      description: "Your overtime tracking has begun."
    });
  };

  // Stop tracking overtime
  const stopOvertime = () => {
    if (!activeEntry) {
      toast({
        title: "No active session",
        description: "There is no overtime session currently running.",
        variant: "destructive"
      });
      return;
    }

    const endTime = new Date();
    const duration = calculateDuration(activeEntry.startTime, endTime);

    const updatedEntry: TimeEntry = {
      ...activeEntry,
      endTime,
      duration,
      status: 'completed'
    };

    const updatedEntries = timeBank.entries.map(entry => 
      entry.id === activeEntry.id ? updatedEntry : entry
    );
    
    const updatedTimeBank = calculateBalances(updatedEntries);
    
    setTimeBank(updatedTimeBank);
    setActiveEntry(null);

    toast({
      title: "Overtime completed",
      description: `You've logged ${Math.round(duration / 60 * 10) / 10} hours of overtime.`
    });
  };

  // Add planned absence
  const addAbsence = (startTime: Date, endTime: Date, description?: string) => {
    const duration = calculateDuration(startTime, endTime);
    
    if (duration <= 0) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time.",
        variant: "destructive"
      });
      return;
    }

    if (timeBank.netBalance < duration) {
      toast({
        title: "Insufficient time balance",
        description: "You don't have enough overtime banked for this absence.",
        variant: "destructive"
      });
      // Still allow the user to add the absence, but warn them
    }

    const newEntry: TimeEntry = {
      id: generateId(),
      type: 'absence',
      startTime,
      endTime,
      duration,
      description,
      status: 'planned'
    };

    const updatedEntries = [...timeBank.entries, newEntry];
    const updatedTimeBank = calculateBalances(updatedEntries);
    
    setTimeBank(updatedTimeBank);

    toast({
      title: "Absence planned",
      description: `${Math.round(duration / 60 * 10) / 10} hours of absence has been added.`
    });
  };

  // Delete an entry
  const deleteEntry = (id: string) => {
    // Don't allow deleting an active entry
    if (activeEntry && activeEntry.id === id) {
      toast({
        title: "Cannot delete active session",
        description: "Please stop the current session before deleting it.",
        variant: "destructive"
      });
      return;
    }

    const updatedEntries = timeBank.entries.filter(entry => entry.id !== id);
    const updatedTimeBank = calculateBalances(updatedEntries);
    
    setTimeBank(updatedTimeBank);

    toast({
      title: "Entry deleted",
      description: "The time entry has been removed."
    });
  };

  // Edit an entry
  const editEntry = (updatedEntry: TimeEntry) => {
    // Don't allow editing an active entry
    if (activeEntry && activeEntry.id === updatedEntry.id) {
      toast({
        title: "Cannot edit active session",
        description: "Please stop the current session before editing it.",
        variant: "destructive"
      });
      return;
    }

    const updatedEntries = timeBank.entries.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    );
    
    const updatedTimeBank = calculateBalances(updatedEntries);
    
    setTimeBank(updatedTimeBank);

    toast({
      title: "Entry updated",
      description: "The time entry has been modified."
    });
  };

  return {
    timeBank,
    activeEntry,
    startOvertime,
    stopOvertime,
    addAbsence,
    deleteEntry,
    editEntry
  };
};
