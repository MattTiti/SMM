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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import axios from "axios";
import { CategoryCombobox } from "@/components/CategoryCombobox";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import Spinner from "@/components/Spinner";

const Expenses = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [rows, setRows] = useState([{ name: "", cost: "", category: "" }]);
  const [smartAddValue, setSmartAddValue] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch expenses on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const response = await axios.get(`/api/expenses`, {
          params: { userId },
        });

        setRows(response.data.expenses[0].expenses);
        console.log("Expenses fetched:", response.data.expenses[0].expenses);
      } catch (error) {
        toast.error("Error fetching expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [userId]);

  const addRow = () => {
    setRows([...rows, { name: "", cost: "", category: "" }]);
  };

  const handleCategoryChange = (index, category) => {
    setRows(rows.map((row, i) => (i === index ? { ...row, category } : row)));
  };

  const handleDeleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
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

      setRows([...rows, ...newExpenses]);

      toast.success("Expenses parsed successfully!");
      setOpen(false);
    } catch (error) {
      toast.error("Error adding expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Saving expenses:", rows);
    try {
      const response = await axios.put("/api/expenses", {
        userId,
        expenses: rows,
      });
      console.log("Expenses saved:", response.data);
      toast.success("Expenses saved successfully!");
    } catch (error) {
      toast.error("Error saving expenses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="lg:col-span-2">
      <Card className="sm:col-span-2">
        <CardHeader className="pb-3 flex justify-between items-start">
          <div>
            <CardTitle>Track Your Expenses</CardTitle>
            <CardDescription>
              Enter your expenses below to keep track of your spending.
            </CardDescription>
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
                {rows.map((row, index) => (
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
                        selectedCategory={row.category}
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
          <Button type="button" onClick={addRow}>
            + Add Row
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button type="button" onClick={() => setOpen(true)}>
                Smart Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Smart Add</DialogTitle>
                <DialogDescription>
                  Paste or type values below and click "Smart Add" to extract expenses. Longer text will take longer to process.
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
          <Button type="submit">Save</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default Expenses;
