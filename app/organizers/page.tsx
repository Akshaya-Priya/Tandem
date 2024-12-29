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
  eventId: string;
  assignedTo: string;
}

interface LocalUser {
  id: string;
  name: string;
}

export default function OrganizersPage() {
  const router = useRouter();
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]); // Added state for tasks
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

  // Check if user is an organizer
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

  // Fetch events and users
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

      setEvents(eventsData as Event[] || []);
      setUsers(usersData as LocalUser[] || []);
    }

    fetchData();
  }, [isOrganizer]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isOrganizer) {
    return <div>You are not an organizer.</div>;
  }

  // Add event
  async function handleAddEvent() {
    const { error } = await supabase.from("events").insert([eventDetails]);
    if (!error) {
      setEventDetails({ name: "", description: "", date: "", location: "" });
      const { data: updatedEvents } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });
      setEvents(updatedEvents as Event[] || []);
    }
  }

  // Assign task
  async function handleAssignTask() {
    const { error } = await supabase.from("tasks").insert([taskDetails]);
    if (!error) {
      setTaskDetails({ description: "", eventId: "", assignedTo: "" });
      const { data: updatedTasks } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });
      setTasks(updatedTasks as Task[] || []);
    }
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
            className="border-gray-300"
          />
          <Input
            placeholder="Description"
            value={eventDetails.description}
            onChange={(e) =>
              setEventDetails({ ...eventDetails, description: e.target.value })
            }
            className="border-gray-300"
          />
          <Input
            type="date"
            value={eventDetails.date}
            onChange={(e) =>
              setEventDetails({ ...eventDetails, date: e.target.value })
            }
            className="border-gray-300"
          />
          <Input
            placeholder="Location"
            value={eventDetails.location}
            onChange={(e) =>
              setEventDetails({ ...eventDetails, location: e.target.value })
            }
            className="border-gray-300"
          />
          <Button onClick={handleAddEvent} className="w-full bg-primary hover:bg-primary-dark text-white">
            Add Event
          </Button>
        </div>
      </div>

      {/* Assign Task Section */}
      <div className="space-y-6 bg-card p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold">Assign Task</h2>
        <div className="space-y-4">
          <Input
            placeholder="Task Description"
            value={taskDetails.description}
            onChange={(e) =>
              setTaskDetails({ ...taskDetails, description: e.target.value })
            }
            className="border-gray-300"
          />
          <select
            className="block w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={taskDetails.eventId}
            onChange={(e) =>
              setTaskDetails({ ...taskDetails, eventId: e.target.value })
            }
          >
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
          <select
            className="block w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={taskDetails.assignedTo}
            onChange={(e) =>
              setTaskDetails({ ...taskDetails, assignedTo: e.target.value })
            }
          >
            <option value="">Assign to User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <Button onClick={handleAssignTask} className="w-full bg-primary hover:bg-primary-dark text-white">
            Assign Task
          </Button>
        </div>
      </div>
    </div>
  );
}
