// app/not-found.tsx
"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-[url('/music-notes-bg.png')] bg-cover bg-center opacity-10"></div>

      {/* Logo */}
      <div className="flex items-center gap-2 z-10">
        {/* <Image
          src="/logo.png" // replace with your Musiconnect logo
          alt="Musiconnect Logo"
          width={50}
          height={50}
          className="rounded-full"
        /> */}
        <span className="text-2xl font-bold tracking-wide">Musiconnect</span>
      </div>

      {/* Error Message */}
      <h1 className="mt-10 text-7xl font-extrabold tracking-tight drop-shadow-lg">
        404
      </h1>
      <p className="mt-4 text-lg text-gray-300 max-w-md text-center">
        Oops! Looks like you hit the wrong note. The page you’re looking for
        doesn’t exist.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4 z-10">
        <Link
          href="/"
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
        >
          Go Home
        </Link>
        <Link
          href="/explore"
          className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-800 transition font-medium"
        >
          Discover Musicians
        </Link>
      </div>

      {/* Floating animation elements */}
      <div className="absolute -top-10 left-10 w-32 h-32 bg-purple-500 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
    </div>
  );
}
