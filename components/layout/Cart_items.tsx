"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartActions } from "@/lib/store/cart_store_provider";
import { AddToCartButton } from "../layout/AddToCardButton";
import { StockBadge } from "../layout/StockBadge";
import { cn, formatPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/lib/store/cart_store";
import type { StockInfo } from "@/lib/hooks/use_cart_stock";

interface CartItemProps {
  item: CartItemType;
  stockInfo?: StockInfo;
}

export function CartItem({ item, stockInfo }: CartItemProps) {
  const { removeItem } = useCartActions();

  const isOutOfStock = stockInfo?.isOutOfStock ?? false;
  const exceedsStock = stockInfo?.exceedsStock ?? false;
  const currentStock = stockInfo?.currentStock ?? 999;
  const hasIssue = isOutOfStock || exceedsStock;

  return (
    <div
      className={cn(
        "flex gap-4 rounded-lg py-3 transition-colors",
        hasIssue
          ? "bg-amber-50 dark:bg-amber-950/40"
          : "hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900",
          isOutOfStock && "opacity-60"
        )}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-zinc-400">
            No image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${item.productId}`}
            className={cn(
              "line-clamp-2 text-sm font-medium transition-colors",
              isOutOfStock
                ? "text-zinc-400 dark:text-zinc-500"
                : "text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
            )}
          >
            {item.name}
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-zinc-400 hover:text-red-500"
            onClick={() => removeItem(item.productId)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove {item.name}</span>
          </Button>
        </div>

        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {formatPrice(item.price)}
        </p>

        {/* Stock & Quantity */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <StockBadge productId={item.productId} stock={currentStock} />

          {!isOutOfStock && (
            <div className="ml-auto w-28">
              <AddToCartButton
                productId={item.productId}
                name={item.name}
                price={item.price}
                image={item.image}
                stock={currentStock}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
