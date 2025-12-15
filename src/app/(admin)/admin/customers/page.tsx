import { db } from "@/lib/db";
import { users } from "@/db/schema";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Mail, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomerPdfButton } from "@/components/admin/customer-pdf-button";

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
    // Check for admin session
    const cookieStore = await cookies();
    const isAdminLoggedIn = cookieStore.has("admin_session");

    if (!isAdminLoggedIn) {
        redirect("/admin/login");
    }

    // Fetch all users sorted by latest creation
    const allUsers = await db.select().from(users);

    const sortedUsers = allUsers.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
    });

    // Optional: Filter logic could be added here if 'search' param exists
    // const searchTerm = typeof searchParams?.search === 'string' ? searchParams.search.toLowerCase() : '';
    // const filteredUsers = sortedUsers.filter(...)

    return (
        <div className="container py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                    <p className="text-muted-foreground">
                        View and manage customer data.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex flex-col space-y-1.5">
                        <CardTitle>Registered Users <span className="text-muted-foreground ml-2 text-sm font-normal">({sortedUsers.length})</span></CardTitle>
                        <CardDescription>
                            A list of all users registered on the platform.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search customers..." className="pl-8 w-[250px]" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
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
                            {sortedUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No customers found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedUsers.map((user) => (
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
                                            <span className="text-sm font-medium">$0.00</span>
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
    );
}
