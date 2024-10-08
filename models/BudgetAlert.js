import mongoose from "mongoose";

const BudgetAlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  threshold: {
    type: Number,
    required: true,
  },
  sentAt: {
    type: Date,
    required: true,
  },
});

export default mongoose.models.BudgetAlert ||
  mongoose.model("BudgetAlert", BudgetAlertSchema);
