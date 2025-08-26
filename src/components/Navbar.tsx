"use client";

import { Music, Menu, X } from "lucide-react";
import { SignedOut, UserButton, SignedIn } from "@clerk/nextjs";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30 border-b bg-background px-4 sm:px-6">
      <div className="flex items-center justify-between mx-auto max-w-4xl h-16">
        {/* Logo */}
        <div className="flex gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Music className="h-6 w-6" />
            <span className="font-bold">MusiConnect.</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/suggestions" className="font-semibold cursor-pointer">
            Suggestion Box
          </Link>

          {/* <Link href="/explore" className="font-semibold">
            Find Musician
          </Link> */}

          <SignedOut>
            <div className="flex gap-2">
              <Link href="/sign-in">
                <Button variant="outline" className="cursor-pointer">
                  Log in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold cursor-pointer">
                  Sign up
                </Button>
              </Link>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex gap-2 items-center">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>

              <UserButton />
            </div>
          </SignedIn>
        </div>

        {/* Hamburger Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 mt-2 space-y-3 flex items-center justify-center flex-col">
          <Link href="/explore" className="block font-semibold text-center">
            Find Musician
          </Link>

          <SignedOut>
            <div className="space-y-2">
              <Link href="/sign-in">
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link href="sign-up">
                <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold">
                  Sign up
                </Button>
              </Link>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="space-y-2 flex items-center justify-center gap-3">
              <UserButton />
              <Link
                href="/dashboard"
                className="block text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
            </div>
          </SignedIn>
        </div>
      )}
    </div>
  );
};

export default Navbar;
