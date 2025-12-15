"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LuxuryLoaderProps {
    className?: string;
}

export function LuxuryLoader({ className }: LuxuryLoaderProps) {
    const [text, setText] = useState("");
    const fullText = "Print House";

    useEffect(() => {
        let currentIndex = 0;
        setText("");

        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 150);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={cn("flex flex-col items-center justify-center p-8 bg-background", className)}>
            <div className="flex flex-col items-center gap-2">
                {/* Main Brand with Serif Font - simluating Lust Display */}
                <div
                    className="flex items-center justify-center text-6xl md:text-8xl font-bold text-primary tracking-tight animate-fade-in"
                    style={{ fontFamily: "var(--font-tan-buster)" }}
                >
                    <span>H</span>
                    {/* The 'O' image replacement */}
                    <div className="relative h-[0.95em] w-[0.95em] -mx-[0.03em] -translate-y-[0.15em]">
                        <Image
                            src="/image.png"
                            alt="Logo Icon"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span>nesty.</span>
                </div>

                {/* Subtext with Script Font - simulating Brittany Signature */}
                <div className="flex items-center -mt-2">
                    <span
                        className="text-5xl md:text-7xl leading-none"
                        style={{
                            fontFamily: "var(--font-moon-time)",
                            color: "#D2691E",
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)"
                        }}
                    >
                        {text}
                        <span className="animate-blink ml-1 border-r-2 border-accent h-12 inline-block align-middle"></span>
                    </span>
                </div>
            </div>
        </div>
    );
}
