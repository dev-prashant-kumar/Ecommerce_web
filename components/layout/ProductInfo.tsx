import Link from "next/link";
import { AddToCartButton } from "../layout/AddToCardButton";
import { StockBadge } from "../layout/StockBadge";
import { formatPrice } from "@/lib/utils";
import type { PRODUCT_BY_SLUG_QUERYResult } from "@/sanity.types";

interface ProductInfoProps {
  product: NonNullable<PRODUCT_BY_SLUG_QUERYResult>;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const imageUrl = product.images?.[0] ?? undefined;
  const category = product.categories?.[0];

  return (
    <div className="flex flex-col gap-6">
      {/* CATEGORY */}
      {category?.slug && (
        <Link
          href={`/?category=${category.slug}`}
          className="w-fit text-xs font-medium uppercase tracking-wide text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          {category.title}
        </Link>
      )}

      {/* TITLE */}
      <h1 className="text-3xl font-semibold leading-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
        {product.title}
      </h1>

      {/* PRICE */}
      {product.price !== null && (
        <div className="flex items-center gap-3">
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {formatPrice(product.price)}
          </p>

          {product.discountPrice && (
            <span className="text-sm text-zinc-500 line-through dark:text-zinc-400">
              {formatPrice(product.discountPrice)}
            </span>
          )}
        </div>
      )}

      {/* DESCRIPTION */}
      {product.description && (
        <p className="max-w-prose text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {product.description}
        </p>
      )}

      {/* ACTIONS */}
      <div className="flex flex-col gap-4 pt-2">
        <StockBadge
          productId={product._id}
          stock={product.quantity ?? 0}
        />

        <AddToCartButton
          productId={product._id}
          name={product.title ?? "Unknown Product"}
          price={product.price ?? 0}
          image={imageUrl}
          stock={product.quantity ?? 0}
        />
      </div>

      {/* METADATA */}
      <div className="mt-8 space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
        {product.colors?.[0]?.name && (
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 dark:text-zinc-400">Color</span>
            <span className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
              {product.colors[0].name}
            </span>
          </div>
        )}

        {product.sizes?.length ? (
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 dark:text-zinc-400">Sizes</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {product.sizes.join(", ")}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
