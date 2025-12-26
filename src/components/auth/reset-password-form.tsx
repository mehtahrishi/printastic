
"use client";

import { useTransition, useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/schemas";
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
import { resetPassword } from "@/actions/reset-password";

export const ResetPasswordForm = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            password: "",
            token: token || "",
        },
    });

    const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
        if (!token) {
            toast({ variant: "destructive", title: "Error", description: "Reset token is missing." });
            return;
        }

        startTransition(() => {
            resetPassword(values).then((data) => {
                if (data.error) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: data.error,
                    });
                } else {
                    toast({
                        title: "Success",
                        description: data.success,
                    });
                    router.push("/login");
                }
            });
        });
    };

    if (!token) {
        return (
            <div className="w-full max-w-md mx-auto p-4 sm:p-8 text-center">
                <p className="text-destructive">Invalid or missing password reset token.</p>
                <Button asChild className="mt-4">
                    <Link href="/forgot-password">Request a new link</Link>
                </Button>
            </div>
        );
    }

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
                            Enter your new password.
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-700 dark:text-zinc-300">
                                            New Password
                                        </FormLabel>
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
                            <FormField control={form.control} name="token" render={({ field }) => <Input type="hidden" {...field} />} />

                            <Button
                                disabled={isPending}
                                type="submit"
                                className="w-full bg-primary text-primary-foreground h-12 rounded-xl text-base font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        Update Password
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </motion.div>
        </div>
    );
};
