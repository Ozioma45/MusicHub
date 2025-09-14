"use client";

import { useEffect, useState } from "react";

import { CheckCircle } from "lucide-react";
import MainLayout from "@/components/MainLayout";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    await Promise.all(
      notifications
        .filter((n) => !n.read)
        .map((n) =>
          fetch(`/api/notifications/${n.id}/read`, { method: "PATCH" })
        )
    );

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading notifications...
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {notifications.some((n) => !n.read) && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg divide-y">
          {notifications.length === 0 ? (
            <p className="p-6 text-center text-gray-500">
              No notifications yet
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 transition-colors ${
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
      </div>
    </MainLayout>
  );
}
