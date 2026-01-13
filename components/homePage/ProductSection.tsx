"use client";

import { All_CATEGORIES_QUERYResult, FILTER_PRODUCTS_BY_NAME_QUERYResult } from "@/sanity.types";
import { useState } from "react";
import { Button } from "../ui/button";
import { PanelLeft, PanelLeftClose } from "lucide-react";


interface ProductSectionProps {
    categories:All_CATEGORIES_QUERYResult;
    products:FILTER_PRODUCTS_BY_NAME_QUERYResult;
    searchQuery: string;
}

export function ProductSection({
    categories,
    products,
    searchQuery,
}: ProductSectionProps){
    const [filterOpen,setfilterOpen] = useState(true);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {products.length} {products.length === 1 ? "product" : "products"}{" "} 
                    found
                    {searchQuery && (
                        <span>
                            {" "}
                            for &quot;<span className="font-medium">{searchQuery}</span>
                        </span>
                    )}
                </p>
                {/* toggle button */}
                <Button 
                variant="outline"
                size="sm"
                onClick={() => setfilterOpen(!filterOpen)}
                className="flex items-center gap-2 border-zinc-300 bg-white shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover*:bg-zinc-800"
                aria-label={filterOpen ? "Hide filters" : "Show filters"}
                >
                    {filterOpen ? (
                        <>
                        <PanelLeftClose className="h-4 w-4" />
                        <span className="hidden sm:inline">Hide Filters</span>
                        <span className="sm:inline">Hide</span>
                        </>
                    ):(
                        <>
                        <PanelLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Hide Filters</span>
                        <span className="sm:inline">Hide</span>
                        </>
                    )}
                </Button>
            </div>
            {/* contain area */}
            <div className="flex flex-col gap-8 lg:flex-row">
                <aside className={`shrink-0 transition-all duration-300 esae-in-out ${filterOpen ? "w-full lg:opacity-100" : "hidden lg:hidden"}`}>
                    <ProductFilters categories={categories} />
                </aside>

                <main className="flex-1 transition-all duration-300">
                    <ProductGrid products={products} />
                </main>
            </div>
        </div>
    );
}