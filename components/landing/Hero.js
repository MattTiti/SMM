"use client";
import React, { useState, useEffect } from "react";
import config from "@/config";
import ButtonCheckout from "@/components/ButtonCheckout";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import FallingMoney from "@/components/FallingMoney";

const Hero = () => {
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsHighlighted(true), 500); // Delay the highlight effect
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden shadow-md">
      <FallingMoney />
      <div className="relative z-10 text-center px-8 max-w-3xl">
        <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight mb-8 text-gray-900">
          <div>See how much you</div>
          <div>
            <span
              className={`highlight-transition px-2 md:px-4 leading-relaxed inline-block ${
                isHighlighted ? "highlighted" : ""
              }`}
            >
              really
            </span>{" "}
            spend
          </div>
        </h1>
        <p className="text-lg text-black/50 leading-relaxed mb-10">
          AI-powered expense tracking for smarter spending and saving
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="w-full sm:w-1/2">
            <ButtonCheckout
              priceId={config.stripe.plans[1].priceId}
              mode={config.stripe.plans[1].mode}
            />
          </div>
          <Link href="/free-trial" className="w-full sm:w-1/3">
            <Button variant="outline" className="p-6 w-full">
              Start a free trial
              <FaArrowRight className="ml-2" size={14} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
