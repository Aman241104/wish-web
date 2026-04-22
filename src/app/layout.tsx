import type { Metadata, Viewport } from "next";
import { Inter, Handlee } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const handlee = Handlee({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-handwriting",
});

export const metadata: Metadata = {
  title: "A Late But Special Birthday Surprise 💖",
  description: "A deeply personal and interactive birthday surprise for the world's best twins, Diya & Drashti.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${handlee.variable} scroll-smooth`}>
      <body className="antialiased selection:bg-pink-pastel/30 selection:text-pink-600">
        {children}
      </body>
    </html>
  );
}
