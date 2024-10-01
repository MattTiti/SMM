"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
export default function FreeTrialForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleStartTrial = async () => {
    console.log(session);
    setIsLoading(true);
    try {
      const response = await fetch("/api/trial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.user.id }),
      });
      console.log(response);
      if (response.ok) {
        router.push("/dashboard");
      } else {
        throw new Error("Failed to start free trial");
      }
    } catch (error) {
      toast.error("Error starting free trial");
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center pb-6">
      <Button onClick={handleStartTrial} disabled={isLoading}>
        {isLoading ? "Starting trial..." : "Start Your Free Trial"}
      </Button>
    </div>
  );
}
