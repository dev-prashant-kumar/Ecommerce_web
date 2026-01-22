import { CategoryTiles } from "@/components/homePage/CategoryTiles";
import FeaturedCarousel from "@/components/homePage/FeaturedCarousel";
import { FeaturedCarouselSkeleton } from "@/components/homePage/FeaturedCarouselSkeleton";
import { ProductGrid } from "@/components/homePage/ProductGrid";
import { ProductSection } from "@/components/homePage/ProductSection";

import { sanityFetch } from "@/sanity/lib/live";
import { All_CATEGORIES_QUERY } from "@/sanity/queries/categories";
import {
  FEATURED_PRODUCTS_QUERY,
  FILTER_PRODUCTS_MASTER_QUERY,
} from "@/sanity/queries/products";

import { Suspense } from "react";

interface PageProps {
  searchParams: Promise< {
    q?: string;
    category?: string;
    color?: string;
    size?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {

// 1. Rename the resolved promise to 'resolvedSearchParams'
  const resolvedSearchParams = await searchParams;

  // 2. Extract values from 'resolvedSearchParams'
  const searchQuery = resolvedSearchParams.q?.trim() || "";
  const categorySlug = resolvedSearchParams.category ?? "";
  const sort = resolvedSearchParams.sort ?? "newest";
  const page = Number(resolvedSearchParams.page ?? "1");
  const limit = 12;

  // 3. Create the object for Sanity and name it 'params' 
  // (This makes it available for the fetch call below)
  const params = {
    search: searchQuery ? `${searchQuery}*` : null,
    category: categorySlug || null,
    color: resolvedSearchParams.color ?? null,
    size: resolvedSearchParams.size ?? null,
    minPrice: resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : null,
    maxPrice: resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : null,
    inStock:
      resolvedSearchParams.inStock === "true"
        ? true
        : resolvedSearchParams.inStock === "false"
        ? false
        : null,
    sort,
    start: (page - 1) * limit,
    end: page * limit,
  };

  /* =============================
      FETCH DATA
  ============================== */
  const [
    { data: categories },
    { data: featuredProducts },
    { data: products },
  ] = await Promise.all([
    sanityFetch({
      query: All_CATEGORIES_QUERY,
    }),
    sanityFetch({
      query: FEATURED_PRODUCTS_QUERY,
    }),
    sanityFetch({
      query: FILTER_PRODUCTS_MASTER_QUERY,
      params, // <--- This now points to the 'const params' defined above
    }),
  ]);

  /* =============================
     RENDER
  ============================== */

  return (
    <div className="space-y-12">
      {/* Featured carousel */}
      <Suspense fallback={<FeaturedCarouselSkeleton />}>
        <FeaturedCarousel products={featuredProducts} />
      </Suspense>

      {/* Header + Categories */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Shop {categorySlug || "All Products"}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Categories of our products
          </p>
        </div>

        {/* Category tiles */}
        <div className="mt-6">
          <CategoryTiles
            categories={categories}
            activeCategory={categorySlug || undefined}
          />
        </div>
      </div>

      {/* Products grid */}
      <ProductSection products={products} categories={categories} searchQuery={searchQuery} />
      
    </div>
  );
}
