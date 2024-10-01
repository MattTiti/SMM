import themes from "daisyui/src/theming/themes";

const config = {
  appName: "ShowMeMoney",
  appDescription:
    "The expense tracker powered by OpenAI to help you save time and money",
  domainName: "showmemoney.app",
  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    plans: [
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Q5CkFDrCLxk48BSiwO5OjEz"
            : "price_1Q5CkFDrCLxk48BSiwO5OjEz",
        name: "Yearly",
        mode: "subscription",
        description: "Full access to all features for a year",
        price: 49.99,
        priceAnchor: 69.99,
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
            ? "price_1Q5CjDDrCLxk48BSAntMjerb"
            : "price_1Q5CjDDrCLxk48BSAntMjerb",
        name: "Unlimited",
        mode: "payment",
        description: "A one-time payment for lifetime access",
        price: 79.99,
        priceAnchor: 99.99,
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
    theme: "light",
    main: themes["light"]["primary"],
    toast: "#000000",
  },
  auth: {
    loginUrl: "/api/auth/signin",
    callbackUrl: "/dashboard",
  },
  googleAnalyticsId: "G-Y2GFJQ65SZ",
};

export default config;
