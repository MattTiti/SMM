"use client";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Expenses from "@/components/Expenses";
import DashboardSummary from "@/components/DashboardSummary";
import DashboardGraphs from "@/components/DashboardGraphs";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function Dashboard() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [selectedMonth, setSelectedMonth] = useState("august"); // Default month
  const [budget, setBudget] = useState("0"); // Add budget state
  const [savedRows, setSavedRows] = useState([
    { name: "", cost: "", category: "" },
  ]);
  const [loading, setLoading] = useState(true);

  // Fetch expenses on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const response = await axios.get(`/api/dashboard`, {
          params: { userId, month: selectedMonth },
        });

        const data = response.data.expenses[0];
        setSavedRows(data.expenses || [{ name: "", cost: "", category: "" }]);
        setBudget(data.budget || "0");
      } catch (error) {
        console.error("Error fetching expenses:", error);
        toast.error("Error fetching expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [userId, selectedMonth]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-end border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <FaUserCircle size={36} className="text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <div className="grid flex-1 grid-cols-1 gap-4 p-4 sm:px-6 sm:py-0 md:grid-cols-3 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <DashboardSummary
              setBudget={setBudget}
              budget={budget}
              userId={userId}
              selectedMonth={selectedMonth}
              rows={savedRows}
            />
            <Expenses
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              budget={budget}
              savedRows={savedRows}
              setSavedRows={setSavedRows}
              userId={userId}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
          <div className="self-start">
            <DashboardGraphs rows={savedRows} selectedMonth={selectedMonth} />
          </div>
        </div>
      </div>
    </div>
  );
}
