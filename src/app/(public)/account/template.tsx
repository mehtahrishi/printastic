"use client";

import { useEffect, useState } from "react";
import { LuxuryLoader } from "@/components/ui/luxury-loader";
import { cn } from "@/lib/utils";

export default function Template({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        // Run loader for 2 seconds minimal to show full animation
        const timer = setTimeout(() => {
            setIsFading(true);
            setTimeout(() => setIsLoading(false), 500); // 500ms fade out
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative min-h-screen">
            {isLoading && (
                <div
                    className={cn(
                        "fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ease-in-out",
                        isFading ? "opacity-0" : "opacity-100"
                    )}
                >
                    <LuxuryLoader />
                </div>
            )}
            {children}
        </div>
    );
}
