"use client";

import ChatBox from "./chatBox/ChatBox";
import VideoCallPanel from "./video-call-panel";

export default function ChatPage() {

  return (
    <main className="w-full h-full flex">
      <VideoCallPanel className="w-[70%]" />
      <ChatBox className="w-[30%]" />
    </main>
  );
}
