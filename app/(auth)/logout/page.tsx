"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function LogoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error("Failed to log out. Please try again.");
      }

      // Ensure no residual session remains
      await supabase.auth.getSession();

      toast({
        title: "Success",
        description: "You have been logged out.",
      });

      // Redirect to login page after logout
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-bold">Are you sure you want to log out?</h1>
        <div className="space-x-4">
          <Button variant="default" onClick={handleLogout} disabled={isLoading}>
            {isLoading ? "Logging out..." : "Yes, Logout"}
          </Button>
          <Button variant="secondary" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
