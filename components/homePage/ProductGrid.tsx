
import { FILTER_PRODUCTS_BY_NAME_QUERYResult } from "@/sanity.types";
import { EmptyState } from "../ui/empty-state";
import { PackageSearch } from "lucide-react";
import { ProductCard } from "./ProductCard";


interface ProductGridProps{
    products:FILTER_PRODUCTS_BY_NAME_QUERYResult;
}

export function ProductGrid({products}:ProductGridProps){
    if (products.length === 0) {
        return (
            <div className="min-h-[400px] rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
                <EmptyState icon={PackageSearch} title="No product found" description="Try another search or another filter"
                size="lg" />
            </div>
        );
        
    }
    return (
        <div className="@container">
            <div className="grid grid-cols-1 gap-6 @md:grid-cols-2 @xl:grid-cols-4 @md:gap-8">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product}/>
                    
                ))}
                
            </div>
        </div>
    )
}