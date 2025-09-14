"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/admin/me");
      if (res.ok) {
        setIsAuthorized(true);
      } else {
        router.push("/admin/login");
      }
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (loading) {
    return <p className="text-center mt-20">Checking admin access...</p>;
  }

  if (!isAuthorized) return null; // Prevent flicker

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <div className="flex flex-col gap-4">
        <a
          href="/admin/add-admin"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
        >
          Add New Admin
        </a>

        <a
          href="/admin/announcement"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
        >
          Announcement
        </a>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
