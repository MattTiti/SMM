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
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1PoDXsDrCLxk48BS4z8Na468"
            : "price_1PoDXsDrCLxk48BS4z8Na468",
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "Yearly",
        mode: "subscription",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Full access to all features for a year",
        // The price you want to display, the one user will be charged on Stripe.
        price: 9.99,
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        priceAnchor: 14.99,
        features: [
          { name: "NextJS boilerplate" },
          { name: "User oauth" },
          { name: "Database" },
          { name: "Emails" },
        ],
        buttonMessage: "Pay now, save later.",
      },
      {
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: true,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1PoDZ3DrCLxk48BSmRdObek5"
            : "price_1PoDZ3DrCLxk48BSmRdObek5",
        name: "Unlimited",
        mode: "payment",
        description: "A one-time payment for lifetime access",
        price: 14.99,
        priceAnchor: 24.99,
        features: [
          { name: "NextJS boilerplate" },
          { name: "User oauth" },
          { name: "Database" },
          { name: "Emails" },
          { name: "1 year of updates" },
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
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/api/auth/signin",
    // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
};

export default config;
