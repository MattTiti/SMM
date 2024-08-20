import themes from "daisyui/src/theming/themes";

const config = {
  appName: "ShowMeMoney",
  appDescription:
    "The expense tracker powered by OpenAI to help you save time and money.",
  domainName: "showmemoney.app",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (mailgun.supportEmail) otherwise customer support won't work.
    // id: "17f9c26c-fa15-4ec3-9696-37686a1950dbv",
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    plans: [
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1PpfciDrCLxk48BSmsmAJw80"
            : "price_1PpfciDrCLxk48BSmsmAJw80",
        name: "Yearly",
        mode: "subscription",
        description: "Full access to all features for a year",
        price: 9.99,
        priceAnchor: 14.99,
        features: [
          { name: "Smart Add" },
          { name: "Charts and Visualizations" },
          { name: "Organization Tools" },
          { name: "Access to future updates" },
        ],
        buttonMessage: "Pay now, save later.",
      },
      {
        isFeatured: true,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Ppfd7DrCLxk48BS08JUItmD"
            : "price_1Ppfd7DrCLxk48BS08JUItmD",
        name: "Unlimited",
        mode: "payment",
        description: "A one-time payment for lifetime access",
        price: 14.99,
        priceAnchor: 24.99,
        features: [
          { name: "Smart Add" },
          { name: "Charts and Visualizations" },
          { name: "Organization Tools" },
          { name: "Access to future updates" },
          { name: "24/7 support" },
        ],
        buttonMessage: "Pay once, save forever.",
      },
    ],
  },
  mailgun: {
    subdomain: "mg",
    fromNoReply: `ShowMeMoney <noreply@mg.showmemoney.app>`,
    fromAdmin: `Matt at ShowMeMoney <matt@mg.showmemoney.app>`,
    supportEmail: "matt@mg.showmemoney.app",
    forwardRepliesTo: "matthewtiti@gmail.com",
  },
  colors: {
    theme: "dark",
    main: themes["light"]["primary"],
    toast: "#000000",
  },
  auth: {
    loginUrl: "/api/auth/signin",
    // Path to redirect to after a successful login
    callbackUrl: "/dashboard",
  },
};

export default config;
