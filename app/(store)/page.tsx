import FeaturedCarousel from "@/components/FeaturedCarousel";
import { sanityFetch } from "@/sanity/lib/live";
import { All_CATEGORIES_QUERY } from "@/sanity/queries/categories";
import {
  FEATURED_PRODUCTS_QUERY,
  FILTER_PRODUCTS_BY_RELEVANCE_QUERY,
  FILTER_PRODUCTS_BY_PRICE_ASC_QUERY,
  FILTER_PRODUCTS_BY_PRICE_DESC_QUERY,
  FILTER_PRODUCTS_BY_NAME_QUERY,
} from "@/sanity/queries/products";
import { ca } from "date-fns/locale";
import { Suspense } from "react";

/**
 * ✅ IMPORTANT:
 * searchParams is NOT a Promise in Next.js App Router
 */
interface PageProps {
  searchParams: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    featured?: string;
    discounted?: string;
    sort?: string;
    page?: string;
  };
}

export default async function Home({ searchParams }: PageProps) {
  // -----------------------------
  // SEARCH & FILTER NORMALIZATION
  // -----------------------------
  const searchQuery = searchParams.q?.trim() || "";
  const sort = searchParams.sort ?? "name";
  const page = Number(searchParams.page ?? "1");


  const params = {
    search: searchQuery,
    category: searchParams.category || "",
    minPrice: searchParams.minPrice
      ? Number(searchParams.minPrice)
      : 0,
    maxPrice: searchParams.maxPrice
      ? Number(searchParams.maxPrice)
      : 999999,
    inStock: searchParams.inStock === "true",
    featured: searchParams.featured === "true",
    discounted: searchParams.discounted === "true",
    offset: (page - 1) * 12,
    limit: 12,
  };

  // -----------------------------
  // QUERY SELECTOR
  // -----------------------------
  const getQuery = () => {
    if (searchQuery && sort === "relevance") {
      return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
    }

    switch (sort) {
      case "price_asc":
        return FILTER_PRODUCTS_BY_PRICE_ASC_QUERY;
      case "price_desc":
        return FILTER_PRODUCTS_BY_PRICE_DESC_QUERY;
      default:
        return FILTER_PRODUCTS_BY_NAME_QUERY;
    }
  };

  // -----------------------------
  // DATA FETCHING
  // -----------------------------
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
      query: getQuery(),
      params,
    }),
  ]);

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="space-y-12">
      {/* Featured products carousel */}
      <Suspense fallback={<div>Loading featured products...</div>}>
        <FeaturedCarousel products={featuredProducts} />
      </Suspense>

      {/* banner */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Shop {categoriesSlug ? categoriesSlug : "All Products"}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Premium furnitures for your home
          </p>
        </div>
        {/* category tiles */}
        <div className="mt-6">
          <CategoryTiles categories={categories} activeCategory={categoriesSlug || undefined} />
        </div>
      </div>
      </div>
  );
}
