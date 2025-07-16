import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
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
        <body>
          <div className="max-w-4xl mx-auto px-4">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
