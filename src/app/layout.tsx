import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Music Hub",
  description: "Book musicians for your events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <Script
            src="https://widget.cloudinary.com/v2.0/global/all.js"
            strategy="beforeInteractive"
          />
        </head>
        <body>
          <div className="w-full max-w-[1400px] mx-auto">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
