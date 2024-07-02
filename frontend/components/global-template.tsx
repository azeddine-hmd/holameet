"use client";

import React, { useEffect } from "react";
import io from "socket.io-client";

export default function GlobalTemplate({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    window.socket = io(process.env.NODE_ENV === "development" ? "https://localhost:3001" : process.env.NEXT_PUBLIC_BACKEND_DOMAIN as string, {
      transports: ["websocket"],
      withCredentials: true,
    })
    window.socket.on("connect", () => {
      console.log("socket id:", window.socket.id);
      document.dispatchEvent(new CustomEvent("socket is ready"));
      window.socket.on("error", (...args: any[]) => {
        console.error("socket error:", args[0]);
      });
    });
  }, [])


  return (
    <>
      {children}
    </>
  );
}
