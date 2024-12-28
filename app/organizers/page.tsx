"use client";

import { useEffect, useState } from "react";
import { Organizer, User } from "@/lib/types";
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

export default function OrganizersPage() {
  const [organizers, setOrganizers] = useState<(Organizer & { user: User })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrganizers() {
      const { data, error } = await supabase
        .from("organizers")
        .select(`
          *,
          user:users(*)
        `)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrganizers(data);
      }
      setLoading(false);
    }

    fetchOrganizers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Organizers</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizers.map((organizer) => (
            <TableRow key={organizer.id}>
              <TableCell>{organizer.user.name}</TableCell>
              <TableCell>{organizer.user.email}</TableCell>
              <TableCell>{organizer.specialization}</TableCell>
              <TableCell>
                <Badge variant={organizer.user.status === "active" ? "default" : "secondary"}>
                  {organizer.user.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}