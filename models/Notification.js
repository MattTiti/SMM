import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  budgetNotifications: {
    type: Boolean,
    default: false,
  },
  budgetThresholds: {
    fifty: { type: Boolean, default: false },
    seventyFive: { type: Boolean, default: false },
    ninety: { type: Boolean, default: false },
    hundred: { type: Boolean, default: false },
  },
  weeklyReports: {
    type: Boolean,
    default: false,
  },
  monthlyReports: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
