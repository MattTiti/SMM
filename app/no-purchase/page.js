import Link from "next/link";
import ButtonCheckout from "@/components/ButtonCheckout";
import config from "@/config";

const NoPurchase = () => {
  return (
    <div className="relative h-screen flex flex-col items-center justify-center">
      <Link href="/" className="absolute top-4 left-4 btn btn-ghost">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
            clipRule="evenodd"
          />
        </svg>{" "}
        Back
      </Link>
      <h1 className="text-xl font-bold mb-4">
        Complete checkout to access dashboard
      </h1>
      <div className="w-72">
        <ButtonCheckout priceId={config.stripe.plans[1].priceId} />
      </div>
    </div>
  );
};

export default NoPurchase;
