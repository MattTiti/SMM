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
        price: 39.99,
        priceAnchor: 69.99,
        features: [
          { name: "Smart Add" },
          { name: "Auto Sync" },
          { name: "Budget Notifications" },
          { name: "Charts and Visualizations" },
          { name: "Organization Tools" },
          {
            name: "Price Lock",
            infoIcon:
              "If subscription prices ever rise, you'll be locked in at the price you signed up with (and you'll be able to renew yearly at the same price).",
          },
        ],
        monthlyPrice: 3.33,
        buttonMessage: "Pay now, save later.",
      },
      {
        isFeatured: true,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Q5CjDDrCLxk48BSAntMjerb"
            : "price_1Q5CjDDrCLxk48BSAntMjerb",
        name: "Lifetime",
        mode: "payment",
        description: "A one-time payment for lifetime access",
        price: 69.99,
        priceAnchor: 99.99,
        features: [
          { name: "Smart Add" },
          { name: "Auto Sync" },
          { name: "Budget Notifications" },
          { name: "Charts and Visualizations" },
          { name: "Organization Tools" },
          { name: "No Recurring Fees" },
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
    loginUrl: "/login",
    callbackUrl: "/dashboard",
  },
  googleAnalyticsId: "G-Y2GFJQ65SZ",
};

export default config;
