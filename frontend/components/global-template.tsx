"use client";

import React, { useEffect } from "react";
import io from "socket.io-client";

export default function GlobalTemplate({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    window.socket = io("http://localhost:3001", {
      transports: ["websocket"],
      withCredentials: true,
    })
    window.socket.on("connect", () => {
      console.log("socket id:", window.socket.id);
      document.dispatchEvent(new CustomEvent("socket is ready"));
    });
  }, [])


  return (
    <>
      {children}
    </>
  );
}
