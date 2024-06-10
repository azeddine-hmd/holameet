"use client";

import ChatBox from "./chatBox/ChatBox";
import VideoCallPanel from "./video-call-panel";
import { useEffect } from "react";

export default function ChatPage() {
  useEffect(() => {
    const onSocketReady = () => {
      window.socket.emit("start");
      window.socket.on("session started", (...args: any[]) => {
        console.log("[SOCKET]:", args[0]);
      })
      window.socket.on("stop session", () => {
        console.log("[SOCKET]: Session stopped");
        window.socket.emit("start");
      });
    };
    
    if (window.socket != null) {
      onSocketReady();
    } else {
      document.addEventListener("socket is ready", () => {
        onSocketReady();
      });
    }

  // eslint-disable-next-line
  }, []);

  return (
    <main className="w-full h-full flex">
      <VideoCallPanel className="w-[70%]" />
      <ChatBox className="w-[30%]" />
    </main>
  );
}
