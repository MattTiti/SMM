import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "react-hot-toast";
import axios from "axios";

const DashboardSummary = ({
  setBudget,
  budget,
  rows,
  selectedMonth,
  userId,
}) => {
  const [open, setOpen] = useState(false);

  const handleSaveBudget = async () => {
    try {
      await axios.put("/api/expenses", {
        userId,
        month: selectedMonth,
        budget,
        expenses: rows,
      });
      toast.success("Budget saved successfully!");
    } catch (error) {
      console.log("Error saving budget:", error);
      toast.error("Error saving budget");
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 lg:col-span-2">
      <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
        <CardHeader className="pb-2">
          <CardDescription>This Week</CardDescription>
          <CardTitle className="text-4xl">$1,329</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            +25% from last week
          </div>
        </CardContent>
        <CardFooter>
          <Progress value={25} aria-label="25% increase" />
        </CardFooter>
      </Card>
      <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-1">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <div>
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-4xl">$5,329/{budget}</CardTitle>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="ml-4">
                  Set Budget
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Monthly Budget</DialogTitle>
                  <DialogDescription>
                    Set your budget for the month
                  </DialogDescription>
                </DialogHeader>
                <Input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Enter budget"
                  className="mt-4"
                />
                <Button onClick={handleSaveBudget} className="mt-4">
                  Save Budget
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            +10% from last month
          </div>
        </CardContent>
        <CardFooter>
          <Progress value={12} aria-label="12% increase" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default DashboardSummary;
