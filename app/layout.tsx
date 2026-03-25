import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuickQuote — Professional Quotes in Seconds",
  description: "Fast quote & invoice generator for contractors and freelancers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f8fafc] text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}