
import React from 'react';
import { TimeEntry } from '../types/time';
import { formatDate, formatTime, formatMinutes } from '../utils/timeUtils';
import { Clock, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimeEntryListProps {
  entries: TimeEntry[];
  onDelete: (id: string) => void;
}

const TimeEntryList: React.FC<TimeEntryListProps> = ({ entries, onDelete }) => {
  // Sort entries by date, most recent first
  const sortedEntries = [...entries].sort((a, b) => 
    b.startTime.getTime() - a.startTime.getTime()
  );

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="mx-auto h-12 w-12 opacity-20 mb-2" />
        <p>No time entries yet. Start tracking overtime or plan an absence.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedEntries.map((entry) => (
        <div 
          key={entry.id} 
          className={cn(
            "flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border",
            entry.status === 'active' ? "border-primary bg-primary/5" : 
            entry.type === 'overtime' ? "border-secondary bg-secondary/5" : "border-destructive bg-destructive/5"
          )}
        >
          <div className="flex items-start space-x-3">
            <div className={cn(
              "mt-1 rounded-full p-1",
              entry.status === 'active' ? "bg-primary/10 text-primary" : 
              entry.type === 'overtime' ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"
            )}>
              {entry.type === 'overtime' ? 
                <Clock className="h-4 w-4" /> : 
                <Calendar className="h-4 w-4" />
              }
            </div>
            <div>
              <div className="font-medium">
                {entry.description || (entry.type === 'overtime' ? 'Overtime work' : 'Planned absence')}
                {entry.status === 'active' && (
                  <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(entry.startTime)}
                {entry.endTime && ` - ${formatTime(entry.endTime)}`}
              </div>
            </div>
          </div>
          
          <div className="flex items-center mt-2 sm:mt-0">
            <div className={cn(
              "text-sm font-medium mr-4",
              entry.type === 'overtime' ? "text-secondary" : "text-destructive"
            )}>
              {entry.type === 'overtime' ? '+' : '-'}{formatMinutes(entry.duration)}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(entry.id)}
              disabled={entry.status === 'active'}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Delete</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeEntryList;
