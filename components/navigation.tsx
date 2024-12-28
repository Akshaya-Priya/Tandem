"use client"

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  Calendar,
  CheckSquare,
  MessageSquare,
  ClipboardList,
  UserCog,
  Waypoints,
} from "lucide-react";

const navigation = [
  { name: "Users", href: "/users", icon: Users },
  { name: "Organizers", href: "/organizers", icon: UserCog },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Participation", href: "/participation", icon: ClipboardList },
  { name: "Feedback", href: "/feedback", icon: MessageSquare },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border/5 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-1">
            <Waypoints className="h-9 w-9 text-white/90 mr-1" />
            <Link 
              href="/" 
              className="text-3xl font-bold bg-clip-text text-white bg-gradient-to-r from-accent to-primary"
            >
              Tandem
            </Link>
          </div>
          
  <div className="flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    pathname === item.href
                      ? "bg-accent/10 text-accent-foreground"
                      : "text-white hover:bg-accent/5 hover:text-accent-foreground",
                    "group relative"
                  )}
                >
                  <Icon className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    "group-hover:scale-110"
                  )} />
                  <span className="hidden md:block">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
