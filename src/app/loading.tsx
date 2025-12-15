import { LuxuryLoader } from "@/components/ui/luxury-loader";

export default function Loading() {
    return (
        <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-background">
            <LuxuryLoader />
        </div>
    );
}
