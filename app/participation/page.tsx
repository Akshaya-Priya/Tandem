"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function VolunteerParticipationPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Pending"); // Default status: Pending
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Fetch events and current user
  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase.from("events").select("id, name");
      if (error) {
        console.error("Error fetching events:", error);
        setError("There was an error fetching events. Please try again.");
      } else {
        setEvents(data || []);
      }
    }

    async function fetchUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    }

    fetchEvents();
    fetchUser();
  }, []);

  // Handle volunteer participation submission
  const handleSubmit = async () => {
    if (!selectedEvent) {
      setError("Please select an event to volunteer for.");
      return;
    }

    if (!user) {
      setError("You need to be logged in to participate.");
      return;
    }

    const { data, error } = await supabase.from("volunteer_participation").insert([
      {
        volunteer_id: user.id, // Use the logged-in volunteer's ID here
        event_id: selectedEvent,
        status: status,
      },
    ]);

    if (error) {
      console.error("Error submitting participation:", error);
      setError("There was an error submitting your participation. Please try again.");
    } else {
      console.log("Participation submitted:", data);
      setSuccess(true); // Show success message
      setError(null); // Clear any existing errors
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-center text-foreground mb-4">Volunteer for Event</h1>

      {/* Error message */}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {/* Success message */}
      {success && <div className="text-green-500 text-center mb-4">You have successfully signed up as a volunteer!</div>}

      <div className="mb-4">
        <label htmlFor="event" className="block text-lg font-semibold text-foreground">Select Event</label>
        <Select value={selectedEvent ?? undefined} onValueChange={(value) => setSelectedEvent(value)}>
          <SelectTrigger className="w-full border border-border rounded-md p-2 mt-2 bg-card text-foreground hover:bg-hover-accent focus:ring-2 focus:ring-ring">
            {selectedEvent ? events.find(event => event.id === selectedEvent)?.name : "Select an Event"}
          </SelectTrigger>
          <SelectContent>
            {events.map((event) => (
              <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        className="w-full py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-hover-accent transition"
      >
        Volunteer
      </Button>
    </div>
  );
}
