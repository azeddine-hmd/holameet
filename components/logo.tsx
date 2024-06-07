import { cn } from "@/lib/utils";
import React from "react";

export type LogoProps = React.ComponentProps<"div">;

export default function Logo({ className, ...restProps }: LogoProps) {
    return (
        <div className={cn(className, "flex items-center gap-4")} {...restProps}>
            <div className="relative w-12 h-12">
                <div className="absolute top-0 left-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                    <VideoIcon className="w-5 h-5" />
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                    <VideoIcon className="w-5 h-5" />
                </div>
            </div>
            <div className="text-2xl font-bold text-primary">HolaMeet</div>
        </div>
    )
}

function VideoIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
            <rect x="2" y="6" width="14" height="12" rx="2" />
        </svg>
    )
}
