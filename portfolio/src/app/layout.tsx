import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Make It Here — Video Content Studio by Varsha",
  description:
    "Video content studio creating brand films, campaigns, and stories for India's most ambitious companies across beauty, finance, healthcare, and food.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
