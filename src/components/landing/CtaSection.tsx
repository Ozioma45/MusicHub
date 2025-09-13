"use client";

import Link from "next/link";
import { useState } from "react";
import LoadingButton from "../LoadingButton";

export default function CallToActionSection() {
  const [loadingLink, setLoadingLink] = useState<string | null>(null);

  const handleClick = (target: string) => {
    setLoadingLink(target);
  };

  return (
    <section className="bg-sky-600 text-white py-16 px-6 text-center rounded-lg max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">
        Ready to Connect with Musicians ?
      </h2>
      <p className="mb-6 text-lg">
        Join our vibrant community of musicians and music lovers today.
      </p>

      <div className="flex justify-center gap-4">
        <Link href="/sign-up">
          <LoadingButton
            size="lg"
            className="bg-white text-sky-600 px-6 py-3 rounded hover:bg-gray-100 font-medium cursor-pointer"
            loading={loadingLink === "sign-in"}
            onClick={() => handleClick("sign-in")}
          >
            Sign Up Now
          </LoadingButton>
        </Link>
        <Link href="/explore">
          <LoadingButton
            size="lg"
            className="bg-white text-sky-600 px-6 py-3 rounded hover:bg-gray-100 font-medium cursor-pointer"
            loading={loadingLink === "sign-in"}
            onClick={() => handleClick("explore")}
          >
            {" "}
            Explore Artists
          </LoadingButton>
        </Link>
      </div>
    </section>
  );
}
