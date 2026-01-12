import { All_CATEGORIES_QUERYResult } from "@/sanity.types";
import Link from "next/link";

interface CategoryTilesProps{
    categories : All_CATEGORIES_QUERYResult,
    activeCategory?: string;
}

export function CategoryTiles({
    categories,
    activeCategory,
}: CategoryTilesProps) {
    return (
        <div className="relative">
            {/* horizontal scrolling */}
            <div className="flex gap-4 overflow-x-auto py-4 pl-8 pr-4 sm:pl-12 sm:pr-6 lg:pl-10 lg:pr-8 scrollbar-hide">
                {/* all products tile */}
                <Link href="/" className={`group relative flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${!activeCategory ? "ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-zinc-900" : "hover:ring-2 hover:ring-zinc-300 hover:ring-offset-2 dark:hover:ring-zinc-600 dark:hover:ring-offset-zinc-900"}`}}
                >
                    <div className="relative h-32 w-56 sm:h-56 sm:w-80">
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 dark:from-zinc-700 dark:to-zinc-800" />

                        

                    </div>
                
            </div>
        </div>
    )
}