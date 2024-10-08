import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Notification from "@/models/Notification";
import User from "@/models/User";
import Expense from "@/models/Expense";
import { sendEmail } from "@/libs/mailgun";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import BudgetAlert from "@/models/BudgetAlert"; // We'll create this model

const plaid = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV],
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
        "PLAID-SECRET": process.env.PLAID_SECRET,
      },
    },
  })
);

export async function GET() {
  await connectMongo();

  try {
    const notifications = await Notification.find({
      budgetNotifications: true,
    });

    const currentDate = new Date();
    const currentMonth = currentDate
      .toLocaleString("default", { month: "long" })
      .toLowerCase();
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    )
      .toISOString()
      .split("T")[0];
    const endDate = currentDate.toISOString().split("T")[0];

    for (const notification of notifications) {
      const user = await User.findById(notification.userId);
      const expense = await Expense.findOne({
        userId: user._id,
        month: currentMonth,
      });

      if (expense && expense.budget && user.plaidAccessToken) {
        try {
          const transactionsResponse = await plaid.transactionsGet({
            access_token: user.plaidAccessToken,
            start_date: startDate,
            end_date: endDate,
          });

          const transactions = transactionsResponse.data.transactions;
          const totalSpent = transactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
          );
          const budgetPercentage = (totalSpent / expense.budget) * 100;

          const thresholds = [
            { name: "fifty", value: 50 },
            { name: "seventyFive", value: 75 },
            { name: "ninety", value: 90 },
            { name: "hundred", value: 100 },
          ];

          for (const threshold of thresholds) {
            if (
              budgetPercentage >= threshold.value &&
              notification.budgetThresholds[threshold.name]
            ) {
              const existingAlert = await BudgetAlert.findOne({
                userId: user._id,
                month: currentMonth,
                threshold: threshold.value,
              });

              if (!existingAlert) {
                await sendEmail({
                  to: user.email,
                  subject: "Budget Alert",
                  text: `You've spent ${budgetPercentage.toFixed(
                    2
                  )}% of your budget for ${currentMonth}.`,
                });

                await BudgetAlert.create({
                  userId: user._id,
                  month: currentMonth,
                  threshold: threshold.value,
                  sentAt: new Date(),
                });
              }
            }
          }
        } catch (plaidError) {
          console.error("Error fetching Plaid transactions:", plaidError);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in budget notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
