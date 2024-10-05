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
