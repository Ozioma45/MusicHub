"use client";

import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side - Image with overlay & text */}
      <div className="relative hidden md:flex items-center justify-center bg-black">
        <Image
          src="https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?q=80&w=1920&auto=format&fit=crop"
          alt="Live music event"
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="relative z-10 text-white p-10 max-w-md">
          <h1 className="text-4xl font-bold mb-4">Your Stage Awaits.</h1>
          <p className="text-lg">
            Sign up to join our vibrant community of musicians and event
            organizers.
          </p>
        </div>
      </div>

      {/* Right side - Sign Up form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: "bg-blue-700 hover:bg-blue-800 text-white",
                card: "shadow-lg border rounded-lg",
              },
            }}
            path="/sign-up"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}
