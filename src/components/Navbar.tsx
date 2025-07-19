import { Music } from "lucide-react";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
} from "@clerk/nextjs";
import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <div className="sticky top-0 z-30 border-b bg-background px-4 sm:px-6">
      <div className="flex items-center justify-between mx-auto max-w-4xl h-16">
        <div className="flex gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Music className="h-6 w-6" />
            <span className="font-bold">Music Hub.</span>
          </Link>
        </div>
        <SignedOut>
          <div className="flex gap-2">
            <SignInButton mode="modal">
              <Button variant="outline">Log in</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-purple-700 hover:bg-purple-800 text-white font-semibold">
                Sign up
              </Button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex gap-2">
            <UserButton />
            <nav>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground transition-color hover:text-foreground"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
