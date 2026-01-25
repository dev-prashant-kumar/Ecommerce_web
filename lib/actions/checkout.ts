"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_BY_IDS_QUERY } from "@/sanity/queries/products";
import { getOrCreateStripeCustomer } from "@/lib/actions/customer";
import type { PRODUCTS_BY_IDS_QUERYResult } from "@/sanity.types";

/* ---------------- STRIPE ---------------- */

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20",
});

/* ---------------- TYPES ---------------- */

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutResult {
  success: boolean;
  url?: string;
  error?: string;
}

/* ---------------- HELPERS ---------------- */

const nonNull = <T>(v: T | null | undefined): v is T => v != null;

/* ---------------- CREATE CHECKOUT ---------------- */

export async function createCheckoutSession(
  items: CartItem[]
): Promise<CheckoutResult> {
  try {
    /* 1️⃣ Auth */
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return { success: false, error: "Please sign in to checkout" };
    }

    if (!items.length) {
      return { success: false, error: "Your cart is empty" };
    }

    /* 2️⃣ Fetch products from Sanity */
    const productIds = items.map((i) => i.productId);

    const products =
      (await client.fetch<PRODUCTS_BY_IDS_QUERYResult>(
        PRODUCTS_BY_IDS_QUERY,
        { ids: productIds }
      )) ?? [];

    /* 3️⃣ Validate cart */
    const errors: string[] = [];
    const validatedItems: {
      product: PRODUCTS_BY_IDS_QUERYResult[number];
      quantity: number;
    }[] = [];

    for (const item of items) {
      const product = products.find((p) => p._id === item.productId);

      if (!product) {
        errors.push(`"${item.name}" is no longer available`);
        continue;
      }

      const stock = product.quantity ?? 0;

      if (stock === 0) {
        errors.push(`"${product.title}" is out of stock`);
        continue;
      }

      if (item.quantity > stock) {
        errors.push(`Only ${stock} of "${product.title}" available`);
        continue;
      }

      validatedItems.push({ product, quantity: item.quantity });
    }

    if (errors.length) {
      return { success: false, error: errors.join(". ") };
    }

    /* 4️⃣ Stripe Line Items */
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      validatedItems.map(({ product, quantity }) => {
        const images =
          product.images?.filter(nonNull) ?? [];

        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: product.title ?? "Product",
              images,
              metadata: {
                productId: product._id,
              },
            },
            unit_amount: Math.round((product.price ?? 0) * 100),
          },
          quantity,
        };
      });

    /* 5️⃣ Customer */
    const userEmail = user.emailAddresses[0]?.emailAddress ?? "";
    const userName =
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || userEmail;

    const { stripeCustomerId, sanityCustomerId } =
      await getOrCreateStripeCustomer(userEmail, userName, userId);

    /* 6️⃣ URLs */
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    /* 7️⃣ Create Checkout */
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer: stripeCustomerId,
      line_items: lineItems,
      metadata: {
        clerkUserId: userId,
        sanityCustomerId,
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
    });

    return { success: true, url: session.url ?? undefined };
  } catch (error) {
    console.error("Checkout error:", error);
    return { success: false, error: "Something went wrong" };
  }
}

/* ---------------- GET SESSION ---------------- */

export async function getCheckoutSession(sessionId: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false };

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer_details"],
    });

    if (session.metadata?.clerkUserId !== userId) {
      return { success: false };
    }

    return {
      success: true,
      session: {
        id: session.id,
        email: session.customer_details?.email,
        name: session.customer_details?.name,
        amount: session.amount_total,
        status: session.payment_status,
        items: session.line_items?.data.map((item) => ({
          name: item.description,
          quantity: item.quantity,
          amount: item.amount_total,
        })),
      },
    };
  } catch (error) {
    console.error("Get session error:", error);
    return { success: false };
  }
}
