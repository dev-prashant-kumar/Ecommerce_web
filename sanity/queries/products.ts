import { defineQuery } from "next-sanity";

/**
 * ==================================================
 * TYPESCRIPT INTERFACES
 * ==================================================
 */
export interface Product {
  _id: string;
  createdAt: string;

  title: string;
  description: string | null;

  price: number;
  discountPrice?: number | null;

  featured: boolean;
  inStock: boolean;
  quantity: number;

  slug: {
    current: string;
  } | null;

  image: {
    asset: {
      _id: string;
      url: string;
    } | null;
  } | null;

  gallery?: Array<{
    asset: {
      _id: string;
      url: string;
    } | null;
  }> | null;

  categories?: Array<{
    _id: string;
    title: string;
    slug: {
      current: string;
    } | null;
  }> | null;

  colors?: Array<{
    name: string;
    hex: string;
  }> | null;

  sizes?: string[] | null;

  variants?: Array<{
    sku: string;
    color: string;
    size: string;
    price: number;
    inStock: boolean;
    quantity: number;
  }> | null;
}


/**
 * ==================================================
 * BASE PRODUCT PROJECTION
 * ==================================================
 */
export const PRODUCT_PROJECTION = `
  _id,
  title,
  description,
  price,
  discountPrice,
  featured,
  inStock,
  quantity,
  _createdAt,
  createdAt,

  slug {
    current
  },

  image {
    asset->{
      _id,
      url
    }
  },

  gallery[] {
    asset->{
      _id,
      url
    }
  },

  categories[]->{
    _id,
    title,
    slug {
      current
    }
  },

  colors[]{
    name,
    hex
  },

  sizes,

  variants[]{
    sku,
    color,
    size,
    price,
    inStock,
    quantity
  }
`;


/**
 * ==================================================
 * MASTER FILTER QUERY (FIXED SORTING)
 * ==================================================
 */
export const FILTER_PRODUCTS_MASTER_QUERY = defineQuery(`
*[
  _type == "product"
  && (!defined($search) || title match $search + "*")
  && (!defined($category) || $category in categories[]->slug.current)
  && (!defined($minPrice) || price >= $minPrice)
  && (!defined($maxPrice) || price <= $maxPrice)
  && (!defined($inStock) || inStock == $inStock)
] | order(
  select($sort == "price_asc" => price) asc,
  select($sort == "price_desc" => price) desc,
  select($sort == "newest" => _createdAt) desc,
  title asc
)[$start...$end] {
  ${PRODUCT_PROJECTION}
}
`);

/**
 * ==================================================
 * HELPER QUERIES
 * ==================================================
 */

export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
*[_type == "product" && slug.current == $slug][0]{
  _id,
  title,
  description,
  price,
  discountPrice,
  inStock,
  quantity,
  createdAt,

  "images": gallery[].asset->url,

  categories[]->{
    _id,
    title,
    "slug": slug.current
  },

  colors[]{
    name,
    hex
  },

  sizes,

  variants[]{
    sku,
    color,
    size,
    price,
    inStock,
    quantity
  }
}
`);


export const FEATURED_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && featured == true] | order(_createdAt desc) { ${PRODUCT_PROJECTION} }
`);

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

export const FILTER_PRODUCTS_BY_NAME_QUERY = defineQuery(`
*[
  _type == "product"
  // Only filter by name if $name is actually provided
  && (!defined($name) || title match $name + "*")
] | order(title asc) {
  ${PRODUCT_PROJECTION}
}
`);
export const FILTER_PRODUCTS_BY_PRICE_ASC_QUERY = defineQuery(`
  *[_type == "product"] | order(price asc) {
    ${PRODUCT_PROJECTION}
  }
`);

export const FILTER_PRODUCTS_BY_PRICE_DESC_QUERY = defineQuery(`
  *[_type == "product"] | order(price desc) [$start...$end] {
    ${PRODUCT_PROJECTION}
  }
`);

export const FILTER_PRODUCTS_BY_RELEVANCE_QUERY = defineQuery(`
*[_type == "product" && (title match $search + "*" || description match $search + "*")] 
| order(
  select(
    title match $search + "*" => 2,
    description match $search + "*" => 1,
    0
  ) desc,
  title asc
) [$start...$end] {
  ${PRODUCT_PROJECTION}
}
`);

export const PRODUCTS_BY_IDS_QUERY = defineQuery(`
  *[_type == "product" && _id in $ids] {
    _id,
    title,
    price,
    quantity,
    "images": images[].asset->url
  }
`);
