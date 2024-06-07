"use client";

import React from "react";
import LoadingSpinner from "./ui/loading-spinner";
import { cn } from "@/lib/utils";

export type VideoCallCard = React.ComponentProps<"div">;

export default function VideoCallCard({ className, ...restProps }: VideoCallCard) {
  return (
    <div className={cn("bg-muted-foreground w-full h-full relative flex items-center justify-center", className)}
      {...restProps}
    >
      <LoadingSpinner className="w-10 h-10 text-background" />
    </div>
  );
}
