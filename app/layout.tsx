import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StatementReady",
  description:
    "Clean messy bank, PayPal, Stripe, and card CSV or Excel exports into bookkeeping-ready files."
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
