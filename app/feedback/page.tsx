"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function FeedbackForm() {
  const [events, setEvents] = useState<any[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [comments, setComments] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  // Fetch events to display in the dropdown
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

  // Handle feedback submission
  const handleSubmit = async () => {
    if (!rating || !selectedEvent) {
      setError("Please provide a rating and select an event.");
      return;
    }

    if (!user) {
      setError("You need to be logged in to submit feedback.");
      return;
    }

    const { data, error } = await supabase.from("feedback").insert([
      {
        volunteer_id: user.id, // Use the logged-in volunteer's ID here
        event_id: selectedEvent,
        rating: rating,
        comments: comments,
      },
    ]);

    if (error) {
      console.error("Error submitting feedback:", error);
      setError("There was an error submitting your feedback. Please try again.");
    } else {
      console.log("Feedback submitted:", data);
      setSuccess(true); // Show success message
      setError(null); // Clear any existing errors
    }
  };

  // Handle Enter key press to submit the form
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-center text-foreground mb-4">Volunteer Feedback</h1>

      {/* Error message */}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {/* Success message */}
      {success && <div className="text-green-500 text-center mb-4">Feedback submitted successfully!</div>}

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

      <div className="mb-4">
        <label htmlFor="rating" className="block text-lg font-semibold text-foreground">Rating (1-5)</label>
        <Select value={rating?.toString() ?? undefined} onValueChange={(value) => setRating(Number(value))}>
          <SelectTrigger className="w-full border border-border rounded-md p-2 mt-2 bg-card text-foreground hover:bg-hover-accent focus:ring-2 focus:ring-ring">
            {rating ? rating.toString() : "Select a Rating"}
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((rate) => (
              <SelectItem key={rate} value={rate.toString()}>{rate}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <label htmlFor="comments" className="block text-lg font-semibold text-foreground">Comments</label>
        <Textarea
          id="comments"
          value={comments}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
          placeholder="Share your feedback or suggestions"
          rows={4}
          className="w-full border border-border rounded-md p-2 mt-2 bg-card text-foreground placeholder:text-muted focus:ring-2 focus:ring-ring"
        />
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-hover-accent transition"
      >
        Submit Feedback
      </Button>
    </div>
  );
}
