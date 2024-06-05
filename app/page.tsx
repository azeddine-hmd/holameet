"use client";

import { Calendar } from "@/components/ui/calendar";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <main className="flex min-h-screen flex-col">
      <header className="bg-gray-950 px-4 py-6 md:px-6 md:py-8">
       <div className="container mx-auto flex items-center justify-between">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <ContactIcon className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">Chat Roulette</span>
          </Link>
          <Button className="rounded-full bg-white px-6 py-3 text-sm font-medium text-gray-950 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2">
            Start
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-gray-100 py-12 md:py-20">
          <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-2 md:gap-12 lg:gap-16">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl md:text-5xl">
                Connect with strangers, make new friends.
              </h1>
              <p className="text-lg text-gray-600">
                Chat Roulette is a fun and easy way to meet new people from
                around the world. Start a conversation with someone new and see
                where it takes you.
              </p>
              <Button className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2">
                Start
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/placeholder.svg"
                width="300"
                height="200"
                alt="Feature 1"
                className="rounded-lg object-cover"
              />
              <img
                src="/placeholder.svg"
                width="300"
                height="200"
                alt="Feature 2"
                className="rounded-lg object-cover"
              />
              <img
                src="/placeholder.svg"
                width="300"
                height="200"
                alt="Feature 3"
                className="rounded-lg object-cover"
              />
              <img
                src="/placeholder.svg"
                width="300"
                height="200"
                alt="Feature 4"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-950 py-6 text-white">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <p className="text-sm">
            &copy; 2024 Chat Roulette. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link href="#" className="text-sm hover:underline" prefetch={false}>
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm hover:underline" prefetch={false}>
              Terms of Service
            </Link>
            <Link href="#" className="text-sm hover:underline" prefetch={false}>
              Contact Us
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function ContactIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <circle cx="12" cy="10" r="2" />
      <line x1="8" x2="8" y1="2" y2="4" />
      <line x1="16" x2="16" y1="2" y2="4" />
    </svg>
  );
}
