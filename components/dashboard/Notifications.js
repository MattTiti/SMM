"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-hot-toast";

const Notifications = () => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [budgetNotifications, setBudgetNotifications] = useState(false);
  const [budgetThresholds, setBudgetThresholds] = useState({
    fifty: false,
    seventyFive: false,
    ninety: false,
    hundred: false,
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`/api/notifications`);
        const { data } = response.data;

        if (data) {
          const { budgetNotifications, budgetThresholds } = data;
          setBudgetNotifications(budgetNotifications);
          setBudgetThresholds(
            budgetThresholds || {
              fifty: false,
              seventyFive: false,
              ninety: false,
              hundred: false,
            }
          );
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
        budgetThresholds,
      });
      toast.success("Preferences Saved!");
      setNotificationOpen(false);
    } catch (error) {
      console.error("Error saving notifications:", error);
      toast.error("Failed to save notification preferences");
    }
  };

  const handleThresholdChange = (threshold) => {
    setBudgetThresholds((prev) => ({
      ...prev,
      [threshold]: !prev[threshold],
    }));
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
          <DialogTitle>Email Notification Settings</DialogTitle>
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

          {budgetNotifications && (
            <div className="ml-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fifty"
                  checked={budgetThresholds.fifty}
                  onCheckedChange={() => handleThresholdChange("fifty")}
                />
                <label
                  htmlFor="fifty"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  50% of budget
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="seventyFive"
                  checked={budgetThresholds.seventyFive}
                  onCheckedChange={() => handleThresholdChange("seventyFive")}
                />
                <label
                  htmlFor="seventyFive"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  75% of budget
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ninety"
                  checked={budgetThresholds.ninety}
                  onCheckedChange={() => handleThresholdChange("ninety")}
                />
                <label
                  htmlFor="ninety"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  90% of budget
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hundred"
                  checked={budgetThresholds.hundred}
                  onCheckedChange={() => handleThresholdChange("hundred")}
                />
                <label
                  htmlFor="hundred"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  100% of budget
                </label>
              </div>
            </div>
          )}
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
