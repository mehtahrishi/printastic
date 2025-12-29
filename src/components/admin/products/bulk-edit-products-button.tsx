"use client";

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { BulkEditProductsForm } from "./bulk-edit-products-form";

export function BulkEditProductsButton() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button 
                variant="outline" 
                size="sm"
                onClick={() => setOpen(true)}
            >
                <Edit className="mr-2 h-4 w-4" />
                Bulk Edit
            </Button>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Bulk Edit Products</DialogTitle>
                    <DialogDescription>
                        Select a category to edit all products in that category.
                    </DialogDescription>
                </DialogHeader>
                <BulkEditProductsForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
