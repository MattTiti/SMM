"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-hot-toast";

const Notifications = () => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [budgetNotifications, setBudgetNotifications] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [monthlyReports, setMonthlyReports] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`/api/notifications`);
        const { data } = response.data;

        if (data) {
          const { budgetNotifications, weeklyReports, monthlyReports } = data;
          setBudgetNotifications(budgetNotifications);
          setWeeklyReports(weeklyReports);
          setMonthlyReports(monthlyReports);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleSave = async () => {
    try {
      await axios.post("/api/notifications", {
        budgetNotifications,
        weeklyReports,
        monthlyReports,
      });
      toast.success("Preferences Saved!");
      setNotificationOpen(false);
    } catch (error) {
      console.error("Error saving notifications:", error);
      toast.error("Failed to save notification preferences");
    }
  };

  return (
    <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          onClick={() => setNotificationOpen(true)}
          className="w-full sm:w-auto"
        >
          <Bell size={14} className="mr-1" /> Notifications
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notification Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <Label
              htmlFor="budget-notifications"
              className="flex flex-col gap-1"
            >
              Budget Notifications
            </Label>
            <Switch
              id="budget-notifications"
              checked={budgetNotifications}
              onCheckedChange={setBudgetNotifications}
            />
          </div>
          <span className="text-sm text-black/50">
            Get alerts when you&apos;re close to your budget limit
          </span>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="weekly-reports" className="flex flex-col">
              Weekly Reports
            </Label>
            <Switch
              id="weekly-reports"
              checked={weeklyReports}
              onCheckedChange={setWeeklyReports}
            />
          </div>
          <span className="text-sm text-black/50">
            Receive a weekly expense report
          </span>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="monthly-reports" className="flex flex-col">
              Monthly Reports
            </Label>
            <Switch
              id="monthly-reports"
              checked={monthlyReports}
              onCheckedChange={setMonthlyReports}
            />
          </div>
          <span className="text-sm text-black/50">
            Receive a monthly expense report
          </span>
        </div>
        <div className="mt-6">
          <Button onClick={handleSave} className="w-full">
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Notifications;
