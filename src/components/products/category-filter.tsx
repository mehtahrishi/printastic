"use client";

import { useState, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import type { Product } from "@/lib/types";

interface CategoryFilterProps {
    products: Product[];
    onFilterChange: (filteredProducts: Product[]) => void;
}

export function CategoryFilter({ products, onFilterChange }: CategoryFilterProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    // Extract unique categories from products
    const categories = useMemo(() => {
        const uniqueCats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
        return uniqueCats.map((cat) => ({
            value: cat!.toLowerCase(), // Ensure lowercase for consistent matching
            label: cat!,
        }));
    }, [products]);

    const handleSelect = (currentValue: string) => {
        const newValue = currentValue === value ? "" : currentValue;
        setValue(newValue);
        setOpen(false);

        if (newValue === "") {
            onFilterChange(products);
        } else {
            const filtered = products.filter(p => p.category?.toLowerCase() === newValue);
            onFilterChange(filtered);
        }
    };

    const handleReset = () => {
        setValue("");
        onFilterChange(products);
    }

    return (
        <div className="flex items-center gap-2 mb-8 justify-center">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between bg-background"
                    >
                        {value
                            ? categories.find((framework) => framework.value === value)?.label
                            : "Select Category..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search category..." />
                        <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                                {categories.map((framework) => (
                                    <CommandItem
                                        key={framework.value}
                                        value={framework.value}
                                        onSelect={handleSelect}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === framework.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {framework.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {value && (
                <Button variant="ghost" size="sm" onClick={handleReset} className="h-10 px-3">
                    Reset
                </Button>
            )}
        </div>
    );
}
