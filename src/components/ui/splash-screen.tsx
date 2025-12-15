"use client";

import { useEffect, useState } from "react";
import { LuxuryLoader } from "./luxury-loader";
import { cn } from "@/lib/utils";

export function SplashScreen() {
    const [show, setShow] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Show for 2.5 seconds total
        const timer = setTimeout(() => {
            setFadeOut(true);
            // Wait for fade out animation (500ms) before removing from DOM
            setTimeout(() => {
                setShow(false);
            }, 500);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    if (!show) return null;

    return (
        <div
            className={cn(
                "fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ease-in-out",
                fadeOut ? "opacity-0" : "opacity-100"
            )}
        >
            <LuxuryLoader />
        </div>
    );
}
