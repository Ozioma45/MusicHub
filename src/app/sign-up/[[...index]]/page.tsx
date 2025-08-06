"use client";

import { SignUp } from "@clerk/nextjs";
import MainLayout from "@/components/MainLayout";

export default function SignUpPage() {
  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="rounded-xl border p-6 shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-4">
            Create Your Account
          </h1>
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: "bg-blue-700 hover:bg-blue-800",
              },
            }}
            path="/sign-up"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </MainLayout>
  );
}
