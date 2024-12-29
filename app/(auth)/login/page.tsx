"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; // Ensure supabase is initialized here
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if the user is already logged in and redirect if so
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        checkUserRoleAndRedirect(session.user.id);
      }
    };
    checkSession();

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        checkUserRoleAndRedirect(session.user.id);
      }
    });

    return () => {
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, []);

  // Check user role and redirect accordingly
  async function checkUserRoleAndRedirect(userId: string) {
    try {
      const { data: userData, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      if (error || !userData) {
        throw new Error("Unable to fetch user role.");
      }

      // Redirect based on user role
      switch (userData.role) {
        case "organizer":
          router.push("/organizers");
          break;
        case "volunteer":
          router.push("/");
          break;
        case "admin":
          router.push("/admin");
          break;
        default:
          router.push("/");
          break;
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      toast({
        title: "Error",
        description: "Unable to determine user role.",
        variant: "destructive",
      });
    }
  }

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw new Error("Invalid email or password.");
      }

      // If login is successful, check user role and redirect
      if (data.user) {
        await checkUserRoleAndRedirect(data.user.id);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link
              href="/register"
              className="text-foreground hover:text-accent transition-colors duration-200"
            >
              Don't have an account? Sign up
            </Link>
          </div>
          <div className="mt-2 text-center text-sm">
            <Link
              href="/reset-password"
              className="text-foreground hover:text-accent transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
