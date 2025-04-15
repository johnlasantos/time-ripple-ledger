
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";
import { TimeEntry } from '../types/time';
import { formatMinutes, calculateDuration } from '../utils/timeUtils';

interface TimeTrackerProps {
  activeEntry: TimeEntry | null;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ activeEntry }) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  
  // Update elapsed time every second if there's an active entry
  useEffect(() => {
    if (!activeEntry) {
      setElapsedTime(0);
      setDescription('');
      return;
    }

    setDescription(activeEntry.description || '');
    
    const interval = setInterval(() => {
      const now = new Date();
      const duration = calculateDuration(activeEntry.startTime, now);
      setElapsedTime(duration);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeEntry]);

  const formatElapsedTime = () => {
    if (!activeEntry) return "00:00:00";
    
    const totalSeconds = Math.floor(elapsedTime / 60 * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Tracker</CardTitle>
        <CardDescription>Track your overtime hours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-mono font-bold tracking-wider">
              {formatElapsedTime()}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {activeEntry 
                ? `Started at ${activeEntry.startTime.toLocaleTimeString()}`
                : "Start tracking to begin accumulating time"
              }
            </p>
          </div>

          <div className="relative">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you working on?"
              disabled={!activeEntry}
              className="pr-10"
            />
            <Clock className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {activeEntry && (
            <div className="flex items-center">
              <div className="pulse-dot text-green-500 mr-2"></div>
              <span>Currently tracking</span>
            </div>
          )}
        </div>
        <div className="text-sm font-medium">
          {activeEntry ? formatMinutes(elapsedTime) : ''}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TimeTracker;
