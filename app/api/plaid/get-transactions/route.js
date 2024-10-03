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
  console.log("Fetching Plaid transactions...");
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { selectedMonth } = await req.json();

    // Fetch the access token from the database
    await connectMongo();
    const user = await User.findById(userId);
    if (!user || !user.plaidAccessToken) {
      throw new Error("No Plaid access token found for this user");
    }
    const accessToken = user.plaidAccessToken;

    // Parse the selectedMonth string into a Date object
    const monthNames = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
    const monthIndex = monthNames.indexOf(selectedMonth.toLowerCase());

    if (monthIndex === -1) {
      throw new Error("Invalid month name");
    }

    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, monthIndex, 1);
    const endDate = new Date(currentYear, monthIndex + 1, 0);

    console.log("Start Date:", startDate.toISOString());
    console.log("End Date:", endDate.toISOString());

    const request = {
      access_token: accessToken,
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
    };

    const response = await plaidClient.transactionsGet(request);
    let transactions = response.data.transactions;
    console.log("Number of transactions fetched:", transactions.length);

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions: " + error.message },
      { status: 500 }
    );
  }
}
