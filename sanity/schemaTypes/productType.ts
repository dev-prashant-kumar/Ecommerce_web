import { defineType, defineField } from "sanity";
import { PackageIcon } from "@sanity/icons";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon,
  groups:[
    {name:"details",title:"Details",default:true},
    {name:"media",title:"Media"},
    {name:"inventory",title:"Inventory"},
  ],
  fields: [
    // Product Name
    defineField({
      name: "title",
      title: "Product Name",
      type: "string",
      validation: (rule) =>
        rule.required().error("Product name is required"),
    }),

    // Slug
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) =>
        rule.required().error("Slug is required"),
    }),

    // Price
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (rule) =>
        rule.required().min(0).error("Price must be a positive number"),
    }),

    // Discount Price (Optional)
    defineField({
      name: "discountPrice",
      title: "Discount Price",
      type: "number",
      validation: (rule) =>
        rule.min(0).warning("Discount price should be positive"),
    }),

    // Categories (Reference)
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "category" }],
        },
      ],
      validation: (rule) =>
        rule.required().min(1).error("At least one category is required"),
    }),

    // Main Image
    defineField({
      name: "image",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) =>
        rule.required().error("Product image is required"),
    }),

    // Gallery Images
    defineField({
      name: "gallery",
      title: "Gallery Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),

    // Description
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (rule) =>
        rule.required().min(20).error("Description is required"),
    }),

    // Stock
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),

    defineField({
      name: "quantity",
      title: "Stock Quantity",
      type: "number",
      validation: (rule) =>
        rule.min(0).error("Quantity cannot be negative"),
    }),

    // Featured Product
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      initialValue: false,
    }),

    // Created At
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
