import { defineQuery } from "next-sanity";

/**
 * =========================
 * ADMIN QUERIES
 * =========================
 */

/** Get all orders (admin dashboard) */
export const ALL_ORDERS_QUERY = defineQuery(`
  *[_type == "order"] | order(createdAt desc) {
    _id,
    orderId,
    status,
    totalAmount,
    createdAt,
    "customer": customer->{
      _id,
      name,
      email
    }
  }
`);

/** Get orders by status (admin filter) */
export const ORDERS_BY_STATUS_QUERY = defineQuery(`
  *[_type == "order" && status == $status]
  | order(createdAt desc) {
    _id,
    orderId,
    status,
    totalAmount,
    createdAt,
    customer->{
      name,
      email
    }
  }
`);

/** Recent orders (dashboard widget) */
export const RECENT_ORDERS_QUERY = defineQuery(`
  *[_type == "order"] | order(createdAt desc)[0...5] {
    _id,
    orderId,
    status,
    totalAmount,
    createdAt
  }
`);

/** Total orders count */
export const ORDERS_COUNT_QUERY = defineQuery(`
  count(*[_type == "order"])
`);

/** Total revenue (paid + shipped + delivered) */
export const TOTAL_REVENUE_QUERY = defineQuery(`
  sum(*[_type == "order" && status in ["paid","shipped","delivered"]].totalAmount)
`);

/**
 * =========================
 * USER / DETAIL QUERIES
 * =========================
 */

/** Get order by Order ID */
export const ORDER_BY_ORDER_ID_QUERY = defineQuery(`
  *[_type == "order" && orderId == $orderId][0] {
    _id,
    orderId,
    status,
    subtotal,
    shippingCost,
    totalAmount,
    createdAt,

    customer->{
      _id,
      name,
      email,
      stripeCustomerId
    },

    items[]{
      title,
      price,
      quantity,
      product->{
        _id,
        title,
        slug
      }
    },

    shippingAddress,
    payment
  }
`);

/** Orders by Clerk User ID (user order history) */
export const ORDERS_BY_CLERK_USER_QUERY = defineQuery(`
  *[_type == "order" && clerkUserId == $clerkUserId]
  | order(createdAt desc) {
    _id,
    orderId,
    status,
    totalAmount,
    createdAt
  }
`);

/** Orders by Customer reference (admin view per customer) */
export const ORDERS_BY_CUSTOMER_ID_QUERY = defineQuery(`
  *[_type == "order" && customer._ref == $customerId]
  | order(createdAt desc) {
    _id,
    orderId,
    status,
    totalAmount,
    createdAt
  }
`);
