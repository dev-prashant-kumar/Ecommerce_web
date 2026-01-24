"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import {
  useTotalPrice,
  useTotalItems,
  useCartActions,
} from "@/lib/store/cart_store_provider";

interface CartSummaryProps {
  hasStockIssues?: boolean;
}

export function CartSummary({ hasStockIssues = false }: CartSummaryProps) {
  const totalPrice = useTotalPrice();
  const totalItems = useTotalItems();
  const { closeCart } = useCartActions();

  if (totalItems === 0) return null;

  return (
    <div className="space-y-4">
      {/* Price Row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Subtotal
        </span>
        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {formatPrice(totalPrice)}
        </span>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Shipping and taxes calculated at checkout
      </p>

      {/* Checkout Button */}
      {hasStockIssues ? (
        <Button
          disabled
          className="w-full cursor-not-allowed bg-zinc-300 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-500"
        >
          Resolve stock issues to checkout
        </Button>
      ) : (
        <Button
          asChild
          size="lg"
          className="w-full text-base font-medium"
        >
          <Link href="/checkout" onClick={closeCart}>
            Checkout
          </Link>
        </Button>
      )}

      {/* Continue Shopping */}
      <div className="pt-1 text-center">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          Continue shopping →
        </Link>
      </div>
    </div>
  );
}
