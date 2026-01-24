"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";
import { StockBadge } from "../layout/StockBadge";
import { AddToCartButton } from "../layout/AddToCardButton";
import { FILTER_PRODUCTS_BY_NAME_QUERYResult } from "@/sanity.types";

type Product = FILTER_PRODUCTS_BY_NAME_QUERYResult[number];

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const images = product.gallery ?? [];
  const mainImageUrl = product.image?.asset?.url ?? null;

  const hoveredImageUrl =
    hoveredIndex !== null
      ? images[hoveredIndex]?.asset?.url ?? null
      : mainImageUrl;

  const isOutOfStock =
    product.inStock === false || (product.quantity ?? 0) <= 0;

  const productSlug = product.slug?.current;

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-sm ring-1 ring-zinc-950/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-950/10 dark:bg-zinc-900 dark:ring-white/10 dark:hover:shadow-zinc-950/50">
      {/* IMAGE */}
      {productSlug ? (
        <Link href={`/product/${productSlug}`} className="block">
          <ProductImage
            imageUrl={hoveredImageUrl}
            title={product.title}
            isOutOfStock={isOutOfStock}
            category={product.categories?.[0]?.title}
          />
        </Link>
      ) : (
        <ProductImage
          imageUrl={hoveredImageUrl}
          title={product.title}
          isOutOfStock={isOutOfStock}
          category={product.categories?.[0]?.title}
        />
      )}

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="flex gap-2 bg-zinc-50 p-3 dark:bg-zinc-800/50">
          {images.map((img, index) => {
            const url = img.asset?.url;
            if (!url) return null;

            return (
              <button
                key={index}
                className={cn(
                  "relative h-14 flex-1 overflow-hidden rounded-lg transition",
                  hoveredIndex === index
                    ? "ring-2 ring-zinc-900 ring-offset-2 dark:ring-white dark:ring-offset-zinc-900"
                    : "opacity-60 hover:opacity-100"
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* CONTENT */}
      <CardContent className="flex grow flex-col justify-between gap-2 p-5">
        {productSlug ? (
          <Link href={`/product/${productSlug}`}>
            <h3 className="line-clamp-2 text-base font-semibold leading-tight text-zinc-900 transition group-hover:text-zinc-600 dark:text-zinc-100">
              {product.title ?? "Untitled Product"}
            </h3>
          </Link>
        ) : (
          <h3 className="line-clamp-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {product.title ?? "Untitled Product"}
          </h3>
        )}

        <div className="flex items-center justify-between">
          <div>
            {product.discountPrice ? (
              <>
                <p className="text-sm line-through text-zinc-400">
                  {formatPrice(product.price ?? 0)}
                </p>
                <p className="text-xl font-bold text-amber-600">
                  {formatPrice(product.discountPrice)}
                </p>
              </>
            ) : (
              <p className="text-xl font-bold text-zinc-900 dark:text-white">
                {formatPrice(product.price ?? 0)}
              </p>
            )}
          </div>

          <StockBadge
            productId={product._id}
            stock={product.quantity ?? 0}
          />
        </div>
      </CardContent>

      {/* ACTION */}
      <CardFooter className="p-5 pt-0">
        <AddToCartButton
          productId={product._id}
          name={product.title ?? "Unknown Product"}
          price={product.discountPrice ?? product.price ?? 0}
          image={mainImageUrl ?? undefined}
          stock={product.quantity ?? 0}
        />
      </CardFooter>
    </Card>
  );
}

/* ---------------------------------- */
/* SMALL HELPER COMPONENT */
/* ---------------------------------- */
function ProductImage({
  imageUrl,
  title,
  isOutOfStock,
  category,
}: {
  imageUrl: string | null;
  title: string | null;
  isOutOfStock: boolean;
  category?: string;
}) {
  return (
    <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title ?? "Product image"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-zinc-400">
          No Image
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition group-hover:opacity-100" />

      {isOutOfStock && (
        <Badge variant="destructive" className="absolute right-3 top-3">
          Out of Stock
        </Badge>
      )}

      {category && (
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300">
          {category}
        </span>
      )}
    </div>
  );
}
