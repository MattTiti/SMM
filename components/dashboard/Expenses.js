import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaInfoCircle } from "react-icons/fa";
import axios from "axios";
import { CategoryCombobox } from "@/components/CategoryCombobox";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";
import Spinner from "@/components/Spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectTriggerColor,
} from "@/components/ui/select";
import ExpensesFooter from "./ExpensesFooter";
import AdvancedActions from "./AdvancedActions";
import { determineCategory } from "@/lib/utils";

const Expenses = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  budget,
  rows,
  setRows,
  loading,
  setLoading,
  setUpdate,
  update,
}) => {
  const [smartAddValue, setSmartAddValue] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const lastRowRef = useRef(null);
  const shouldScrollRef = useRef(false);

  useEffect(() => {
    if (shouldScrollRef.current && lastRowRef.current) {
      // Only scrolls when a new row is added
      lastRowRef.current.scrollIntoView({ behavior: "smooth" });
      shouldScrollRef.current = false;
    }
  }, [rows]);

  const addRow = () => {
    setRows([...rows, { name: "", cost: "", category: "", label: "" }]);
    shouldScrollRef.current = true;
  };

  const handleCategoryChange = (index, category) => {
    setRows(rows.map((row, i) => (i === index ? { ...row, category } : row)));
  };

  const handleDeleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put("/api/expenses", {
        month: selectedMonth,
        year: selectedYear,
        budget,
        expenses: rows,
      });
      toast.success("Expenses saved successfully!");
    } catch (error) {
      toast.error("Error saving expenses");
    } finally {
      setLoading(false);
      setUpdate(!update);
    }
  };

  const handleSmartAdd = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/parse", {
        bankStatement: smartAddValue,
      });

      const newExpenses = Array.isArray(response.data.expenses)
        ? response.data.expenses
        : [response.data.expenses];

      let newRows = [...rows, ...newExpenses];

      // Filter out the initial empty row if it exists
      newRows = newRows.filter(
        (row) =>
          row.name.trim() !== "" ||
          row.cost.trim() !== "" ||
          row.category.trim() !== ""
      );

      shouldScrollRef.current = true;

      try {
        // Saving the response data before updating state because the state update is async
        const saveResponse = await axios.put("/api/expenses", {
          month: selectedMonth,
          budget,
          expenses: newRows,
        });

        toast.success("Expenses saved successfully!");
      } catch (error) {
        toast.error("Error saving expenses");
      } finally {
        setLoading(false);
        setUpdate(!update);
      }
      setOpen(false);
    } catch (error) {
      toast.error("Error using OpenAI to parse expenses");
    } finally {
      setLoading(false);
      setSmartAddValue("");
    }
  };

  const handleReset = async () => {
    setRows([{ name: "", cost: "", category: "", label: "" }]);
    try {
      const response = await axios.put("/api/expenses", {
        month: selectedMonth,
        year: selectedYear,
        budget,
        expenses: [{ name: "", cost: "", category: "", label: "" }],
      });
      toast.success("Expenses cleared successfully!");
    } catch (error) {
      toast.error("Error saving expenses");
    } finally {
      setUpdate(!update);
    }
  };

  const handlePlaidSuccess = (transactions) => {
    let transactionsArray = transactions.map((transaction) => ({
      name: transaction.name,
      cost: transaction.amount,
      category: determineCategory(transaction),
      label: "",
    }));

    setRows((prevRows) => {
      // Filter out any completely empty rows from prevRows
      const filteredPrevRows = prevRows.filter(
        (row) =>
          row.name.trim() !== "" ||
          row.cost.trim() !== "" ||
          row.category.trim() !== ""
      );
      return [...filteredPrevRows, ...transactionsArray];
    });

    shouldScrollRef.current = true;
  };

  return (
    <>
      <AdvancedActions
        selectedMonth={selectedMonth}
        handlePlaidSuccess={handlePlaidSuccess}
        open={open}
        setOpen={setOpen}
        loading={loading}
        setLoading={setLoading}
        smartAddValue={smartAddValue}
        setSmartAddValue={setSmartAddValue}
        handleSmartAdd={handleSmartAdd}
      />
      <form onSubmit={handleSave} className="lg:col-span-2">
        <Card className="sm:col-span-2">
          <CardHeader className="pb-3 flex justify-between items-start border-b border-black/10">
            <div className="flex w-full justify-between items-center">
              <div>
                <CardTitle className="text-md sm:text-xl">
                  Track Your Expenses
                </CardTitle>
                <CardDescription className="hidden sm:block">
                  Enter expenses and save changes to see updated graphics
                </CardDescription>
              </div>
              <div className="flex items-end gap-2">
                <Select onValueChange={setSelectedMonth} value={selectedMonth}>
                  <SelectTrigger className="w-[60px] sm:w-[120px]">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="january">January</SelectItem>
                      <SelectItem value="february">February</SelectItem>
                      <SelectItem value="march">March</SelectItem>
                      <SelectItem value="april">April</SelectItem>
                      <SelectItem value="may">May</SelectItem>
                      <SelectItem value="june">June</SelectItem>
                      <SelectItem value="july">July</SelectItem>
                      <SelectItem value="august">August</SelectItem>
                      <SelectItem value="september">September</SelectItem>
                      <SelectItem value="october">October</SelectItem>
                      <SelectItem value="november">November</SelectItem>
                      <SelectItem value="december">December</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select onValueChange={setSelectedYear} value={selectedYear}>
                  <SelectTrigger className="w-[50px] sm:w-[90px]">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <Spinner />
              </div>
            ) : (
              <div className="max-h-[100vh] overflow-y-scroll">
                <Table className="">
                  <TableHeader className="text-black/80">
                    <TableRow>
                      <TableHead className="text-gray-700 sm:pl-8">
                        Name
                      </TableHead>
                      <TableHead className="text-gray-700">Price</TableHead>
                      <TableHead className="text-gray-700">Category</TableHead>
                      <TableHead className="flex items-center px-2 w-10">
                        <span className="text-gray-700">Label</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-muted/0 justify-start ml-2 text-black/70"
                            >
                              <FaInfoCircle />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64">
                            <div className="text-sm">
                              Labels allow for additional categorization of
                              expenses (e.g. Green = Good, Red = Bad)
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      <TableHead className="px-0"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows &&
                      rows.map((row, index) => (
                        <TableRow
                          key={index}
                          ref={index === rows.length - 1 ? lastRowRef : null}
                        >
                          <TableCell className="sm:pl-8">
                            <Input
                              placeholder="Enter name"
                              value={row.name}
                              onChange={(e) =>
                                setRows(
                                  rows.map((r, i) =>
                                    i === index
                                      ? { ...r, name: e.target.value }
                                      : r
                                  )
                                )
                              }
                              className="w-[130px] sm:w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Enter cost"
                              type="number"
                              value={row.cost}
                              onChange={(e) =>
                                setRows(
                                  rows.map((r, i) =>
                                    i === index
                                      ? { ...r, cost: e.target.value }
                                      : r
                                  )
                                )
                              }
                              className="w-[70px] sm:w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <CategoryCombobox
                              selectedCategory={row.category || ""}
                              onCategoryChange={(category) =>
                                handleCategoryChange(index, category)
                              }
                            />
                          </TableCell>
                          <TableCell className="flex mt-1 justify-start ml-1">
                            <Select
                              value={row.label}
                              onValueChange={(label) =>
                                setRows(
                                  rows.map((r, i) =>
                                    i === index ? { ...r, label } : r
                                  )
                                )
                              }
                            >
                              <SelectTriggerColor
                                className={
                                  row.label === "white" || row.label === ""
                                    ? "bg-white"
                                    : row.label === "red"
                                    ? `bg-${row.label}-600`
                                    : `bg-${row.label}-500`
                                }
                              ></SelectTriggerColor>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem
                                    value="green"
                                    className="bg-green-500 focus:bg-green-600"
                                  >
                                    <span className="inline-block w-full h-8 bg-blue-500 rounded"></span>
                                  </SelectItem>
                                  <SelectItem
                                    value="yellow"
                                    className="bg-yellow-500 focus:bg-yellow-600"
                                  >
                                    <span className="inline-block w-full h-8 bg-yellow-500 rounded"></span>
                                  </SelectItem>
                                  <SelectItem
                                    value="red"
                                    className="bg-red-600 focus:bg-red-700"
                                  >
                                    <span className="inline-block w-full h-8 bg-red-600 rounded"></span>
                                  </SelectItem>
                                  <SelectItem
                                    value="white"
                                    className="pl-10 bg-white"
                                  >
                                    <span className="flex items-center justify-center w-full h-8 rounded">
                                      None
                                    </span>
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="px-0 sm:pr-4">
                            <Button
                              type="button"
                              variant="ghost"
                              className="hover:bg-transparent"
                              size="icon"
                              onClick={() => handleDeleteRow(index)}
                            >
                              <X className="h-5 w-5 text-black hover:text-black/60" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <ExpensesFooter
            addRow={addRow}
            open={open}
            setOpen={setOpen}
            smartAddValue={smartAddValue}
            setSmartAddValue={setSmartAddValue}
            handleSmartAdd={handleSmartAdd}
            loading={loading}
            resetDialogOpen={resetDialogOpen}
            setResetDialogOpen={setResetDialogOpen}
            handleReset={handleReset}
          />
        </Card>
      </form>
    </>
  );
};

export default Expenses;
