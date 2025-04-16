
import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, BarChart } from "@/components/ui/chart";
import { Clock, Calendar, TimerOff, ClockAlert, BarChart as BarChartIcon, Timer } from "lucide-react";
import { formatMinutes } from '../utils/timeUtils';
import TimeTracker from '../components/TimeTracker';
import AbsenceForm from '../components/AbsenceForm';
import TimeEntryList from '../components/TimeEntryList';
import { useTimeBank } from '../hooks/useTimeBank';

// Sample data for charts - will be replaced with actual data later
const chartConfig = {
  overtime: { theme: { light: "#0ea5e9", dark: "#0ea5e9" } },
  absence: { theme: { light: "#ef4444", dark: "#ef4444" } },
  balance: { theme: { light: "#9b87f5", dark: "#9b87f5" } },
};

const chartData = [
  { date: "Jan", overtime: 10, absence: 4, balance: 6 },
  { date: "Feb", overtime: 15, absence: 7, balance: 8 },
  { date: "Mar", overtime: 8, absence: 12, balance: -4 },
  { date: "Apr", overtime: 20, absence: 10, balance: 10 },
  { date: "May", overtime: 25, absence: 8, balance: 17 },
  { date: "Jun", overtime: 18, absence: 15, balance: 3 },
];

const Dashboard = () => {
  const { timeBank, activeEntry, startOvertime, stopOvertime, addAbsence, deleteEntry } = useTimeBank();
  const [isAdmin] = useState(false); // This would be replaced with actual auth logic

  return (
    <PageLayout 
      title="Dashboard" 
      description="Track and manage your overtime and absences"
      isAdmin={isAdmin}
    >
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Status
              </CardTitle>
              <Timer className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-medium">
                {activeEntry ? (
                  <span className="text-green-500 flex items-center gap-2">
                    <div className="pulse-dot text-green-500"></div>
                    Tracking
                  </span>
                ) : (
                  <span className="text-muted-foreground">Inactive</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Current tracking status</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Card>
          <CardHeader>
            <CardTitle>Time Balance Trends</CardTitle>
            <CardDescription>Your overtime and absence history</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="area">
              <TabsList className="mb-4">
                <TabsTrigger value="area">Area Chart</TabsTrigger>
                <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              </TabsList>
              
              <TabsContent value="area" className="h-[300px]">
                <AreaChart
                  config={chartConfig}
                  data={chartData}
                  index="date"
                  categories={["overtime", "absence", "balance"]}
                  colors={["sky", "rose", "violet"]}
                  valueFormatter={(value) => `${value}h`}
                  className="h-full"
                />
              </TabsContent>
              
              <TabsContent value="bar" className="h-[300px]">
                <BarChart
                  config={chartConfig}
                  data={chartData}
                  index="date"
                  categories={["overtime", "absence", "balance"]}
                  colors={["sky", "rose", "violet"]}
                  valueFormatter={(value) => `${value}h`}
                  className="h-full"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Time Tracking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TimeTracker activeEntry={activeEntry} />
          <AbsenceForm addAbsence={addAbsence} netBalance={timeBank.netBalance} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
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

        {/* Time History */}
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
    </PageLayout>
  );
};

export default Dashboard;
