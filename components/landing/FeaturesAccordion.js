"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  WandSparkles,
  ChartSpline,
  Bell,
  NotepadText,
  CreditCard,
} from "lucide-react";

const features = [
  {
    title: "Smart Add",
    description:
      "The Smart Add feature, powered by OpenAI, automatically processes and categorizes your financial data, saving you time and effort. Effortlessly input anything from plain text to bank statements.",
    type: "video",
    path: "/smm-smart.mp4",
    format: "video/webm",
    icon: <WandSparkles />,
  },
  {
    title: "Auto Sync",
    description:
      "Connect to your bank to automatically import your transactions across all your accounts. No need to manually input every expense, log and categorize all your transactions in one click with Auto Sync.",
    type: "video",
    path: "/smm-sync.mp4",
    format: "video/webm",
    icon: <CreditCard />,
  },
  {
    title: "Charts",
    description:
      "Visualize your spending habits with a variety of interactive charts. Explore your monthly and yearly data through line charts, bar charts, and pie charts, offering a clear and comprehensive view of your financial trends over time.",
    type: "video",
    path: "/smm-charts.mp4",
    format: "video/webm",
    icon: <ChartSpline />,
  },
  {
    title: "Organization",
    description:
      "Categorize your expenses by custom categories, months, and labels, making it easy to track and manage your spending across different periods and purposes.",
    type: "video",
    path: "/smm-cat.mp4",
    format: "video/webm",
    icon: <NotepadText />,
  },
  {
    title: "Notifications",
    description:
      "Get notified when you're close to your budget limit. Set up email notifications to keep track of your spending and stay on top of your budget.",
    type: "video",
    path: "/smm-notif.mp4",
    format: "video/webm",
    icon: <Bell />,
  },
];

// An SEO-friendly accordion component including the title and a description (when clicked.)
const Item = ({ feature, isOpen, setFeatureSelected }) => {
  const accordion = useRef(null);
  const { title, description, icon } = feature;

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-medium text-left md:text-lg"
        onClick={(e) => {
          e.preventDefault();
          setFeatureSelected();
        }}
        aria-expanded={isOpen}
      >
        <span
          className={`duration-100 ${isOpen ? "text-black" : "text-gray-500"}`}
        >
          {icon}
        </span>
        <span
          className={`flex-1 ${
            isOpen ? "text-black font-semibold" : "text-gray-500"
          }`}
        >
          <h3 className="inline">{title}</h3>
        </span>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out text-gray-600 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{description}</div>
      </div>
    </li>
  );
};

const NotificationAlert = () => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  const notifications = [
    { id: 1, message: "You've reached 100% of your budget.", time: "now" },
    { id: 2, message: "You've reached 90% of your budget.", time: "2h ago" },
    { id: 3, message: "You've reached 80% of your budget.", time: "8h ago" },
    { id: 4, message: "You've reached 50% of your budget.", time: "Yesterday" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleNotifications((prev) => {
        if (prev.length < notifications.length) {
          return [
            notifications[notifications.length - 1 - prev.length],
            ...prev,
          ];
        }
        return prev;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-transparent overflow-hidden flex flex-col gap-4 transition-all duration-700 ease-in-out py-4">
      {visibleNotifications.map((notification, index) => (
        <div
          key={notification.id}
          className="flex items-center p-4 shadow-md rounded-lg bg-neutral-100 transform transition-all duration-700 ease-in-out"
          style={{
            opacity: 0,
            transform: "translateY(-20px)",
            animation: `fadeSlideIn 700ms ease-out ${index * 150}ms forwards`,
          }}
        >
          <div className="bg-black p-2 rounded-full mr-4">
            <Bell className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">ShowMeMoney</h3>
            <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
          </div>
          <span className="text-xs text-gray-400">{notification.time}</span>
        </div>
      ))}
      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const Media = ({ feature }) => {
  const { type, path, format, alt, title } = feature;
  const style = "rounded-2xl aspect-square w-full sm:w-[26rem]";
  const size = {
    width: 500,
    height: 500,
  };

  if (title === "Notifications") {
    return <NotificationAlert />;
  } else if (type === "video") {
    return (
      <video
        className={style}
        autoPlay
        muted
        loop
        playsInline
        controls
        width={size.width}
        height={size.height}
      >
        <source src={path} type={format} />
      </video>
    );
  } else if (type === "image") {
    return (
      <Image
        src={path}
        alt={alt}
        className={`${style} object-cover object-center`}
        width={size.width}
        height={size.height}
      />
    );
  } else {
    return <div className={`${style} !border-none`}></div>;
  }
};

// A component to display 2 to 5 features in an accordion.
// By default, the first feature is selected. When a feature is clicked, the others are closed.
const FeaturesAccordion = () => {
  const [featureSelected, setFeatureSelected] = useState(0);

  return (
    <section
      className="py-24 md:py-32 space-y-24 md:space-y-32 max-w-7xl mx-auto bg-white"
      id="features"
    >
      <div className="px-8">
        <h2 className="font-extrabold text-4xl lg:text-6xl tracking-tight mb-12 md:mb-24 text-gray-900 max-w-4xl">
          All you need to track your expenses and
          <span className="bg-black text-white px-2 md:px-4 ml-1 md:ml-1.5 leading-relaxed sm:whitespace-nowrap">
            start saving
          </span>
        </h2>
        <div className=" flex flex-col md:flex-row gap-12 md:gap-24">
          <div className="grid grid-cols-1 items-stretch gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
            <ul className="w-full">
              {features.map((feature, i) => (
                <Item
                  key={feature.title}
                  index={i}
                  feature={feature}
                  isOpen={featureSelected === i}
                  setFeatureSelected={() => setFeatureSelected(i)}
                />
              ))}
            </ul>

            <Media feature={features[featureSelected]} key={featureSelected} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesAccordion;
