"use client";

import { Button } from "@/components/ui/button";
import { ReactNode, ComponentProps } from "react";

interface LoadingButtonProps extends ComponentProps<typeof Button> {
  loading?: boolean;
  children: ReactNode;
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
