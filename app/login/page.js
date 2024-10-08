"use client";

import { useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/Spinner";
import Image from "next/image";

export default function SignIn() {
  const [providers, setProviders] = useState(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchProviders = async () => {
      const fetchedProviders = await getProviders();
      setProviders(fetchedProviders);
      setIsLoading(false);
    };
    fetchProviders();
  }, []);

  const handleEmailSignIn = (e) => {
    e.preventDefault();
    setIsLoading(true);
    signIn("email", { email, callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen bg-white">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen w-screen">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="w-1/2 relative overflow-hidden hidden sm:block">
            <video
              className="absolute top-0 left-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/smm-login.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="sm:w-1/2 w-full flex items-center justify-center bg-neutral-100">
            <div className="w-full max-w-lg space-y-8 p-8">
              <div className="flex justify-center items-center">
                <Image
                  src="/icon.png"
                  alt="App Icon"
                  width={40}
                  height={40}
                  className="rounded-full shadow-lg z-10"
                />
                <h1 className="text-2xl font-bold text-black ml-2">
                  ShowMeMoney
                </h1>
              </div>
              <div className="mt-8 space-y-6">
                {providers &&
                  Object.values(providers).map(
                    (provider) =>
                      provider.name !== "Email" && (
                        <Button
                          key={provider.name}
                          onClick={() =>
                            signIn(provider.id, { callbackUrl: "/dashboard" })
                          }
                          className="w-full p-6 text-black"
                          variant="outline"
                        >
                          Sign in with {provider.name}
                        </Button>
                      )
                  )}
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex-grow h-px bg-gray-300"></div>
                  <p className="text-black/50">or</p>
                  <div className="flex-grow h-px bg-gray-300"></div>
                </div>

                {providers && providers.email && (
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <Input
                      type="email"
                      className="text-black"
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button type="submit" className="w-full p-6">
                      Sign in with Email
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
