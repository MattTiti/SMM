import React from "react";
import config from "@/config";
import ButtonCheckout from "@/components/ButtonCheckout";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import FallingMoney from "@/components/FallingMoney";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden shadow-md">
      <FallingMoney />
      <div className="relative z-10 text-center px-8 max-w-3xl">
        <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight mb-8 text-gray-900">
          See how much you{" "}
          <span className="bg-black text-white px-2 md:px-4 ml-1 md:ml-1.5 leading-relaxed sm:whitespace-nowrap">
            really
          </span>
          spend
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">
          AI-powered expense tracking for smarter spending and saving
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="w-1/2">
            <ButtonCheckout
              priceId={config.stripe.plans[1].priceId}
              mode={config.stripe.plans[1].mode}
            />
          </div>
          <Link href="/free-trial">
            <Button variant="outline" className="p-6">
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
