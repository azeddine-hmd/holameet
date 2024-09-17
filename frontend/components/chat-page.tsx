"use client";

import { useBreakpoint } from "@/hooks/use-breakpoint";
import ChatBox from "./chatBox/ChatBox";
import VideoCallPanel from "./video-call-panel";

export default function ChatPage() {
  const { isMd } = useBreakpoint("md");

  return (
    <main className="w-full h-full flex">
      <VideoCallPanel className="md:w-[70%] w-full" />
      {isMd &&
        <ChatBox className="w-[30%]" />
      }
    </main>
  );
}
