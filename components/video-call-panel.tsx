"use client";

import { useEffect } from "react";
import Logo from "./logo";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import VideoCallCard from "./video-call-card";
import { BsHeadset, BsMic } from "react-icons/bs";
import useResizeObserver from "use-resize-observer";

export default function VideoCallPanel() {
  const { ref, width } = useResizeObserver<HTMLDivElement>();

  return (
    <div ref={ref} className="w-full h-full relative">
      <VideoCallCard />
      <Logo className="absolute left-4 top-4" />
      <div className="absolute bottom-0 left-0 h-0 w-0">
        <Popover open>
          <PopoverTrigger>
            <div className="hidden"></div>
          </PopoverTrigger>
          <PopoverContent className="right-0 left-0 p-0 m-8 box-border h-40 bg-transparent outline-0  shadow-none border-0"
            sideOffset={0}
            style={{
              width: width! - 64,
            }}
          >
            <div className="flex h-full items-center gap-4">
              <VideoCallCard className="rounded-md border border-border w-[200px]" />
              <div className="flex justify-center items-center h-full space-x-2 max-w-5">
                <Button className="rounded-full bg-secondary text-secondary-foreground w-16 h-16 outline-none">
                  <BsMic size="32" />
                </Button>
                <Button className="h-16 px-4  w-[256px] text-xl bg-accent text-accent-foreground rounded-3xl outline-none">
                  SKIP
                </Button>
                <Button className="rounded-full bg-secondary text-secondary-foreground w-16 h-16">
                  <BsHeadset size="32" />
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
