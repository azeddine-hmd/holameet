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
  const [ isMicMute, setMicMute ] = useState(false);
  const [ isHeadsetMute, setHeadsetMute ] = useState(false);

  return (
    <div ref={ref} className={cn("w-full h-full relative", className)} {...restProps}>
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
              <div className="flex justify-center items-center h-full flex-grow space-x-2">
                <Button size="icon" variant="ghost" className="rounded-full w-14 h-14 bg-white/20 hover:bg-white/30 text-white" onClick={() => setMicMute(!isMicMute)}>
                  <BsMic size="24" className="absolute left-50 top-50" />
                  {isMicMute &&  
                    <span className="absolute w-[40px] h-1 bg-red-500 z-50 rotate-[120deg]"></span>
                  }
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full w-24 h-14 bg-white/20 hover:bg-white/30 text-white">
                  <SkipIcon />
                  <span className="ml-1 bold">
                    SKIP
                  </span>
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full w-14 h-14 bg-white/20 hover:bg-white/30 text-white" onClick={() => setHeadsetMute(!isHeadsetMute)}>
                  <BsHeadset size="24" className="absolute left-50 top-50" />
                  {isHeadsetMute &&  
                    <span className="absolute w-[20px] h-1 bg-red-500 z-50 rotate-[120deg]"></span>
                  }
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
