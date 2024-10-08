"use client";

import { useRef, useState } from "react";
import Link from "next/link";

const faqList = [
  {
    question: "What do I get exactly?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        All the features listed above and any features added in the future.
      </div>
    ),
  },
  {
    question: "Do I have to connect my bank account?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        No, connecting your bank account is optional. You can manually track
        your expenses or use Smart Add without having to connect your bank
        account.
      </div>
    ),
  },
  {
    question: "Is it secure to connect my bank account?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Yes, it is secure. We use Plaid, a secure and compliant platform, to
        connect your bank account. We only access your transaction history for
        auto sync, so we do not have access to any of your other financial
        information. Additionally, we only save the transactions that you choose
        to save.
      </div>
    ),
  },
  {
    question: "Is there a free trial?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Yes, there is a 48-hour{" "}
        <Link href="/free-trial" className="underline text-blue-500">
          free trial
        </Link>
      </div>
    ),
  },
  {
    question: "Can I get a refund?",
    answer: (
      <p>
        Yes! You can request a refund within 7 days of your purchase. Reach out
        by email.
      </p>
    ),
  },
  {
    question: "I have another question",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Send me an{" "}
        <a
          href="mailto:matt@mg.showmemoney.app"
          className="underline text-blue-500"
        >
          email
        </a>
        !
      </div>
    ),
  },
];

const Item = ({ item }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span className={`flex-1 text-black/60 ${isOpen ? "text-black" : ""}`}>
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-auto fill-current`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              isOpen && "rotate-180"
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen && "rotate-180 hidden"
            }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = () => {
  return (
    <section className="bg-white" id="faq">
      <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        <div className="flex flex-col text-left basis-1/2">
          <p className="sm:text-4xl text-3xl font-extrabold text-base-content mt-2">
            Frequently Asked Questions
          </p>
        </div>

        <ul className="basis-1/2">
          {faqList.map((item, i) => (
            <Item key={i} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
