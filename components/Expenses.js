import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { CategoryCombobox } from "@/components/CategoryCombobox";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Spinner from "@/components/Spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

const Expenses = ({
  selectedMonth,
  setSelectedMonth,
  budget,
  savedRows,
  setSavedRows,
  userId,
  loading,
  setLoading,
  setUpdate,
  update,
}) => {
  const [smartAddValue, setSmartAddValue] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([{ name: "", cost: "", category: "" }]);

  useEffect(() => {
    if (savedRows) {
      setRows(savedRows);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [savedRows]);
  const addRow = () => {
    setRows([...rows, { name: "", cost: "", category: "" }]);
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
    setSavedRows(rows);

    console.log("Saving expenses:", rows, "Budget:", budget);
    try {
      const response = await axios.put("/api/expenses", {
        userId,
        month: selectedMonth,
        budget,
        expenses: rows,
      });
      console.log("Expenses and budget saved:", response.data);
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
        smartAddValue,
      });

      const newExpenses = Array.isArray(response.data.expenses)
        ? response.data.expenses
        : [response.data.expenses];
      setSavedRows([...rows, ...newExpenses]);
      setRows([...rows, ...newExpenses]);

      toast.success("Expenses parsed successfully!");
      setOpen(false);
    } catch (error) {
      toast.error("Error adding expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setRows([{ name: "", cost: "", category: "" }]);
    try {
      const response = await axios.put("/api/expenses", {
        userId,
        month: selectedMonth,
        budget,
        expenses: [{ name: "", cost: "", category: "" }],
      });
      toast.success("Expenses cleared successfully!");
    } catch (error) {
      toast.error("Error saving expenses");
    }
  };

  return (
    <form onSubmit={handleSave} className="lg:col-span-2">
      <Card className="sm:col-span-2">
        <CardHeader className="pb-3 flex justify-between items-start">
          <div className="flex w-full justify-between">
            <div>
              <CardTitle>Track Your Expenses</CardTitle>
              <CardDescription>
                Enter your expenses below to keep track of your spending.
              </CardDescription>
            </div>
            <Select onValueChange={setSelectedMonth} value={selectedMonth}>
              <SelectTrigger className="w-[180px]">
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
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Spinner />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expense Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows &&
                  rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          placeholder="Enter name"
                          value={row.name}
                          onChange={(e) =>
                            setRows(
                              rows.map((r, i) =>
                                i === index ? { ...r, name: e.target.value } : r
                              )
                            )
                          }
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
                                i === index ? { ...r, cost: e.target.value } : r
                              )
                            )
                          }
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
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRow(index)}
                        >
                          <FaTrash className="text-zinc-200" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-4">
            <Button type="button" onClick={addRow}>
              + Add Row
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button type="button" onClick={() => setOpen(true)}>
                  + Smart Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Smart Add</DialogTitle>
                  <DialogDescription>
                    Paste or type values below and click Smart Add to extract
                    expenses. Longer text will take longer to process.
                  </DialogDescription>
                </DialogHeader>
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    <textarea
                      placeholder="Paste or type values here..."
                      className="w-full h-24 p-2 border rounded"
                      value={smartAddValue}
                      onChange={(e) => setSmartAddValue(e.target.value)}
                    />
                    <Button onClick={handleSmartAdd} className="mt-2">
                      + Add
                    </Button>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex gap-4">
            <AlertDialog
              open={resetDialogOpen}
              onOpenChange={setResetDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button type="button" variant="ghost">
                  Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Reset</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reset all expenses? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset}>
                    Confirm Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button type="submit">Save</Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};

export default Expenses;
