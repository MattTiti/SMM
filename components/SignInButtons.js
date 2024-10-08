import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignInButtons({ providers }) {
  return (
    <div className="mt-8 space-y-6">
      {providers &&
        Object.values(providers).map((provider) => (
          <Button
            key={provider.name}
            onClick={() => signIn(provider.id, { callbackUrl: "/dashboard" })}
            className="w-full p-6"
            variant="outline"
          >
            Sign in with {provider.name}
          </Button>
        ))}
    </div>
  );
}
