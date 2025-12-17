
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, MapPin, Phone, CreditCard } from "lucide-react";
import { CustomerPdfButton } from "@/components/admin/customer-pdf-button";
import { SearchInput } from "@/components/admin/search-input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Helper to get initials
function getInitials(name: string | null) {
    if (!name) return "U";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export default async function CustomersPage({
    searchParams
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const resolvedSearchParams = await searchParams;
    const query = typeof resolvedSearchParams?.query === 'string' ? resolvedSearchParams.query.toLowerCase() : '';

    // Fetch all users sorted by latest creation
    const allUsers = await db.select().from(users);

    const sortedUsers = allUsers.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
    });

    const filteredUsers = sortedUsers.filter(user => {
        if (!query) return true;
        const name = user.name?.toLowerCase() || '';
        const email = user.email?.toLowerCase() || '';
        const phone = user.phone?.toLowerCase() || '';
        const address = user.address?.toLowerCase() || '';
        const city = user.city?.toLowerCase() || '';

        return name.includes(query) ||
            email.includes(query) ||
            phone.includes(query) ||
            address.includes(query) ||
            city.includes(query);
    });

    return (
        <div className="container py-8 space-y-6">

            {/* Header Section */}
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Customers Data</h1>

                {/* Search Bar - Full Width below heading */}
                <SearchInput placeholder="Search customers by name, email, phone..." />
            </div>

            {/* --- MOBILE VIEW: Cards --- */}
            <div className="grid grid-cols-1 gap-6 md:hidden">
                {filteredUsers.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                        No customers found matching &quot;{query}&quot;.
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardContent className="p-0">
                                {/* Card Header Area */}
                                <div className="p-6 pb-4 border-b bg-muted/30">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                            <AvatarImage src="" />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <h3 className="font-semibold text-lg leading-tight">{user.name || "Unknown User"}</h3>
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Customer</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Details Area */}
                                <div className="p-6 space-y-4">

                                    {/* Email */}
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                            <Mail className="h-3 w-3" /> Email
                                        </span>
                                        <span className="text-sm truncate" title={user.email}>{user.email}</span>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                            <Phone className="h-3 w-3" /> Phone
                                        </span>
                                        <span className="text-sm">{user.phone || "N/A"}</span>
                                    </div>

                                    {/* Address */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-1">
                                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> Address
                                            </span>
                                            <div className="text-sm flex flex-col">
                                                <span className="truncate" title={user.address || ""}>{user.address || "N/A"}</span>
                                                {user.apartment && (
                                                    <span className="text-xs text-muted-foreground truncate">{user.apartment}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <span className="text-xs font-medium text-muted-foreground">Location</span>
                                            <div className="text-sm flex flex-col">
                                                <span>{user.city || "-"}</span>
                                                <span className="text-xs text-muted-foreground">{user.postalCode}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Spent */}
                                    <div className="flex flex-col space-y-1 pt-2 border-t">
                                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                            <CreditCard className="h-3 w-3" /> Total Spent
                                        </span>
                                        <span className="text-lg font-bold text-primary">₹0.00</span>
                                    </div>
                                </div>

                                {/* Actions Footer */}
                                <div className="grid grid-cols-2 gap-px bg-border">
                                    <Button
                                        variant="ghost"
                                        className="rounded-none h-12 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                        asChild
                                    >
                                        <a href={`mailto:${user.email}`}>
                                            <Mail className="h-4 w-4 mr-2" />
                                            Email
                                        </a>
                                    </Button>
                                    <div className="flex items-center justify-center bg-background hover:bg-muted transition-colors">
                                        <CustomerPdfButton user={user} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* --- DESKTOP VIEW: Table --- */}
            <div className="hidden md:block">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex flex-col space-y-1.5">
                            <CardTitle>Registered Users <span className="text-muted-foreground ml-2 text-sm font-normal">({filteredUsers.length})</span></CardTitle>
                            <CardDescription>
                                A list of all users registered on the platform.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 lg:p-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Spent</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No customers found matching &quot;{query}&quot;.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src="" />
                                                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{user.name || "Unknown"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-muted-foreground">{user.email}</span>
                                            </TableCell>
                                            <TableCell>
                                                {user.phone ? (
                                                    <span className="text-sm">{user.phone}</span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {user.address ? (
                                                    <div className="flex flex-col max-w-[200px]">
                                                        <span className="text-sm truncate" title={user.address}>{user.address}</span>
                                                        {user.apartment && (
                                                            <span className="text-xs text-muted-foreground truncate" title={user.apartment}>{user.apartment}</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {user.city ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-sm">{user.city}</span>
                                                        <span className="text-xs text-muted-foreground">{user.postalCode}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm font-medium">₹0.00</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={`mailto:${user.email}`}>
                                                            <Mail className="h-4 w-4 mr-2" />
                                                            Email
                                                        </a>
                                                    </Button>
                                                    <CustomerPdfButton user={user} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
