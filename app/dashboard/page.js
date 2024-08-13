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

export default function Dashboard() {
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
            <DashboardSummary />
            <Expenses />
          </div>
          <div className="self-start">
            <DashboardGraphs />
          </div>
        </div>
      </div>
    </div>
  );
}
