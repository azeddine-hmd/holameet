"use client";

import ChatBox from "./chatBox/ChatBox";
import VideoCallPanel from "./video-call-panel";
import { useEffect } from "react";
import { callPeer } from "../config/webrtc";

export default function ChatPage() {
  const onSessionStarted = () => {
    // callPeer();
  };

  useEffect(() => {
    const onSocketReady = () => {
      window.socket.emit("start");
      window.socket.on("session started", (...args: any[]) => {
        console.log("[SOCKET]:", args[0]);
        callPeer();
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

  useEffect(() => {
  }, []);

  return (
    <main className="w-full h-full flex">
      <VideoCallPanel className="w-[70%]" />
      <ChatBox className="w-[30%]" />
    </main>
  );
}
