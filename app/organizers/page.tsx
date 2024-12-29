"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  created_at: string;
}

interface Task {
  id: string;
  description: string;
  event_id: string;
  assigned_to: string;
  status: string;
  created_at: string;
}

interface LocalUser {
  id: string;
  name: string;
}

export default function OrganizersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [eventDetails, setEventDetails] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
  });
  const [taskDetails, setTaskDetails] = useState({
    description: "",
    eventId: "",
    assignedTo: "",
  });
  const [users, setUsers] = useState<LocalUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkRole() {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.push("/login");
        return;
      }

      const { user } = data.session;
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      setIsOrganizer(profile?.role === "organizer");
      setLoading(false);
    }

    checkRole();
  }, [router]);

  useEffect(() => {
    async function fetchData() {
      if (!isOrganizer) return;

      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: usersData } = await supabase
        .from("users")
        .select("id, name");

      const { data: tasksData } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      setEvents(eventsData || []);
      setUsers(usersData || []);
      setTasks(tasksData || []);
    }

    fetchData();
  }, [isOrganizer]);

  if (loading) return <div>Loading...</div>;
  if (!isOrganizer) return <div>You are not an organizer.</div>;

  async function handleAddEvent() {
    const { error } = await supabase.from("events").insert([eventDetails]);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to add event. Please check your input.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Event added successfully!",
    });

    const { data: updatedEvents } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    setEvents(updatedEvents || []);
    setEventDetails({ name: "", description: "", date: "", location: "" });
  }

  async function handleAssignTask() {
    if (!taskDetails.description || !taskDetails.eventId || !taskDetails.assignedTo) {
      toast({
        title: "Error",
        description: "Please fill in all fields before assigning a task.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("tasks").insert({
      description: taskDetails.description,
      event_id: taskDetails.eventId,
      assigned_to: taskDetails.assignedTo,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to assign the task. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Task assigned successfully!",
    });

    const { data: updatedTasks } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    setTasks(updatedTasks || []);
    setTaskDetails({ description: "", eventId: "", assignedTo: "" });
  }

  return (
    <div className="space-y-8 px-6 py-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-semibold text-center text-primary">Organizer Dashboard</h1>

      {/* Add Event Section */}
      <div className="space-y-6 bg-card p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold">Add Event</h2>
        <div className="space-y-4">
          <Input
            placeholder="Event Name"
            value={eventDetails.name}
            onChange={(e) =>
              setEventDetails({ ...eventDetails, name: e.target.value })
            }
          />
          <Input
            placeholder="Description"
            value={eventDetails.description}
            onChange={(e) =>
              setEventDetails({ ...eventDetails, description: e.target.value })
            }
          />
          <Input
            type="date"
            value={eventDetails.date}
            onChange={(e) =>
              setEventDetails({ ...eventDetails, date: e.target.value })
            }
          />
          <Input
            placeholder="Location"
            value={eventDetails.location}
            onChange={(e) =>
              setEventDetails({ ...eventDetails, location: e.target.value })
            }
          />
          <Button onClick={handleAddEvent}>Add Event</Button>
        </div>
      </div>

{/* Assign Task Section */}
<div className="space-y-6 bg-card p-6 rounded-lg shadow-lg">
  <h2 className="text-2xl font-semibold text-primary">Assign Task</h2>
  <div className="space-y-4">
    {/* Task Description */}
    <div className="flex flex-col space-y-1">
      <label htmlFor="taskDescription" className="text-sm font-medium text-muted">
        Task Description
      </label>
      <Input
        id="taskDescription"
        placeholder="Enter task description"
        value={taskDetails.description}
        onChange={(e) =>
          setTaskDetails({ ...taskDetails, description: e.target.value })
        }
      />
    </div>

    {/* Event Selection */}
    <div className="flex flex-col space-y-1">
      <label htmlFor="eventSelect" className="text-sm font-medium text-muted">
        Select Event
      </label>
      <select
        id="eventSelect"
        className="rounded-md border border-input bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
        value={taskDetails.eventId}
        onChange={(e) =>
          setTaskDetails({ ...taskDetails, eventId: e.target.value })
        }
      >
        <option value="" disabled>
          Select Event
        </option>
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.name}
          </option>
        ))}
      </select>
    </div>

      {/* User Assignment */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="userSelect" className="text-sm font-medium text-muted">
          Assign to User
        </label>
        <select
          id="userSelect"
          className="rounded-md border border-input bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          value={taskDetails.assignedTo}
          onChange={(e) =>
            setTaskDetails({ ...taskDetails, assignedTo: e.target.value })
          }
        >
          <option value="" disabled>
            Select User
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* Assign Task Button */}
      <div className="flex justify-front">
        <Button onClick={handleAssignTask} className="w-full md:w-auto">
          Assign Task
        </Button>
      </div>
    </div>
  </div>

    </div>
  );
}
