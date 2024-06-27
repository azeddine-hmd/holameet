"use client";

import ChatBox from "./chatBox/ChatBox";
import VideoCallPanel from "./video-call-panel";
import { useEffect } from "react";
import { callPeer } from "../config/webrtc";

export default function ChatPage() {
  const onSessionStarted = (...args: any[]) => {
    console.log("session started!", ...args);
    // TODO: invoke callPeer() function
  };

  const onSessionStopped = (...args: any[]) => {
    console.log("session stopped!", ...args);
    // TODO: close remote peer connection
    window.socket.emit("start");
  };

  useEffect(() => {
    const onSocketReady = () => {
      window.socket.emit("start");
      window.socket.on("session started", (...args: any[]) => {
        onSessionStarted(...args);
      })
      window.socket.on("stop session", (...args: any[]) => {
        onSessionStopped(...args);
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
