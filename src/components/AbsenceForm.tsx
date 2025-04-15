
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { calculateDuration, formatMinutes } from '../utils/timeUtils';

interface AbsenceFormProps {
  addAbsence: (startTime: Date, endTime: Date, description?: string) => void;
  netBalance: number;
}

const AbsenceForm: React.FC<AbsenceFormProps> = ({ addAbsence, netBalance }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [description, setDescription] = useState<string>("");
  const [calculatedDuration, setCalculatedDuration] = useState<number>(480); // 8 hours in minutes
  
  const handleTimeChange = () => {
    if (!date) return;
    
    const start = new Date(date);
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    start.setHours(startHours, startMinutes, 0, 0);
    
    const end = new Date(date);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    end.setHours(endHours, endMinutes, 0, 0);
    
    const duration = calculateDuration(start, end);
    setCalculatedDuration(duration > 0 ? duration : 0);
  };
  
  // Update duration calculation when inputs change
  React.useEffect(() => {
    handleTimeChange();
  }, [date, startTime, endTime]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) return;
    
    const start = new Date(date);
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    start.setHours(startHours, startMinutes, 0, 0);
    
    const end = new Date(date);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    end.setHours(endHours, endMinutes, 0, 0);
    
    addAbsence(start, end, description);
    
    // Reset form
    setDescription("");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Absence</CardTitle>
        <CardDescription>Use your banked time for planned absences</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Reason for absence"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span>Duration: {formatMinutes(calculatedDuration)}</span>
            <span className={cn(
              "font-medium",
              calculatedDuration > netBalance ? "text-destructive" : "text-secondary"
            )}>
              Balance: {formatMinutes(netBalance)}
            </span>
          </div>
          
          <Button type="submit" className="w-full">Schedule Absence</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AbsenceForm;
