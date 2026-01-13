import { CategoryTiles } from "@/components/homePage/CategoryTiles";
import FeaturedCarousel from "@/components/homePage/FeaturedCarousel";
import { FeaturedCarouselSkeleton } from "@/components/homePage/FeaturedCarouselSkeleton";
import { sanityFetch } from "@/sanity/lib/live";
import { All_CATEGORIES_QUERY } from "@/sanity/queries/categories";
import {
  FEATURED_PRODUCTS_QUERY,
  FILTER_PRODUCTS_BY_RELEVANCE_QUERY,
  FILTER_PRODUCTS_BY_PRICE_ASC_QUERY,
  FILTER_PRODUCTS_BY_PRICE_DESC_QUERY,
  FILTER_PRODUCTS_BY_NAME_QUERY,
} from "@/sanity/queries/products";
import { Suspense } from "react";

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
  // NORMALIZED PARAMS
  // -----------------------------
const searchQuery = searchParams.q?.trim() || "";
const sort = searchParams.sort ?? "name";
const categorySlug = searchParams.category ?? "";

const page = Number(searchParams.page ?? "1");
const limit = 12;

const params = {
  search: searchQuery ? `${searchQuery}*` : "*",
  category: categorySlug,
  minPrice: searchParams.minPrice
    ? Number(searchParams.minPrice)
    : 0,
  maxPrice: searchParams.maxPrice
    ? Number(searchParams.maxPrice)
    : 999999,

  start: (page - 1) * limit,
  end: page * limit,
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
  // FETCH DATA
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
            Premium furniture for your home
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

      {/* Products grid comes next */}
      {/* <ProductGrid products={products} /> */}
    </div>
  );
}
