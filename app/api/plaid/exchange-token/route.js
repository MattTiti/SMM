import { NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
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
  console.log("Exchanging Plaid public token...");
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { publicToken } = await req.json();
    console.log("User ID:", userId);
    console.log("Public Token:", publicToken);
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = exchangeResponse.data.access_token;
    console.log("Access token received");

    await saveAccessToken(userId, accessToken);
    console.log("Access token saved for user");

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Error exchanging token:", error);
    return NextResponse.json(
      { error: "Failed to exchange token" },
      { status: 500 }
    );
  }
}

async function saveAccessToken(userId, accessToken) {
  console.log("Saving access token for user:", userId);
  await connectMongo();
  try {
    await User.findByIdAndUpdate(userId, { plaidAccessToken: accessToken });
    console.log("Access token saved successfully");
  } catch (error) {
    console.error("Error saving access token:", error);
    throw new Error("Failed to save access token");
  }
}
