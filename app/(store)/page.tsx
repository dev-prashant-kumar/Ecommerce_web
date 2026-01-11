import FeaturedCarousel from "@/components/FeaturedCarousel";
import { sanityFetch } from "@/sanity/lib/live";
import { All_CATEGORIES_QUERY } from "@/sanity/queries/categories";
import {
  FILTER_PRODUCTS_BY_RELEVANCE_QUERY,
  FILTER_PRODUCTS_BY_PRICE_ASC_QUERY,
  FILTER_PRODUCTS_BY_PRICE_DESC_QUERY,
  FILTER_PRODUCTS_BY_NAME_QUERY,
  FEATURED_PRODUCTS_QUERY,
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
  const searchQuery = searchParams.q?.trim();
  const sort = searchParams.sort ?? "name";

  const params = {
    search: searchQuery ?? "",
    category: searchParams.category ?? "",

    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : 0,

    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : 999999,

    inStock: searchParams.inStock === "true",
    featured: searchParams.featured === "true",
    discounted: searchParams.discounted === "true",

    limit: 12,
    offset: (Number(searchParams.page ?? "1") - 1) * 12,
  };

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

  const [{ data: categories }, { data: featuredProducts }, { data: products }] =
    await Promise.all([
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

  return (
    <div className="">
      <Suspense fallback={<div>Loading...</div>}>
        <FeaturedCarousel products={featuredProducts} />
      </Suspense>

    </div>
  );
}
