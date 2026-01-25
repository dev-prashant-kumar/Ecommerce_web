"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/layout/CheckoutButton";
import { formatPrice } from "@/lib/utils";
import {
  useCartItems,
  useTotalPrice,
  useTotalItems,
} from "@/lib/store/cart_store_provider";
import { useCartStock } from "@/lib/hooks/use_cart_stock";

export function Checkout_client() {
  const items = useCartItems();
  const totalPrice = useTotalPrice();
  const totalItems = useTotalItems();
  const { stockMap, isLoading, hasStockIssues } = useCartStock(items);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-zinc-300 dark:text-zinc-600" />
        <h1 className="mt-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Add some items before checking out.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to shopping
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Checkout
        </h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-5">
        {/* Cart Items */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Order Summary
                <span className="ml-2 text-sm font-normal text-zinc-500">
                  ({totalItems} items)
                </span>
              </h2>
            </div>

            {/* Stock Warning */}
            {hasStockIssues && !isLoading && (
              <div className="mx-6 mt-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
                <span>
                  Some items exceed available stock. Please update your cart
                  before checkout.
                </span>
              </div>
            )}

            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                <span className="ml-2 text-sm text-zinc-500">
                  Checking stock…
                </span>
              </div>
            )}

            {/* Items */}
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {items.map((item) => {
                const stockInfo = stockMap.get(item.productId);
                const hasIssue =
                  stockInfo?.isOutOfStock || stockInfo?.exceedsStock;

                return (
                  <div
                    key={item.productId}
                    className={`flex gap-4 px-6 py-5 ${
                      hasIssue
                        ? "bg-red-50/60 dark:bg-red-950/30"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
                    }`}
                  >
                    {/* Image */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-500">
                          Quantity: {item.quantity}
                        </p>

                        {stockInfo?.isOutOfStock && (
                          <p className="mt-1 text-sm font-medium text-red-600">
                            Out of stock
                          </p>
                        )}

                        {stockInfo?.exceedsStock && !stockInfo.isOutOfStock && (
                          <p className="mt-1 text-sm font-medium text-amber-600">
                            Only {stockInfo.currentStock} available
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-zinc-500">
                          {formatPrice(item.price)} each
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Payment Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Subtotal</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">Delivery</span>
                <span className="text-zinc-900 dark:text-zinc-100">
                  Calculated at checkout
                </span>
              </div>

              <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <CheckoutButton disabled={hasStockIssues || isLoading} />
            </div>

            <p className="mt-4 text-center text-xs text-zinc-500">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
