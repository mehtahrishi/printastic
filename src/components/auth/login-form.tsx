
"use client";

import { useTransition, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
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
import { login } from "@/actions/login";
import { Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { useToast } from "@/hooks/use-toast";

export const LoginForm = () => {
    const [isPending, startTransition] = useTransition();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        startTransition(() => {
            login(values).then((data) => {
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
                        description: data.success,
                    });
                    setTimeout(() => {
                        window.location.href = "/account";
                    }, 500);
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
                            Sign in to continue your printing journey.
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-zinc-700 dark:text-zinc-300">
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="hello@example.com"
                                                    type="email"
                                                    className="bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-ring transition-all rounded-xl h-12"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between">
                                                <FormLabel className="text-zinc-700 dark:text-zinc-300">
                                                    Password
                                                </FormLabel>
                                                <Button
                                                    size="sm"
                                                    variant="link"
                                                    asChild
                                                    className="px-0 font-normal text-primary hover:no-underline"
                                                >
                                                    <Link href="/forgot-password">Forgot password?</Link>
                                                </Button>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="••••••••"
                                                    type="password"
                                                    className="bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-ring transition-all rounded-xl h-12"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button
                                disabled={isPending || isRedirecting}
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
                                        Sign In
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center">
                        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                className="text-primary font-medium hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
