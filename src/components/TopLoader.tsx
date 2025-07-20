// components/TopLoader.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function TopLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // simulate loading delay

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-purple-600 animate-pulse z-50" />
      )}
    </>
  );
}
