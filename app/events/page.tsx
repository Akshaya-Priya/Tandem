"use client";

import { useEffect, useState } from "react";
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

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select(`id, name, description, date, location, status, created_at, organizer_id (name)`)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching events:", error);
      } else if (data) {
        setEvents(data);
      }
      setLoading(false);
    }

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Events</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Organizer</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.name}</TableCell>
              <TableCell>{event.description || "N/A"}</TableCell>
              <TableCell>{format(new Date(event.date), "PPP")}</TableCell>
              <TableCell>{event.location || "N/A"}</TableCell>
              <TableCell>
                <Badge variant={event.status === "Completed" ? "default" : "secondary"}>
                  {event.status}
                </Badge>
              </TableCell>
              <TableCell>{event.organizer_id?.name || "N/A"}</TableCell>
              <TableCell>{format(new Date(event.created_at), "PPP")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
