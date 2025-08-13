"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@clerk/nextjs";

export default function EditProfileModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button className="px-6" onClick={() => setIsOpen(true)}>
        Edit Profile
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Modal box */}
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            <UserProfile routing="virtual" />
          </div>
        </div>
      )}
    </>
  );
}
