"use client";

import { useEffect } from "react";
import { signOut } from "@/actions/signout";
import { Loader2 } from "lucide-react";

export default function SignOutPage() {
    useEffect(() => {
        signOut();
    }, []);

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Signing out...</p>
            </div>
        </div>
    );
}
