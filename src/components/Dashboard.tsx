
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, TimerOff, ClockAlert } from "lucide-react";
import { formatMinutes } from '../utils/timeUtils';
import TimeTracker from './TimeTracker';
import AbsenceForm from './AbsenceForm';
import TimeEntryList from './TimeEntryList';
import { useTimeBank } from '../hooks/useTimeBank';

const Dashboard = () => {
  const { timeBank, activeEntry, startOvertime, stopOvertime, addAbsence, deleteEntry } = useTimeBank();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Time Bank Dashboard</h1>
          <p className="text-muted-foreground">Track and manage your overtime and absences</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {activeEntry ? (
            <Button 
              onClick={() => stopOvertime()} 
              variant="destructive" 
              className="flex items-center"
            >
              <TimerOff className="mr-2 h-4 w-4" />
              Stop Overtime
            </Button>
          ) : (
            <Button 
              onClick={() => startOvertime()} 
              variant="default" 
              className="bg-secondary hover:bg-secondary/90 flex items-center"
            >
              <Clock className="mr-2 h-4 w-4" />
              Start Overtime
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Overtime Balance
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMinutes(timeBank.overtimeBalance)}</div>
            <p className="text-xs text-muted-foreground">Total overtime accumulated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Absence Balance
            </CardTitle>
            <Calendar className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMinutes(timeBank.absenceBalance)}</div>
            <p className="text-xs text-muted-foreground">Total absences planned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Net Balance
            </CardTitle>
            <ClockAlert className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMinutes(timeBank.netBalance)}</div>
            <p className="text-xs text-muted-foreground">Available time balance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TimeTracker activeEntry={activeEntry} />
        <AbsenceForm addAbsence={addAbsence} netBalance={timeBank.netBalance} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time History</CardTitle>
          <CardDescription>All your overtime and absence entries</CardDescription>
        </CardHeader>
        <CardContent>
          <TimeEntryList entries={timeBank.entries} onDelete={deleteEntry} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
