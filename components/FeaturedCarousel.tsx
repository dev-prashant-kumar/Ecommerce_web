"use client";

import type { FEATURED_PRODUCTS_QUERYResult } from "@/sanity.types";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { useCallback, useEffect, useState } from "react";
import { cn, formatPrice } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

type FeaturedProduct = FEATURED_PRODUCTS_QUERYResult[number];

interface FeaturedCarouselProps {
  products: FEATURED_PRODUCTS_QUERYResult;
}

export default function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);

  if (!products?.length) return null;

  return (
    <div className="relative w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "start" }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {products.map((product) => (
            <CarouselItem key={product._id} className="pl-0">
              <FeaturedSlide product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation */}
        <CarouselPrevious className="left-4 bg-zinc-800/80 text-white hover:bg-zinc-700" />
        <CarouselNext className="right-4 bg-zinc-800/80 text-white hover:bg-zinc-700" />
      </Carousel>

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                current === index
                  ? "w-6 bg-white"
                  : "bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------- */

interface FeaturedSlideProps {
  product: FeaturedProduct;
}

function FeaturedSlide({ product }: FeaturedSlideProps) {
  const mainImage = product.image?.asset?.url;
  const category = product.categories?.[0];

  return (
    <div className="flex min-h-[400px] flex-col md:min-h-[450px] md:flex-row lg:min-h-[500px]">
      {/* Image */}
      <div className="relative h-64 w-full md:h-auto md:w-3/5">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.title ?? "Featured product"}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-zinc-800">
            <span className="text-zinc-500">No image</span>
          </div>
        )}

        {/* Edge gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex w-full flex-col justify-center px-6 py-8 md:w-2/5 md:px-12">
        {category && (
          <Badge className="mb-4 w-fit bg-amber-500/20 text-amber-400">
            {category.title}
          </Badge>
        )}

        <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
          {product.title}
        </h2>

        {product.description && (
          <p className="mt-4 line-clamp-3 text-zinc-300">
            {product.description}
          </p>
        )}

        <p className="mt-6 text-xl font-semibold text-white">
          {formatPrice(product.price)}
        </p>

        <div className="mt-8">
          <Button
            asChild
            size="lg"
            className="bg-white text-zinc-900 hover:bg-zinc-100"
          >
            <Link href={`/product/${product.slug?.current}`}>
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
