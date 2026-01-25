"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_BY_IDS_QUERY } from "@/sanity/queries/products";
import type { CartItem } from "@/lib/store/cart_store";
import type { PRODUCTS_BY_IDS_QUERYResult } from "@/sanity.types";

export interface StockInfo {
  productId: string;
  currentStock: number;
  isOutOfStock: boolean;
  exceedsStock: boolean;
  availableQuantity: number;
}

export type StockMap = Map<string, StockInfo>;

interface UseCartStockReturn {
  stockMap: StockMap;
  isLoading: boolean;
  hasStockIssues: boolean;
  refetch: () => void;
}

export function useCartStock(items: CartItem[]): UseCartStockReturn {
  const [stockMap, setStockMap] = useState<StockMap>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  const productIds = useMemo(
    () => Array.from(new Set(items.map((item) => item.productId))),
    [items]
  );

  const fetchStock = useCallback(async () => {
    if (productIds.length === 0) {
      setStockMap(new Map());
      return;
    }

    setIsLoading(true);

    try {
      const products =
        (await client.fetch<PRODUCTS_BY_IDS_QUERYResult>(
          PRODUCTS_BY_IDS_QUERY,
          { ids: productIds }
        )) ?? [];

      const productStockMap = new Map(
        products.map((p) => [p._id, p.quantity ?? 0])
      );

      const newStockMap: StockMap = new Map();

      for (const item of items) {
        const currentStock = productStockMap.get(item.productId) ?? 0;

        newStockMap.set(item.productId, {
          productId: item.productId,
          currentStock,
          isOutOfStock: currentStock === 0,
          exceedsStock: item.quantity > currentStock,
          availableQuantity: Math.min(item.quantity, currentStock),
        });
      }

      setStockMap(newStockMap);
    } catch (err) {
      console.error("Failed to fetch stock:", err);
    } finally {
      setIsLoading(false);
    }
  }, [items, productIds]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const hasStockIssues = useMemo(
    () =>
      Array.from(stockMap.values()).some(
        (info) => info.isOutOfStock || info.exceedsStock
      ),
    [stockMap]
  );

  return {
    stockMap,
    isLoading,
    hasStockIssues,
    refetch: fetchStock,
  };
}
