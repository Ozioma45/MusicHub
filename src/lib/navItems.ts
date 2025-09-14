// lib/navItems.ts
import { Layout, User, Settings, Search } from "lucide-react";

export const musicianNav = [
  { label: "Dashboard", href: "/dashboard/musician", icon: Layout },
  { label: "View Profile", href: "/dashboard/musician/profile", icon: User },
  { label: "Edit Profile", href: "/dashboard/musician/edit", icon: Settings },
  {
    label: "Discover Musicians",
    href: "/dashboard/musician/explore",
    icon: Search,
  },
];

export const bookerNav = [
  { label: "Dashboard", href: "/dashboard/booker", icon: Layout },
  { label: "View Profile", href: "/dashboard/booker/profile", icon: User },
  /*   { label: "My Bookings", href: "/dashboard/booker/bookings", icon: Calendar }, */
  { label: "Edit Profile", href: "/dashboard/booker/edit", icon: Settings },
  {
    label: "Discover Musicians",
    href: "/dashboard/booker/explore",
    icon: Search,
  },
];
