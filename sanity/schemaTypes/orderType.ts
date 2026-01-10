import { defineType, defineField } from "sanity";
import { BasketIcon } from "@sanity/icons";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,

  groups: [
    { name: "order", title: "Order Details", default: true },
    { name: "customer", title: "Customer" },
    { name: "payment", title: "Payment" },
    { name: "shipping", title: "Shipping" },
  ],

  fields: [
    // Order ID
    defineField({
      name: "orderId",
      title: "Order ID",
      type: "string",
      group: "order",
      readOnly: true,
      validation: (Rule) =>
        Rule.required().error("Order ID is required"),
    }),

    // Customer Reference
    defineField({
      name: "customer",
      title: "Customer",
      type: "reference",
      to: [{ type: "customer" }],
      group: "customer",
      validation: (Rule) =>
        Rule.required().error("Customer is required"),
    }),

    // Clerk User ID (quick lookup)
    defineField({
      name: "clerkUserId",
      title: "Clerk User ID",
      type: "string",
      group: "customer",
      description: "Clerk user ID (denormalized for fast queries)",
    }),

    // Order Items
    defineField({
      name: "items",
      title: "Order Items",
      type: "array",
      group: "order",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "title",
              title: "Product Name",
              type: "string",
              description: "Snapshot at order time",
            }),
            defineField({
              name: "price",
              title: "Price",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
        },
      ],
      validation: (Rule) =>
        Rule.required().min(1).error("At least one item is required"),
    }),

    // Amounts
    defineField({
      name: "subtotal",
      title: "Subtotal",
      type: "number",
      group: "order",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "shippingCost",
      title: "Shipping Cost",
      type: "number",
      group: "order",
      initialValue: 0,
    }),

    defineField({
      name: "totalAmount",
      title: "Total Amount",
      type: "number",
      group: "order",
      validation: (Rule) => Rule.required().min(0),
    }),

    // Payment (Stripe)
    defineField({
      name: "payment",
      title: "Payment",
      type: "object",
      group: "payment",
      fields: [
        defineField({
          name: "method",
          title: "Payment Method",
          type: "string",
          options: {
            list: ["card", "upi", "cod"],
          },
        }),
        defineField({
          name: "status",
          title: "Payment Status",
          type: "string",
          options: {
            list: ["pending", "paid", "failed", "refunded"],
          },
          initialValue: "pending",
        }),
        defineField({
          name: "stripePaymentIntentId",
          title: "Stripe Payment Intent ID",
          type: "string",
          readOnly: true,
        }),
      ],
    }),

    // Shipping Address
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      group: "shipping",
      fields: [
        defineField({ name: "line1", title: "Address Line 1", type: "string" }),
        defineField({ name: "line2", title: "Address Line 2", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "state", title: "State", type: "string" }),
        defineField({ name: "postalCode", title: "Postal Code", type: "string" }),
        defineField({ name: "country", title: "Country", type: "string" }),
      ],
    }),

    // Order Status
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      group: "order",
      options: {
        list: [
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ],
      },
      initialValue: "pending",
    }),

    // Timestamps
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],

  preview: {
    select: {
      orderId: "orderId",
      total: "totalAmount",
      status: "status",
    },
    prepare({ orderId, total, status }) {
      return {
        title: `Order #${orderId}`,
        subtitle: `₹${total} • ${status}`,
      };
    },
  },

  orderings: [
    {
      title: "Newest Orders",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
});
