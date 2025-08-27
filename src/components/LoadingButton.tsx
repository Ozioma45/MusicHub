"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface LoadingButtonProps {
  loading?: boolean;
  children: ReactNode;
  [key: string]: any; // pass through any other props (like size, className, onClick)
}

export default function LoadingButton({
  loading = false,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button {...props} disabled={loading}>
      {loading ? "Loading..." : children}
    </Button>
  );
}
