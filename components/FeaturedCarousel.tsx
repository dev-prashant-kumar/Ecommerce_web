"use client";

import { FEATURED_PRODUCTS_QUERYResult } from "@/sanity.types";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
} from "./ui/carousel";
import { useCallback, useEffect, useState } from "react";

type FeaturedProduct = FEATURED_PRODUCTS_QUERYResult[number];

interface FeaturedCarouselProps {
  products: FEATURED_PRODUCTS_QUERYResult;
}

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
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
  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );
  if (products.length === 0) {
    return null;
  }
  return (
    <div className="relative w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          align: "start",
        }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {products.map((product) => (
            <CarouselItem key={product._id} className="pl-0">
              <FeaturedSlide product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* navigation arrows  */}
        <CarouselPrevious className="left-4 border-zinc-700 bg-zinc-800/80 text-white hover:bg-zinc-700 hover:text-white sm:right-8" />
      </Carousel>

      {/* dot indicators */}
      {count > 1 && (
        <div className="abosolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-6">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              onClick={() => scrollTo(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                current === index
                  ? "w-6 bg-white"
                  : "bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FeaturedSlideProps{
    product: FeaturedProduct;
}
