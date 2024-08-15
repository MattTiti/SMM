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
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import DashboardPieChart from "@/components/DashboardPieChart";
import DashboardBarChart from "@/components/DashboardBarChart";
import ButtonCheckout from "@/components/ButtonCheckout";
import config from "@/config";
export const dynamic = "force-dynamic";
import ButtonAccount from "@/components/ButtonAccount";
export default function Dashboard() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  console.log(session);
  const [selectedMonth, setSelectedMonth] = useState("august"); // Default month
  const [budget, setBudget] = useState("0"); // Add budget state
  const [monthlyExpenses, setMonthlyExpenses] = useState([
    { name: "", cost: "", category: "" },
  ]);
  const [yearlyExpenses, setYearlyExpenses] = useState([
    { name: "", cost: "", category: "" },
  ]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  // Fetch expenses on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const response = await axios.get(`/api/dashboard`, {
          params: { userId, month: selectedMonth },
        });

        const data = response?.data?.monthlyExpenses[0];
        console.log(response);
        setMonthlyExpenses(
          data?.expenses || [{ name: "", cost: "", category: "" }]
        );
        setYearlyExpenses(
          response?.data?.allExpenses || [{ name: "", cost: "", category: "" }]
        );
        setBudget(data?.budget || "0");
      } catch (error) {
        console.error("Error fetching expenses:", error);
        toast.error("Error fetching expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [userId, selectedMonth, update]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-end border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <ButtonAccount />
        </header>
        <div className="grid flex-1 grid-cols-1 gap-4 p-4 sm:px-6 sm:py-0 md:grid-cols-3 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <DashboardSummary
              setBudget={setBudget}
              budget={budget}
              userId={userId}
              selectedMonth={selectedMonth}
              rows={monthlyExpenses}
            />
            <Expenses
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              budget={budget}
              savedRows={monthlyExpenses}
              setSavedRows={setMonthlyExpenses}
              userId={userId}
              loading={loading}
              setLoading={setLoading}
              update={update}
              setUpdate={setUpdate}
            />
          </div>
          <div className="self-start">
            <div className="space-y-4">
              <DashboardPieChart
                monthlyExpenses={monthlyExpenses}
                selectedMonth={selectedMonth}
              />
              <DashboardBarChart
                yearlyExpenses={yearlyExpenses}
                selectedMonth={selectedMonth}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
