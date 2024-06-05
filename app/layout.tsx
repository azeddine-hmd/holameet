import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Libre_Franklin } from 'next/font/google'
import { Chivo } from 'next/font/google'
import { cn } from "@/lib/utils";

const libre_franklin = Libre_Franklin({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-libre_franklin',
});

const chivo = Chivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-chivo',
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Halomeet",
  description: "Halomeet video chat with strangers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, libre_franklin.variable, chivo.variable)}>{children}</body>
    </html>
  );
}
