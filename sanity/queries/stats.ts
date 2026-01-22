import { defineQuery } from "next-sanity";
import { PRODUCT_PROJECTION } from "./products";

/**
 * =========================
 * PRODUCT STATS
 * =========================
 */

/** Total products */
export const TOTAL_PRODUCTS_QUERY = defineQuery(`
  count(*[_type == "product"])
`);

/** In-stock products */
export const IN_STOCK_PRODUCTS_COUNT_QUERY = defineQuery(`
  count(*[_type == "product" && inStock == true])
`);

/** Out-of-stock products */
export const OUT_OF_STOCK_PRODUCTS_COUNT_QUERY = defineQuery(`
  count(*[_type == "product" && inStock == false])
`);

/** Low stock products (threshold dynamic) */
export const LOW_STOCK_PRODUCTS_COUNT_QUERY = defineQuery(`
  count(*[_type == "product" && quantity < $threshold])
`);

/** Featured products */
export const FEATURED_PRODUCTS_COUNT_QUERY = defineQuery(`
  count(*[_type == "product" && featured == true])
`);

/** Discounted products */
export const DISCOUNTED_PRODUCTS_COUNT_QUERY = defineQuery(`
  count(*[_type == "product" && defined(discountPrice)])
`);

/**
 * =========================
 * CATEGORY STATS
 * =========================
 */

/** Total categories */
export const TOTAL_CATEGORIES_QUERY = defineQuery(`
  count(*[_type == "category"])
`);

/**
 * =========================
 * CUSTOMER STATS
 * =========================
 */

/** Total customers */
export const TOTAL_CUSTOMERS_QUERY = defineQuery(`
  count(*[_type == "customer"])
`);

/** Customers with Stripe ID */
export const STRIPE_CUSTOMERS_COUNT_QUERY = defineQuery(`
  count(*[_type == "customer" && defined(stripeCustomerId)])
`);

/**
 * =========================
 * ORDER STATS
 * =========================
 */

/** Total orders */
export const TOTAL_ORDERS_QUERY = defineQuery(`
  count(*[_type == "order"])
`);

/** Orders by status */
export const PENDING_ORDERS_COUNT_QUERY = defineQuery(`
  count(*[_type == "order" && status == "pending"])
`);

export const PROCESSING_ORDERS_COUNT_QUERY = defineQuery(`
  count(*[_type == "order" && status == "processing"])
`);

export const SHIPPED_ORDERS_COUNT_QUERY = defineQuery(`
  count(*[_type == "order" && status == "shipped"])
`);

export const DELIVERED_ORDERS_COUNT_QUERY = defineQuery(`
  count(*[_type == "order" && status == "delivered"])
`);

export const CANCELLED_ORDERS_COUNT_QUERY = defineQuery(`
  count(*[_type == "order" && status == "cancelled"])
`);

/**
 * =========================
 * REVENUE STATS
 * =========================
 */

/** Total revenue (paid orders only) */
export const STATS_TOTAL_REVENUE_QUERY = defineQuery(`
  {
    "totalRevenue": math::sum(
      *[_type == "order" && status == "completed"].total
    )
  }
`);

/** Revenue today */
export const TODAY_REVENUE_QUERY = defineQuery(`
{
  "todayRevenue": math::sum(
    *[
      _type == "order"
      && status == "completed"
      && createdAt >= dateTime(now()) - 60*60*24
    ].total
  )
}
`);


/** Revenue this month */
export const MONTH_REVENUE_QUERY = defineQuery(`
{
  "monthRevenue": math::sum(
    *[
      _type == "order"
      && status == "completed"
      && createdAt >= dateTime(now()) - 60*60*24*30
    ].total
  )
}
`);


/**
 * =========================
 * ORDER VALUE STATS
 * =========================
 */

/** Average order value */
export const AVERAGE_ORDER_VALUE_QUERY = defineQuery(`
  math::avg(*[_type == "order" && status == "paid"].totalAmount)
`);

/** Highest order value */
export const MAX_ORDER_VALUE_QUERY = defineQuery(`
  math::max(*[_type == "order" && status == "paid"].totalAmount)
`);

/**
 * =========================
 * OPERATIONAL STATS
 * =========================
 */

/** Orders needing attention */
export const ATTENTION_ORDERS_COUNT_QUERY = defineQuery(`
  count(
    *[
      _type == "order" &&
      (status == "pending" || status == "processing")
    ]
  )
`);

/**
 * =========================
 * ORDERS – LAST 7 DAYS
 * =========================
 */

/** Orders created in last 7 days */
export const ORDERS_LAST_7_DAYS_QUERY = defineQuery(`
*[
  _type == "order"
  && createdAt >= dateTime(now()) - 60*60*24*7
]
`);

/** Count of orders in last 7 days */
export const ORDERS_LAST_7_DAYS_COUNT_QUERY = defineQuery(`
count(
  *[
    _type == "order"
    && createdAt >= dateTime(now()) - 60*60*24*7
  ]
)
`);

/**
 * =========================
 * ORDER STATUS DISTRIBUTION
 * =========================
 * Perfect for pie / bar charts
 */

export const ORDER_STATUS_DISTRIBUTION_QUERY = defineQuery(`
{
  "pending": count(*[_type == "order" && status == "pending"]),
  "processing": count(*[_type == "order" && status == "processing"]),
  "shipped": count(*[_type == "order" && status == "shipped"]),
  "delivered": count(*[_type == "order" && status == "delivered"]),
  "cancelled": count(*[_type == "order" && status == "cancelled"])
}
`);

/**
 * =========================
 * TOP SELLING PRODUCTS
 * =========================
 * Based on quantity sold
 */

export const TOP_SELLING_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"] {
    ${PRODUCT_PROJECTION},
    "salesCount": count(*[_type == "order" && references(^._id)])
  } | order(salesCount desc)[0...5]
`);

/**
 * 🔥 Aggregated top-selling products (recommended version)
 */
export const TOP_SELLING_PRODUCTS_AGGREGATED_QUERY = defineQuery(`
  *[_type == "product"] {
    _id,
    title,
    "totalRevenue": math::sum(*[_type == "order" && references(^._id)].items[product._ref == ^.^._id].price)
  } | order(totalRevenue desc)[0...5]
`);


/**
 * =========================
 * UNFULFILLED ORDERS
 * =========================
 * Orders not yet shipped or delivered
 */

export const UNFULFILLED_ORDERS_QUERY = defineQuery(`
  *[
    _type == "order" &&
    (
      status == "pending" ||
      status == "processing"
    )
  ] | order(createdAt asc) {
    _id,
    orderId,
    totalAmount,
    status,
    createdAt,
    customer->{
      _id,
      name,
      email
    },
    items[]{
      title,
      quantity
    }
  }
`);

/** Count of unfulfilled orders */
export const UNFULFILLED_ORDERS_COUNT_QUERY = defineQuery(`
  count(
    *[
      _type == "order" &&
      (status == "pending" || status == "processing")
    ]
  )
`);

/**
 * =========================
 * OPTIONAL: SALES TREND (LAST 7 DAYS)
 * =========================
 */

export const SALES_LAST_7_DAYS_QUERY = defineQuery(`
{
  "salesLast7Days": math::sum(
    *[
      _type == "order"
      && status == "completed"
      && createdAt >= dateTime(now()) - 60*60*24*7
    ].total
  )
}
`);

