"use client";

import React, { useEffect, useRef } from "react";
import LoadingSpinner from "./ui/loading-spinner";
import { cn } from "@/lib/utils";

export type VideoCallCard = {
  wrapperClassName?: string;
  stream?: MediaStream;
  micMute?: boolean;
} & React.ComponentProps<"video">;

export default function VideoCallCard({
  wrapperClassName,
  className,
  stream,
  micMute = false,
  ...restProps 
}: VideoCallCard) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioTrackRef = useRef<MediaStreamTrack>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      audioTrackRef.current = stream?.getAudioTracks()[0];
    }
  }, [stream]);

  useEffect(() => {
    if (audioTrackRef.current) {
      if (micMute) {
        audioTrackRef.current.enabled = false;
      }  else {
        audioTrackRef.current.enabled = true;
      }
    }
  }, [micMute]);

  return (
    <div className={cn("bg-black w-full h-full flex items-center justify-center", wrapperClassName)}
    >
      {stream ?
        <video ref={videoRef} className={cn("max-w-full max-h-full", className)} {...restProps} autoPlay />
        :
        <LoadingSpinner className="w-10 h-10 text-background" />
      }
    </div>
  );
}
