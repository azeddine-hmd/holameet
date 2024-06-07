"use client";

import { cn } from "@/lib/utils";
import Logo from "./logo";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import VideoCallCard from "./video-call-card";
import { BsHeadset, BsMic } from "react-icons/bs";
import useResizeObserver from "use-resize-observer";
import { useState } from "react";
import SkipIcon from '@/components/icons/SkipIcon';

export type VideoCallPanel = React.ComponentProps<"div">;

export default function VideoCallPanel({ className, ...restProps }: VideoCallPanel) {
  const { ref, width } = useResizeObserver<HTMLDivElement>();
  const [isMicMute, setMicMute] = useState(false);
  const [isHeadsetMute, setHeadsetMute] = useState(false);
  const [hideCallControl, setHideCallControl] = useState(false);

  return (
    <div
      ref={ref}
      className={cn("w-full h-full relative", className)}
      onMouseEnter={() => setHideCallControl(false)}
      onMouseLeave={() => setHideCallControl(true)}
      {...restProps}
    >
      <VideoCallCard />
      <Logo className="absolute left-4 top-4" />
      <div className="absolute bottom-0 left-0 h-0 w-0">
        <Popover open>
          <PopoverTrigger>
            <div className="hidden"></div>
          </PopoverTrigger>
          <PopoverContent className="right-0 left-0 p-2 m-0 mb-8 h-40 bg-transparent outline-0  shadow-none border-0 overflow-hidden"
            sideOffset={0}
            style={{
              width: width!,
            }}
          >
            <div className="flex h-full gap-4">
              <VideoCallCard className="rounded-md border border-border flex-shrink-0 w-[300px]" />
              <div className={cn("flex-grow h-full group-hover:bg-red-500", { "hidden": hideCallControl })}>
                <div className="flex justify-center items-center h-full space-x-2">


                  <Button className="rounded-full w-14 h-14 bg-white/20 hover:bg-white/30 text-white" onClick={() => setMicMute(!isMicMute)}>
                    <BsMic size="24" className={cn("absolute left-50 top-50", {"text-destructive": isMicMute})} />
                    {isMicMute &&
                      <span className="absolute w-[34px] h-1 bg-red-500 z-50 rounded-lg rotate-[140deg]"></span>
                    }
                  </Button>
                  <Button size="icon" variant="ghost" className="rounded-full w-24 h-14 hover:text-white bg-white/20 hover:bg-white/30 text-white">
                    <SkipIcon />
                    <span className="ml-1 bold">
                      SKIP
                    </span>
                  </Button>
                  <Button className="rounded-full w-14 h-14 bg-white/20 hover:bg-white/30 text-white" onClick={() => setHeadsetMute(!isHeadsetMute)}>
                    <BsHeadset size="24" className={cn("absolute left-50 top-50", {"text-destructive": isHeadsetMute})} />
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
