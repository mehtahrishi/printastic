import Image from "next/image";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("flex flex-col items-center justify-center select-none pointer-events-none", className)} {...props}>
            <div
                className="flex items-center justify-center font-bold tracking-tight text-primary leading-none"
                style={{ fontFamily: "var(--font-tan-buster)", fontSize: "1.25em" }}
            >
                <span>H</span>
                <div className="relative h-[0.95em] w-[0.95em] -mx-[0.03em] -translate-y-[0.15em]">
                    <Image
                        src="/image.png"
                        alt="o"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <span>nesty.</span>
            </div>
            <span
                className="leading-none relative -top-[0.1em]"
                style={{
                    fontFamily: "var(--font-moon-time)",
                    fontSize: "1.2em",
                    color: "#D2691E",
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)"
                }}
            >
                Print House
            </span>
        </div>
    );
}
