import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from "@/components/shared/providers/AppProvider";
import { getLocale, getMessages } from "next-intl/server";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voting Platform",
  description: "Powered by Netnam",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "h-screen antialiased"
        )}
      >
        <main className="flex h-full flex-col">
          <AppProvider locale={locale} messages={messages}>
            {children}
          </AppProvider>
        </main>
      </body>
    </html>
  );
}
