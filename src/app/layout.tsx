import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AnimatedTabIcon } from "@/components/AnimatedTabIcon";
import { ClickTracker } from "@/components/ClickTracker";
import { site } from "@/content/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <AnimatedTabIcon />
        <Nav />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <ClickTracker />
      </body>
    </html>
  );
}
