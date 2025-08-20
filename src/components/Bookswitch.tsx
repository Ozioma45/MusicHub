// components/RoleSwitcher.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RoleSwitcher() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRoleSwitch(role: "MUSICIAN" | "BOOKER") {
    setLoading(true);

    try {
      const res = await fetch("/api/user/set-active-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newRole: role }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.redirect) {
          router.push(data.redirect);
        } else {
          router.push(`/dashboard/${role.toLowerCase()}`);
        }
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Error switching role");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleRoleSwitch("MUSICIAN")}
        disabled={loading}
        className="bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
      >
        Switch to Musician
      </button>
      {/* <button
        onClick={() => handleRoleSwitch("BOOKER")}
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Switch to Booker
      </button> */}
    </div>
  );
}
