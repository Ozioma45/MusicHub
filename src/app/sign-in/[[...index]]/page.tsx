// /app/sign-in/page.tsx
"use client";

import { SignIn } from "@clerk/nextjs";
import MainLayout from "@/components/MainLayout";

export default function SignInPage() {
  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="rounded-xl border p-6 shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-4">Sign In</h1>
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: "bg-blue-700 hover:bg-blue-800",
              },
            }}
            path="/sign-in"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </MainLayout>
  );
}
