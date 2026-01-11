import { defineQuery } from "next-sanity";

/**
 * =========================
 * BASE PRODUCT PROJECTION
 * (Reusable)
 * =========================
 */
export const PRODUCT_PROJECTION = `
{
  _id,
  title,
  "slug": slug.current,
  price,
  discountPrice,
  inStock,
  quantity,
  featured,
  description,

  categories[]->{
    _id,
    title,
    "slug": slug.current
  },

  images[]{
    asset->{
      _id,
      url
    },
    hotspot
  }
}
`;

/**
 * =========================
 * BASIC PRODUCT QUERIES
 * =========================
 */

/** All products */
export const ALL_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"] | order(_createdAt desc)
  ${PRODUCT_PROJECTION}
`);

/** Product by ID */
export const PRODUCT_BY_ID_QUERY = defineQuery(`
  *[_type == "product" && _id == $id][0]
  ${PRODUCT_PROJECTION}
`);

/** Product by slug */
export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0]
  ${PRODUCT_PROJECTION}
`);

/**
 * =========================
 * CATEGORY FILTERS
 * =========================
 */

/** Products by category slug */
export const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "product" && $categorySlug in categories[]->slug.current]
  | order(_createdAt desc)
  ${PRODUCT_PROJECTION}
`);

/**
 * =========================
 * SEARCH & NAME FILTERS
 * =========================
 */

/** Search by product name */
export const SEARCH_PRODUCTS_BY_NAME_QUERY = defineQuery(`
  *[_type == "product" && title match $search + "*"]
  | order(_createdAt desc)
  ${PRODUCT_PROJECTION}
`);

/**
 * =========================
 * PRICE FILTERS
 * =========================
 */

/** Price: Low → High */
export const PRODUCTS_PRICE_ASC_QUERY = defineQuery(`
  *[_type == "product"] | order(price asc)
  ${PRODUCT_PROJECTION}
`);

/** Price: High → Low */
export const PRODUCTS_PRICE_DESC_QUERY = defineQuery(`
  *[_type == "product"] | order(price desc)
  ${PRODUCT_PROJECTION}
`);

/** Filter by price range */
export const PRODUCTS_BY_PRICE_RANGE_QUERY = defineQuery(`
  *[_type == "product" && price >= $min && price <= $max]
  | order(price asc)
  ${PRODUCT_PROJECTION}
`);

/**
 * =========================
 * STOCK FILTERS
 * =========================
 */

/** In-stock products */
export const IN_STOCK_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && inStock == true]
  ${PRODUCT_PROJECTION}
`);

/** Out-of-stock products */
export const OUT_OF_STOCK_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && inStock == false]
  ${PRODUCT_PROJECTION}
`);

/** Low stock products (admin use) */
export const LOW_STOCK_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && quantity < $threshold]
  | order(quantity asc)
  ${PRODUCT_PROJECTION}
`);

/**
 * =========================
 * FEATURED & PROMOTIONAL
 * =========================
 */

/** Featured products */
export const FEATURED_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && featured == true]
  | order(_createdAt desc)
  ${PRODUCT_PROJECTION}
`);

/** Discounted products */
export const DISCOUNTED_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && defined(discountPrice)]
  | order(discountPrice asc)
  ${PRODUCT_PROJECTION}
`);

/**
 * =========================
 * SORTING OPTIONS
 * =========================
 */

/** New arrivals */
export const NEW_ARRIVALS_QUERY = defineQuery(`
  *[_type == "product"]
  | order(_createdAt desc)
  ${PRODUCT_PROJECTION}
`);

/** Best sellers (manual / quantity-based) */
export const BEST_SELLER_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"]
  | order(quantity desc)
  ${PRODUCT_PROJECTION}
`);

/**
 * =========================
 * PAGINATION (IMPORTANT)
 * =========================
 */

/** Paginated products */
export const PAGINATED_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"]
  | order(_createdAt desc)[$start...$end]
  ${PRODUCT_PROJECTION}
`);

/**
 * =========================
 * COUNTS (DASHBOARD)
 * =========================
 */

export const PRODUCT_COUNT_QUERY = defineQuery(`
  count(*[_type == "product"])
`);

export const OUT_OF_STOCK_COUNT_QUERY = defineQuery(`
  count(*[_type == "product" && inStock == false])
`);

export const LOW_STOCK_COUNT_QUERY = defineQuery(`
  count(*[_type == "product" && quantity < $threshold])
`);

/**
 * =========================
 * FILTER: RELEVANCE
 * =========================
 */
export const FILTER_PRODUCTS_BY_RELEVANCE_QUERY = defineQuery(`
*[
  _type == "product"
  && (
    title match $search + "*" ||
    description match $search + "*"
  )
]
| score(
    boost(title match $search + "*", 3),
    boost(description match $search + "*", 1)
  )
| order(_score desc)
${PRODUCT_PROJECTION}
`);
/**
 * =========================
 * FILTER: NAME A–Z
 * =========================
 */
export const FILTER_PRODUCTS_BY_NAME_QUERY = defineQuery(`
*[
  _type == "product"
  && (!defined($search) || title match $search + "*")
]
| order(title asc)
${PRODUCT_PROJECTION}
`);
/**
 * =========================
 * FILTER: PRICE ASC
 * =========================
 */
export const FILTER_PRODUCTS_BY_PRICE_ASC_QUERY = defineQuery(`
*[
  _type == "product"
  && (!defined($search) || title match $search + "*")
]
| order(price asc)
${PRODUCT_PROJECTION}
`);
/**
 * =========================
 * FILTER: PRICE DESC
 * =========================
 */
export const FILTER_PRODUCTS_BY_PRICE_DESC_QUERY = defineQuery(`
*[
  _type == "product"
  && (!defined($search) || title match $search + "*")
]
| order(price desc)
${PRODUCT_PROJECTION}
`);
/**
 * =========================
 * MASTER PRODUCT FILTER QUERY
 * =========================
 */
export const FILTER_PRODUCTS_MASTER_QUERY = defineQuery(`
*[
  _type == "product"

  // Search
  && (!defined($search) || title match $search + "*")

  // Category
  && (!defined($category) || $category in categories[]->slug.current)

  // Price range
  && (!defined($minPrice) || price >= $minPrice)
  && (!defined($maxPrice) || price <= $maxPrice)

  // Stock
  && (!defined($inStock) || inStock == $inStock)

  // Featured
  && (!defined($featured) || featured == $featured)

  // Discounted
  && (!defined($discounted) || defined(discountPrice))
]
| order(
  select(
    $sort == "relevance" => _score desc,
    $sort == "priceAsc" => price asc,
    $sort == "priceDesc" => price desc,
    $sort == "nameAsc" => title asc,
    $sort == "nameDesc" => title desc,
    _createdAt desc
  )
)
[$offset...$offset + $limit]
${PRODUCT_PROJECTION}
`);
/**
 * =========================
 * FILTERED PRODUCT COUNT
 * =========================
 */
export const FILTERED_PRODUCT_COUNT_QUERY = defineQuery(`
count(
  *[
    _type == "product"
    && (!defined($search) || title match $search + "*")
    && (!defined($category) || $category in categories[]->slug.current)
    && (!defined($minPrice) || price >= $minPrice)
    && (!defined($maxPrice) || price <= $maxPrice)
    && (!defined($inStock) || inStock == $inStock)
  ]
)
`);
