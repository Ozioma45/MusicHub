"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side - Image with overlay & text */}
      <div className="relative hidden md:flex items-center justify-center bg-black">
        <Image
          src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1920&auto=format&fit=crop"
          alt="Music background"
          fill
          className="object-cover opacity-70"
          priority
        />

        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 text-white p-10 max-w-md">
          <h1 className="text-4xl font-bold mb-4 shadow-xl">
            Connect with Music, Create Unforgettable Moments.
          </h1>
          <p className="text-lg">
            Join MusiConnect and discover talented artists ready to elevate your
            event.
          </p>
        </div>
      </div>

      {/* Right side - Sign In form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: "bg-blue-700 hover:bg-blue-800 text-white",
                card: "shadow-lg border rounded-lg",
              },
            }}
            path="/sign-in"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}
