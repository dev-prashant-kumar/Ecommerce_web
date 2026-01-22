import { defineType, defineField } from "sanity";
import { PackageIcon } from "@sanity/icons";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon,

  groups: [
    { name: "details", title: "Details", default: true },
    { name: "media", title: "Media" },
    { name: "variants", title: "Variants" },
    { name: "inventory", title: "Inventory" },
  ],

  fields: [
    /* ---------------- BASIC INFO ---------------- */
    defineField({
      name: "title",
      title: "Product Name",
      type: "string",
      group: "details",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "details",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "details",
      validation: (rule) => rule.required().min(20),
    }),

    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "details",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      validation: (rule) => rule.required().min(1),
    }),

    /* ---------------- PRICING ---------------- */
    defineField({
      name: "price",
      title: "Base Price",
      type: "number",
      group: "details",
      validation: (rule) => rule.required().min(0),
    }),

    defineField({
      name: "discountPrice",
      title: "Discount Price",
      type: "number",
      group: "details",
      validation: (rule) => rule.min(0),
    }),

    /* ---------------- COLORS ---------------- */
    defineField({
      name: "colors",
      title: "Available Colors",
      type: "array",
      group: "variants",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Color Name",
              type: "string",
            },
            {
              name: "hex",
              title: "Hex Code",
              type: "string",
              description: "Example: #000000",
            },
          ],
        },
      ],
    }),

    /* ---------------- SIZES ---------------- */
    defineField({
      name: "sizes",
      title: "Available Sizes",
      type: "array",
      group: "variants",
      of: [{ type: "string" }],
      description: "Examples: S, M, L, XL, 42, One Size",
    }),

    /* ---------------- VARIANTS (OPTIONAL BUT POWERFUL) ---------------- */
    defineField({
      name: "variants",
      title: "Product Variants",
      type: "array",
      group: "variants",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "sku",
              title: "SKU",
              type: "string",
            },
            {
              name: "color",
              title: "Color",
              type: "string",
            },
            {
              name: "size",
              title: "Size",
              type: "string",
            },
            {
              name: "price",
              title: "Variant Price",
              type: "number",
            },
            {
              name: "inStock",
              title: "In Stock",
              type: "boolean",
              initialValue: true,
            },
            {
              name: "quantity",
              title: "Stock Quantity",
              type: "number",
              validation: (rule) => rule.min(0),
            },
          ],
        },
      ],
    }),

    /* ---------------- MEDIA ---------------- */
    defineField({
      name: "image",
      title: "Main Image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "gallery",
      title: "Gallery Images",
      type: "array",
      group: "media",
      of: [{ type: "image", options: { hotspot: true } }],
    }),

    /* ---------------- INVENTORY ---------------- */
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      group: "inventory",
      initialValue: true,
    }),

    defineField({
      name: "quantity",
      title: "Total Stock Quantity",
      type: "number",
      group: "inventory",
      validation: (rule) => rule.min(0),
    }),

    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      group: "details",
      initialValue: false,
    }),

    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      title: "title",
      media: "image",
      price: "price",
    },
    prepare({ title, media, price }) {
      return {
        title,
        media,
        subtitle: `₹${price}`,
      };
    },
  },
});
