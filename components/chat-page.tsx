"use client";

import VideoCallPanel from "./video-call-panel";

export default function ChatPage() {
  return (
    <main className="w-full h-full flex">
      <VideoCallPanel />
      <div className="w-[200px]">chat div</div>
    </main>
  );
}
