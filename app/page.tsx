"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CheckSquare, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";  // Import the Supabase client

export default function Home() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeEvents, setActiveEvents] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [totalFeedback, setTotalFeedback] = useState(0);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id')
        .eq('status', true);

      if (usersError) {
        console.error("Error fetching users:", usersError);
      } else {
        setTotalUsers(usersData.length);
      }

      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id')
        .eq('status', 'Active');

      if (eventsError) {
        console.error("Error fetching events:", eventsError);
      } else {
        setActiveEvents(eventsData.length);
      }

      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('id')
        .eq('status', 'Pending');

      if (tasksError) {
        console.error("Error fetching tasks:", tasksError);
      } else {
        setPendingTasks(tasksData.length);
      }

      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('id');

      if (feedbackError) {
        console.error("Error fetching feedback:", feedbackError);
      } else {
        setTotalFeedback(feedbackData.length);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to Tandem</h1>
      <p className="text-muted-foreground">
        Manage volunteers and events efficiently with our comprehensive system.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFeedback}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
