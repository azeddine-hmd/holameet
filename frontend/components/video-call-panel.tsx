"use client";

import { cn } from "@/lib/utils";
import Logo from "./logo";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import VideoCallCard from "./video-call-card";
import { BsHeadset, BsMic } from "react-icons/bs";
import useResizeObserver from "use-resize-observer";
import { useState, useEffect } from "react";
import SkipIcon from '@/components/icons/SkipIcon';
import { useDrag } from '@use-gesture/react';
import { animated, useSpring } from "@react-spring/web";
import * as Rtc from "@/config/webrtc";

export type VideoCallPanel = React.ComponentProps<"div">;

export default function VideoCallPanel({ className, ...restProps }: VideoCallPanel) {
  const { ref, width } = useResizeObserver<HTMLDivElement>();
  const [isMicMute, setMicMute] = useState(false);
  const [isHeadsetMute, setHeadsetMute] = useState(false);
  const [hideCallControl, setHideCallControl] = useState(false);
  const [isControlsOpen, setControlsOpen] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const skipSession = () => {
    console.log("skipping");
    window.socket.emit("skip");
    Rtc.sessionStopped();
    setRemoteStream(Rtc.remoteStream);
    document.dispatchEvent(new CustomEvent("session stopped"));
  };

  useEffect(() => {
    setControlsOpen(true);
    Rtc.startLocalStream().then(() => setLocalStream(Rtc.localStream));
  }, []);

  const onSessionStarted = (...args: any[]) => {
    console.log("session started!", ...args);
    setTimeout(() => {
      Rtc.intiiateCall().then(() => {
        setLocalStream(Rtc.localStream);
        setRemoteStream(Rtc.remoteStream);
      });
      document.dispatchEvent(new CustomEvent("session started"));
    }, 1_000);
  };

  const onSessionStopped = (...args: any[]) => {
    console.log("session stopped!", ...args);
    Rtc.sessionStopped();
    setRemoteStream(Rtc.remoteStream)
    setTimeout(() => window.socket.emit("start"), 1_000);
    document.dispatchEvent(new CustomEvent("session stopped"));
  };

  const onNewOfferAwaiting = (...args: any[]) => {
    const offerObj = args[0];
    console.log("[SOCKET]: recieveing offer...", offerObj);
    Rtc.answerOffer(offerObj).then(() => {
      setRemoteStream(Rtc.remoteStream);
    });
  };

  const onAnswerResponse = (...args: any[]) => {
    const answer = args[0];
    console.log("[SOCKET]: answer response...", answer);
    Rtc.addAnswer(answer); 
  };

  const onRecieveIceCandidates = (...args: any[]) => {
    const iceCandidates: RTCIceCandidate = args[0];
    console.log("iceCandidates:", args[0]);
    Rtc.addNewIceCandidates([iceCandidates]);
    document.dispatchEvent(new CustomEvent("session started"));
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
      window.socket.on("newOfferAwaiting", (...args: any[]) => {
        onNewOfferAwaiting(...args);
      })
      window.socket.on("answerResponse", (...args: any[]) => {
        onAnswerResponse(...args);
      });
      window.socket.on("receive icecandidate", (...args: any[]) => {
        onRecieveIceCandidates(...args);
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

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useDrag(({ down, movement: [mx, my], xy, axis, values}) => {
    api.start({ x: down ? mx : 0, y: down ? my : 0, immediate: down });
  });

  return (
    <div
      ref={ref}
      className={cn("w-full h-full relative", className)}
      onMouseEnter={() => setHideCallControl(false)}
      onMouseLeave={() => setHideCallControl(true)}
      {...restProps}
    >
      <VideoCallCard stream={remoteStream} />
      <Logo className="absolute left-4 top-4" />
      <div className="absolute bottom-0 left-0 h-0 w-0">
        <Popover open={isControlsOpen}>
          <PopoverTrigger>
            <div className="hidden"></div>
          </PopoverTrigger>
          <PopoverContent className="right-0 left-0 p-2 m-0 mb-8 h-fit bg-transparent outline-0  shadow-none border-0"
            sideOffset={0}
            style={{
              width: width!,
            }}
          >
            <div className="flex h-full gap-4 items-end">

              <animated.div className="flex-shrink-0 z-10" style={{ x, y }} {...bind()}>
                <VideoCallCard wrapperClassName="w-[300px] min-h-[222px] rounded-md border-2 border-border" stream={localStream} {...bind()} muted />
              </animated.div>

              <div className={cn("flex-grow h-full group-hover:bg-red-500", { "hidden": hideCallControl })}>
                <div className="flex justify-center items-center h-full space-x-2">


                  <Button className="!outline-none rounded-full w-14 h-14 bg-white/20 hover:bg-white/30 text-white" onClick={() => setMicMute(!isMicMute)}>
                    <BsMic size="24" className={cn("absolute left-50 top-50", { "text-destructive": isMicMute })} />
                    {isMicMute &&
                      <span className="absolute w-[34px] h-1 bg-red-500 z-50 rounded-lg rotate-[140deg]"></span>
                    }
                  </Button>
                  <Button size="icon" variant="ghost" className="rounded-full w-24 h-14 hover:text-white bg-white/20 hover:bg-white/30 text-white" onClick={() => skipSession()}>
                    <SkipIcon />
                    <span className="ml-1 bold">
                      SKIP
                    </span>
                  </Button>
                  <Button className="rounded-full w-14 h-14 bg-white/20 hover:bg-white/30 text-white" onClick={() => setHeadsetMute(!isHeadsetMute)}>
                    <BsHeadset size="24" className={cn("absolute left-50 top-50", { "text-destructive": isHeadsetMute })} />
                    {isHeadsetMute &&
                      <span className="absolute w-[34px] h-1 bg-red-500 z-50 rounded-lg rotate-[140deg]"></span>
                    }
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
