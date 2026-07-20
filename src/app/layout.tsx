import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/shared/Navbar";

import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/shared/Footer";

const plusSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AGRIMINDAI",
  description: "Agrimindai",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full antialiased", plusSans.className)}

    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 dark:bg-zinc-950 dark:text-slate-50 transition-colors duration-300">

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Navbar />

          <main className="grow">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>

      </body>
    </html>
  );
}