
"use client";

import { useTransition } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema } from "@/schemas";
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
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { useToast } from "@/hooks/use-toast";
import { requestPasswordReset } from "@/actions/request-password-reset";

export const ForgotPasswordForm = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
        startTransition(() => {
            requestPasswordReset(values).then((data) => {
                if (data.error) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: data.error,
                    });
                } else {
                    toast({
                        title: "Request Sent",
                        description: data.success,
                    });
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
                className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="p-8">
                    <div className="flex flex-col items-center mb-8 text-center space-y-4">
                        <Link href="/" className="flex items-center gap-2 text-2xl">
                            <Logo className="w-auto h-auto" />
                        </Link>
                        <p className="text-zinc-500 dark:text-zinc-400">
                            Enter your email to receive a password reset link.
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-700 dark:text-zinc-300">
                                            Email Address
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="you@example.com"
                                                type="email"
                                                className="bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-ring transition-all rounded-xl h-12"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                disabled={isPending}
                                type="submit"
                                className="w-full bg-primary text-primary-foreground h-12 rounded-xl text-base font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Reset Link
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>

                     <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Remember your password?{" "}
                            <Link
                                href="/login"
                                className="text-primary font-medium hover:underline"
                            >
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
