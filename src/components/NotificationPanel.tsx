"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  userId: string;
  type: "BOOKING" | "MESSAGE" | "REVIEW" | "SYSTEM";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    };
    fetchNotifications();
  }, []);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 shadow-lg rounded-lg max-h-96 overflow-y-auto flex flex-col">
          {/* Notifications list */}
          <div className="flex-1">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">No notifications</p>
            ) : (
              notifications.map((n: Notification) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    n.read
                      ? "bg-gray-100 dark:bg-gray-800"
                      : "bg-white dark:bg-gray-700"
                  }`}
                >
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* View all button */}
          <div className="border-t">
            <Link
              href="/notifications"
              className="block w-full text-center py-2 text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-b-lg text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              View all
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
