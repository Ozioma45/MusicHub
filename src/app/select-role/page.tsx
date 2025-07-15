"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

export default function SelectRolePage() {
  const router = useRouter();
  const { user } = useUser();

  const handleSelect = async (role: "MUSICIAN" | "BOOKER") => {
    if (!user) return;

    await axios.post("/api/user/set-role", {
      role,
      clerkUserId: user.id,
    });

    router.push("/dashboard");
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Choose your role</h1>
      <p className="mb-6">Are you a musician or looking to book one?</p>
      <div className="flex gap-6 justify-center">
        <button
          className="bg-purple-600 text-white px-6 py-3 rounded-xl cursor-pointer"
          onClick={() => handleSelect("MUSICIAN")}
        >
          I'm a Musician
        </button>
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-xl cursor-pointer"
          onClick={() => handleSelect("BOOKER")}
        >
          I'm a Booker
        </button>
      </div>
    </div>
  );
}
