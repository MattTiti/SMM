"use client";
import Expenses from "@/components/dashboard/Expenses";
import Summary from "@/components/dashboard/Summary";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import ChartsByCategory from "@/components/dashboard/ChartsByCategory";
import ChartsByMonth from "@/components/dashboard/ChartsByMonth";
import ButtonAccount from "@/components/ButtonAccount";
import Link from "next/link";
import config from "@/config";
import logo from "@/app/icon.png";
import Image from "next/image";
import ChartsByLabel from "@/components/dashboard/ChartsByLabel";
import { getCurrentMonthName } from "@/lib/utils";
export const dynamic = "force-dynamic";

export default function Dashboard() {
  const [rows, setRows] = useState([
    { name: "", cost: "", category: "", label: "" },
  ]);

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthName());
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [budget, setBudget] = useState("1000");
  const [monthlyExpenses, setMonthlyExpenses] = useState([
    { name: "", cost: "", category: "", label: "" },
  ]);
  const [yearlyExpenses, setYearlyExpenses] = useState([
    { name: "", cost: "", category: "", label: "" },
  ]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  // Fetch expenses on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/dashboard`, {
          params: { month: selectedMonth, year: selectedYear },
        });

        const data = response?.data?.monthlyExpenses[0];

        setMonthlyExpenses(
          data?.expenses || [{ name: "", cost: "", category: "", label: "" }]
        );
        setRows(
          data?.expenses || [{ name: "", cost: "", category: "", label: "" }]
        );
        setYearlyExpenses(
          response?.data?.allExpenses || [
            { name: "", cost: "", category: "", label: "" },
          ]
        );

        setBudget(data?.budget || "1000");
      } catch (error) {
        console.error("Error fetching expenses:", error);
        toast.error("Error fetching expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [selectedMonth, selectedYear, update]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-neutral-100">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between shadow-sm px-4 sm:shadow-none sm:static sm:h-auto bg-white/50 sm:bg-transparent sm:px-6 text-black">
          <div className="bg-white p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100">
            <Link
              className="flex items-center gap-2 shrink-0"
              href="/"
              title={`${config.appName} homepage`}
            >
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                className="w-8"
                placeholder="blur"
                priority={true}
                width={32}
                height={32}
              />
              <span className="font-semibold text-lg text-black">
                {config.appName}
              </span>
            </Link>
          </div>
          <ButtonAccount />
        </header>
        <div className="grid flex-1 grid-cols-1 gap-4 p-4 sm:px-6 sm:py-0 md:grid-cols-3 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Summary
              setBudget={setBudget}
              budget={budget}
              selectedMonth={selectedMonth}
              rows={monthlyExpenses}
            />
            <Expenses
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              budget={budget}
              rows={rows}
              setRows={setRows}
              loading={loading}
              setLoading={setLoading}
              update={update}
              setUpdate={setUpdate}
            />
          </div>
          <div className="self-start">
            <div className="space-y-4">
              <ChartsByCategory
                monthlyExpenses={monthlyExpenses}
                selectedMonth={selectedMonth}
              />
              <ChartsByMonth
                yearlyExpenses={yearlyExpenses}
                selectedMonth={selectedMonth}
              />
              <ChartsByLabel
                monthlyExpenses={monthlyExpenses}
                selectedMonth={selectedMonth}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
