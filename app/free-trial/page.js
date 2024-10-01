import FreeTrialForm from "@/components/FreeTrialForm";
import Header from "@/components/landing/Header";

export default function FreeTrialPage() {
  return (
    <div className="bg-stone-50 min-h-screen flex flex-col justify-center">
      <Header />
      <div className="mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-2 sm:p-10">
            <h1 className="text-3xl font-extrabold text-gray-900 text-start mb-3">
              Start Your 48-Hour Free Trial
            </h1>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-600">
                <svg
                  className="h-5 w-5 text-black mr-2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                Smart Add
              </li>
              <li className="flex items-center text-gray-600">
                <svg
                  className="h-5 w-5 text-black mr-2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                Charts and Visualizations
              </li>
              <li className="flex items-center text-gray-600">
                <svg
                  className="h-5 w-5 text-black mr-2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                Organization Tools{" "}
              </li>
              <li className="flex items-center text-gray-600">
                <svg
                  className="h-5 w-5 text-black mr-2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                Access to future updates
              </li>
            </ul>
          </div>
          <FreeTrialForm />
        </div>
      </div>
    </div>
  );
}
