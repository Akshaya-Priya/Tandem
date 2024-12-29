"use client";

import { useEffect, useState } from "react";
import { Task } from "@/lib/types";
import { supabase } from "@/lib/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Added error state for better handling

  useEffect(() => {
    async function fetchTasks() {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select(`
            id,
            description,
            status,
            created_at,
            event: events!inner(
              name
            ),
            user: users!inner(
              name
            )
          `)
          .order("created_at", { ascending: true });

        if (error) {
          throw error; // Throw error if something goes wrong
        }

        console.log("Fetched data:", data); // Log the fetched data to inspect

        setTasks(data); 
      } catch (error: any) {
        console.error("Error fetching tasks:", error);
        setError("There was an error fetching tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.description}</TableCell>
              <TableCell>{task.event?.name || "N/A"}</TableCell>
              <TableCell>{task.user?.name || "Unassigned"}</TableCell>
              <TableCell>
                <Badge variant={task.status === "complete" ? "default" : "secondary"}>
                  {task.status}
                </Badge>
              </TableCell>
              <TableCell>{format(new Date(task.created_at), "PPP")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
