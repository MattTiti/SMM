import { NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export async function POST(req) {
  console.log("Creating Plaid link token...");
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    console.log("User ID:", userId);
    const createTokenResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: "ShowMeMoney",
      products: ["transactions"],
      country_codes: ["US"],
      language: "en",
      redirect_uri: "https://showmemoney.app/dashboard",
    });
    console.log("Link token created successfully");
    return NextResponse.json({
      link_token: createTokenResponse.data.link_token,
    });
  } catch (error) {
    console.error("Error creating link token:", error);
    return NextResponse.json(
      { error: "Failed to create link token" },
      { status: 500 }
    );
  }
}
