"use client";

import { useState } from "react";
import { Shield, Truck, Copy, Check, ChevronDown, ChevronUp, Shirt } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

const cards = [
    {
        id: "cod",
        title: "SECURE YOUR COD ORDER",
        icon: Shield,
        content: "To keep COD available while reducing return abuse, we now require a 15% advance payment on COD orders. This helps cover shipping costs in case of non-acceptance. Thank you for understanding and supporting small businesses like ours!",
        color: "bg-blue-50/50 text-blue-700",
        iconColor: "text-blue-600"
    },
    {
        id: "wash",
        title: "WASH & CARE",
        icon: Shirt,
        content: "Wash inside out to protect the print.\nMachine/Hand wash with similar colors in cold water.\nDo not iron directly on the print.",
        color: "bg-pink-50/50 text-pink-700",
        iconColor: "text-pink-600"
    },
    {
        id: "shipping",
        title: "SHIPPING INFO",
        icon: Truck,
        content: "Orders are processed within 1-3 business days.\nWe use various courier agents for shipping.\nTracking information is provided via Whatsapp once the product is dispatched.\nOrders are delivered within 7-10 business days.\nCustomers are responsible for accurate shipping information.\nFor undeliverable packages, customers may incur return shipping fees.\nContact us for tracking issues or inquiries.",
        color: "bg-amber-50/50 text-amber-700",
        iconColor: "text-amber-600"
    }
];

export function ProductInfoCards() {
    return (
        <div className="flex flex-col gap-3 mt-8">
            {cards.map((card) => (
                <InfoCardItem key={card.id} card={card} />
            ))}
        </div>
    );
}

function InfoCardItem({ card }: { card: typeof cards[0] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [justCopied, setJustCopied] = useState(false);
    const { toast } = useToast();

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(card.content);
        setJustCopied(true);
        toast({
            description: "Information copied to clipboard!",
            duration: 2000,
        });
        setTimeout(() => setJustCopied(false), 2000);
    };

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="border rounded-lg overflow-hidden bg-white shadow-sm"
        >
            <CollapsibleTrigger asChild>
                <div className={cn(
                    "flex items-center justify-between p-4 cursor-pointer hover:opacity-80 transition-opacity",
                    card.color
                )}>
                    <div className="flex items-center gap-3">
                        <card.icon className={cn("w-5 h-5", card.iconColor)} />
                        <span className="font-semibold text-sm tracking-tight">{card.title}</span>
                    </div>
                    {isOpen ? (
                        <ChevronUp className="w-4 h-4 opacity-60" />
                    ) : (
                        <ChevronDown className="w-4 h-4 opacity-60" />
                    )}
                </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className="p-4 bg-white relative">
                    <ul className="text-sm text-foreground/80 leading-relaxed list-disc pl-4 space-y-1">
                        {card.content.split(/\n|\. /).map((line, idx) => {
                            const trimmed = line.replace('.', '').trim();
                            if (!trimmed) return null;
                            return <li key={idx}>{trimmed}</li>;
                        })}
                    </ul>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
