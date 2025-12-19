
"use client";

import { useTransition, useState, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerifySchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { verifyOtp } from "@/actions/verify-otp";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export const VerifyForm = () => {
    const [isPending, startTransition] = useTransition();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof VerifySchema>>({
        resolver: zodResolver(VerifySchema),
        defaultValues: {
            otp: "",
        },
    });

    useEffect(() => {
        if (timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const onSubmit = (values: z.infer<typeof VerifySchema>) => {
        startTransition(() => {
            verifyOtp(values).then((data) => {
                if (data.error) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: data.error,
                    });
                } else {
                    setIsRedirecting(true);
                    toast({
                        title: "Success",
                        description: "Logged in successfully!",
                    });
                    setTimeout(() => {
                        router.push("/");
                    }, 1000);
                }
            });
        });
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 sm:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border border-white/20 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="p-8">
                    <div className="flex flex-col items-center mb-8 text-center space-y-4">
                        <Link href="/" className="flex items-center gap-2 text-2xl">
                            <Logo className="w-auto h-auto" />
                        </Link>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                            We sent a 6-digit code to your email. Enter it below to confirm your identity.
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="otp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-center w-full block text-zinc-700 dark:text-zinc-300">
                                                Authentication Code
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="123456"
                                                    className="bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-ring transition-all rounded-xl h-14 text-center text-2xl tracking-[0.5em] font-mono"
                                                    maxLength={6}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-center">
                                <div className={`text-sm font-medium ${timeLeft < 30 ? "text-red-500" : "text-zinc-500"}`}>
                                    Time remaining: {formatTime(timeLeft)}
                                </div>
                            </div>

                            <Button
                                disabled={isPending || isRedirecting || timeLeft <= 0}
                                type="submit"
                                className="w-full bg-primary text-primary-foreground h-12 rounded-xl text-base font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isRedirecting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                        Redirecting...
                                    </>
                                ) : isPending ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Verify & Login
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Didn&apos;t receive the code?{" "}
                            <button
                                disabled={timeLeft > 60}
                                className="text-primary font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => router.push("/login")}
                            >
                                Resend
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
