"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Message = {
    id: string;
    role: "user" | "bot";
    content: string;
    timestamp: Date;
};

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "bot",
            content: "Hello! 👋 I'm your AI assistant. How can I help you with Printastic today?",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping, isOpen]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI delay and response
        setTimeout(() => {
            const botResponse = generateBotResponse(newUserMessage.content);
            const newBotMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "bot",
                content: botResponse,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, newBotMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    // Simple keyword-based response logic (Mock AI)
    const generateBotResponse = (input: string): string => {
        const lowerInput = input.toLowerCase();

        if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
            return "Hi there! It's great to see you. What can I do for you?";
        }
        if (lowerInput.includes("order") || lowerInput.includes("status") || lowerInput.includes("track")) {
            return "You can check your order status in the 'Orders' section of your dashboard. Need help finding it?";
        }
        if (lowerInput.includes("price") || lowerInput.includes("cost") || lowerInput.includes("quote")) {
            return "Our pricing depends on the product and quantity. You can view our catalog for specific prices, or contact support for a custom quote!";
        }
        if (lowerInput.includes("contact") || lowerInput.includes("support") || lowerInput.includes("email")) {
            return "You can reach our support team at support@printastic.com. We're here 24/7!";
        }
        if (lowerInput.includes("thank")) {
            return "You're very welcome! Let me know if you need anything else.";
        }

        return "I'm still learning! For complex queries, please check our FAQ or contact support. I can help with general navigation and simple questions.";
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-[350px] sm:w-[380px] shadow-2xl rounded-xl overflow-hidden border border-border/50"
                    >
                        <Card className="border-0 shadow-none h-[500px] flex flex-col bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
                            {/* Header */}
                            <CardHeader className="p-4 border-b bg-primary/5 flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-[#D2691E] flex items-center justify-center text-primary-foreground shadow-md">
                                            <Bot className="h-5 w-5" />
                                        </div>
                                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">Printy AI</CardTitle>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                            Just Online
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>

                            {/* Chat Area */}
                            <CardContent className="flex-1 p-0 overflow-hidden relative">
                                <div
                                    ref={scrollRef}
                                    className="h-full overflow-y-auto p-4 space-y-4 scroll-smooth"
                                >
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn(
                                                "flex w-max max-w-[80%] flex-col gap-2 rounded-2xl px-4 py-3 text-sm shadow-sm",
                                                msg.role === "user"
                                                    ? "ml-auto bg-gradient-to-br from-primary to-[#D2691E] text-primary-foreground rounded-br-none"
                                                    : "bg-muted text-foreground rounded-bl-none border border-border/50"
                                            )}
                                        >
                                            {msg.content}
                                            <span className={cn(
                                                "text-[10px] opacity-70 mt-1 block w-full text-right",
                                                msg.role === "user" ? "text-primary-foreground/80" : "text-muted-foreground"
                                            )}>
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </motion.div>
                                    ))}

                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center gap-2 text-muted-foreground text-xs p-2"
                                        >
                                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                                                <Bot className="h-3 w-3" />
                                            </div>
                                            <div className="flex gap-1">
                                                <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]"></span>
                                                <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]"></span>
                                                <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></span>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </CardContent>

                            {/* Footer / Input */}
                            <CardFooter className="p-3 border-t bg-background/50">
                                <form
                                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                    className="flex w-full items-center gap-2"
                                >
                                    <Input
                                        ref={inputRef}
                                        placeholder="Type a message..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="rounded-full bg-muted/50 border-transparent focus:border-input focus:bg-background transition-all"
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        disabled={!inputValue.trim() || isTyping}
                                        className="rounded-full h-10 w-10 shrink-0 shadow-sm"
                                    >
                                        <Send className="h-4 w-4" />
                                        <span className="sr-only">Send</span>
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    isOpen
                        ? "bg-destructive text-destructive-foreground rotate-90"
                        : "bg-gradient-to-r from-primary to-[#D2691E] text-primary-foreground hover:shadow-lg hover:shadow-primary/25"
                )}
            >
                <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {isOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <div className="relative">
                            <MessageCircle className="h-7 w-7" />
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-400"></span>
                            </span>
                        </div>
                    )}
                </motion.div>
                <span className="sr-only">Toggle Chat</span>
            </motion.button>
        </div>
    );
}
