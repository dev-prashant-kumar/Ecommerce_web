"use client";

import { AlertTriangle, Loader2, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useCartItems,
  useCartIsOpen,
  useCartActions,
  useTotalItems,
} from "@/lib/store/cart_store_provider";
import { useCartStock } from "@/lib/hooks/use_cart_stock";
import { CartItem } from "./Cart_items";
import { CartSummary } from "./Cart_Summary";

export function CartSheet() {
  const items = useCartItems();
  const isOpen = useCartIsOpen();
  const totalItems = useTotalItems();
  const { closeCart } = useCartActions();
  const { stockMap, isLoading, hasStockIssues } = useCartStock(items);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex h-full w-full flex-col gap-0 bg-white dark:bg-zinc-950 sm:max-w-lg">
        {/* Header */}
        <SheetHeader className="sticky top-0 z-10 border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-base font-semibold">
              <ShoppingBag className="h-5 w-5" />
              Cart ({totalItems})
            </div>

            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          /* Empty State */
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <ShoppingBag className="h-14 w-14 text-zinc-300 dark:text-zinc-600" />
            <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Your cart is empty
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Add some items to get started
            </p>
          </div>
        ) : (
          <>
            {/* Stock Issues Banner */}
            {hasStockIssues && !isLoading && (
              <div className="mx-6 mt-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Some items have stock issues. Please review before checkout.
                </span>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6">
              <div className="divide-y divide-zinc-200 py-4 dark:divide-zinc-800">
                {items.map((item) => (
                  <div key={item.productId} className="py-3">
                    <CartItem
                      item={item}
                      stockInfo={stockMap.get(item.productId)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <CartSummary hasStockIssues={hasStockIssues} />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
