"use client";

import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { useState } from "react";
import ChatPage from "./chat-page";

export function LandingPage() {
  const [displayChatPage, setDisplayChatPage] = useState(false);

  const onStartClicked = () => {
    setDisplayChatPage(true);
  };

  return (
    <>
      {displayChatPage ?
        <ChatPage />
        :
        <div className="flex flex-col min-h-screen bg-background justify-end">
          <main className="flex flex-col md:flex-row items-center justify-center px-4 md:px-6 py-12 md:py-24 lg:py-32 flex-grow">
            <div className="max-w-xl text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-background px-3 py-1">
                <Logo />
              </div>
              <h1 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
                Connect with New People
              </h1>
              <p className="text-foreground/50 md:text-xl">
                Start chatting with strangers from around the world. Make new
                friends and have fun!
              </p>
              <Button className="w-full max-w-[240px] bg-primary text-lg text-white hover:bg-primary/80 focus:ring-primary/30"
                onClick={onStartClicked}
              >
                Start
              </Button>
            </div>
          </main>
          <footer className="w-full border-t border-gray-200 py-2 text-sm text-muted-foreground  col-span-1 md:col-span-2">
            <div className="container flex justify-center items-center">
              <p className="text-center">© 2024 Holameet. All rights reserved.</p>
            </div>
          </footer>
        </div >
      }
    </>
  );
}
