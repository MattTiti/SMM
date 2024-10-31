import FreeTrialForm from "@/components/FreeTrialForm";
import Header from "@/components/landing/Header";
import FallingMoney from "@/components/FallingMoney";

export default function FreeTrialPage() {
  return (
    <div className="relative bg-stone-50 min-h-screen flex flex-col">
      <div className="absolute inset-0 z-0">
        <FallingMoney />
      </div>
      <Header className="relative z-10" />
      <div className="relative z-10 flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full bg-white rounded-lg border border-gray-200 overflow-hidden shadow-lg">
          <div className="p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
              Start Your 48-Hour Free Trial
            </h1>
            <ul className="space-y-4 mb-8">
              {[
                "Smart Add",
                "Auto Sync",
                "Charts and Visualizations",
                "Organization Tools",
              ].map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <svg
                    className="h-5 w-5 text-black mr-3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <FreeTrialForm />
          </div>
        </div>
      </div>
    </div>
  );
}
