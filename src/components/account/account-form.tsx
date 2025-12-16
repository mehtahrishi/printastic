"use client";

import { useTransition, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema } from "@/schemas";
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
import { CheckCircle, Loader2, MapPin, Pencil } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { updateProfile } from "@/actions/update-profile";
import { useToast } from "@/hooks/use-toast";

type User = {
    id: number;
    name: string | null;
    email: string;
    phone: string | null;
    address: string | null;
    apartment: string | null;
    city: string | null;
    postalCode: string | null;
};

export const AccountForm = ({ user }: { user: User }) => {
    const [isPending, startTransition] = useTransition();
    const [isEditing, setIsEditing] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            name: user.name || "",
            phone: user.phone || "",
            address: user.address || "",
            apartment: user.apartment || "",
            city: user.city || "",
            postalCode: user.postalCode || "",
        },
    });

    const onSubmit = (values: z.infer<typeof ProfileSchema>) => {
        startTransition(() => {
            updateProfile(values).then((data) => {
                if (data.error) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: data.error,
                    });
                } else {
                    toast({
                        title: "Success",
                        description: "Profile updated successfully!",
                    });
                    setIsEditing(false); // Collapse on successful save
                }
            });
        });
    };

    const handleCancel = () => {
        form.reset({
            name: user.name || "",
            phone: user.phone || "",
            address: user.address || "",
            apartment: user.apartment || "",
            city: user.city || "",
            postalCode: user.postalCode || "",
        });
        setIsEditing(false);
    }

    const detectLocation = () => {
        if (!navigator.geolocation) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Geolocation is not supported by your browser.",
            });
            return;
        }

        toast({
            title: "Requesting Location...",
            description: "Please allow location access in your browser.",
        });

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    toast({
                        title: "Fetching Address...",
                        description: "Getting city and postal code details...",
                    });

                    const { latitude, longitude } = position.coords;
                    // Using free OpenStreetMap Nominatim API (No key required for low volume)
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );

                    if (!response.ok) throw new Error("Failed to fetch address");

                    const data = await response.json();
                    const addressData = data.address;

                    if (addressData) {
                        form.setValue("city", addressData.city || addressData.town || addressData.village || "");
                        form.setValue("postalCode", addressData.postcode || "");

                        toast({
                            title: "Location Detected",
                            description: "City and Postal Code have been autofilled.",
                        });
                    }
                } catch (error) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to resolve location details.",
                    });
                }
            },
            (error) => {
                let errorMessage = "Unable to retrieve your location.";
                if (error.code === error.PERMISSION_DENIED) {
                    errorMessage = "Location access denied. Please enable it in your browser settings.";
                }
                toast({
                    variant: "destructive",
                    title: "Location Error",
                    description: errorMessage,
                });
            }
        );
    };

    return (
        <div className="bg-card p-6 rounded-xl border shadow-sm">
            <div className="space-y-6">
                <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-4xl">
                        {user.name?.[0].toUpperCase()}
                    </div>
                </div>
                <div className="text-center">
                    <div className="flex justify-center items-center gap-2">
                        <p className="text-xl font-semibold">{user.name}</p>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Verified Account</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>

                <Separator />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                                    <p className="text-base">{user.phone || "Not provided"}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                                    <p className="text-base">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 items-center">
                                <h3 className="text-lg font-semibold">Shipping Address</h3>
                                <div className="flex items-center justify-end">
                                    {isEditing ? (
                                        <Button type="button" variant="outline" size="sm" onClick={detectLocation}>
                                            <MapPin className="w-4 h-4 mr-2" />
                                            Detect Location
                                        </Button>
                                    ) : (
                                        <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                            <Pencil className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {isEditing ? (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Address</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled={isPending} placeholder="123, Marine Drive" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="apartment"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Apartment, suite, etc. (optional)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled={isPending} placeholder="e.g. Apartment, suite, unit, building, floor, etc." />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>City</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={isPending} placeholder="Mumbai" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="postalCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Postal Code</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={isPending} placeholder="400001" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="p-4 bg-secondary/50 rounded-lg border text-sm text-muted-foreground">
                                    {user.address ? (
                                        <div>
                                            <p>{user.address}</p>
                                            {user.apartment && <p>{user.apartment}</p>}
                                            <p>{user.city}, {user.postalCode}</p>
                                        </div>
                                    ) : (
                                        <p>No shipping address provided.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {isEditing && (
                            <div className="pt-4 border-t grid grid-cols-2 gap-4">
                                <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </form>
                </Form>

                <Separator />

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Privacy Policy</h3>
                    <p className="text-sm text-muted-foreground">
                        Your privacy is paramount. We are committed to safeguarding your personal data
                        and adhere to stringent privacy standards. All your information is kept secure
                        and confidential.
                    </p>
                </div>
            </div>
        </div>
    );
};
