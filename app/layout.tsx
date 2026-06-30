import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CreatorCSV Cleaner",
  description:
    "Clean messy Gumroad, Lemon Squeezy, Ko-fi, Etsy, and Stripe order CSV files in the browser."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
