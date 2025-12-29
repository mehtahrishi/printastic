
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { BulkAddProductsForm } from "./bulk-add-products-form";


export function BulkAddProductsButton() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Layers className="mr-2 h-4 w-4" />
                    Bulk Add
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh]" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Bulk Add Products</DialogTitle>
                    <DialogDescription>
                        Add multiple products at once. A placeholder image will be used for all.
                    </DialogDescription>
                </DialogHeader>
                <BulkAddProductsForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
