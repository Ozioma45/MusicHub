import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";
import ReactQueryProvider from "@/components/Providers";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const metadata: Metadata = {
  title: "MusiConnect",
  description: "Book musicians for your events",
  icons: {
    icon: "/favicon.png",
  },
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
          <ReactQueryProvider>
            <div className="w-full max-w-[1400px] mx-auto">{children}</div>

            <ReactQueryDevtools initialIsOpen={false} />
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
