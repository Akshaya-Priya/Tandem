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

  useEffect(() => {
    async function fetchTasks() {
        const { data, error } = await supabase
          .from("tasks")
          .select(`
            id,
            description,
            status,
            created_at,
            event (name),
            user (name)
          `)
          .order("created_at", { ascending: true });
      
        if (error) {
          console.error("Error fetching tasks:", error);
        } else if (data) {
          console.log("Fetched data:", data); // Log the response to check data
          const formattedTasks = data.map((task: any) => ({
            ...task,
            event: task.event ? task.event[0] : undefined,
            user: task.user ? task.user[0] : undefined,
          }));
          setTasks(formattedTasks);
        }
        setLoading(false);
      }

    fetchTasks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
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
