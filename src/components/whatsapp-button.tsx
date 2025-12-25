"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  variant?: "fixed" | "inline";
}

export function WhatsAppButton({ 
  phoneNumber, 
  message = "Hi! I'd like to get in touch with you.",
  variant = "inline"
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (variant === "fixed") {
    return (
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1.5 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat with us
        </span>
      </button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      className="bg-[#25D366] hover:bg-[#20BA5A] text-white gap-2"
      size="lg"
    >
      <MessageCircle className="h-5 w-5" />
      Chat on WhatsApp
    </Button>
  );
}
