"use client";

import React, { useEffect } from "react";
import io from "socket.io-client";

export default function GlobalTemplate({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    const socket = io("http://localhost:3001", {
      transports: ["websocket"],
      withCredentials: true,
    })
    socket.on("connect", () => {
      console.log("socket id:", socket.id);
    });
  }, [])


  return (
    <>
      {children}
    </>
  );
}
