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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { CategoryCombobox } from "@/components/CategoryCombobox";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

const Expenses = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [rows, setRows] = useState([{ name: "", cost: "", category: "" }]);

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
    }
  };

  return (
    <form onSubmit={handleSave} className="lg:col-span-2">
      <Card className="sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Track Your Expenses</CardTitle>
          <CardDescription>
            Enter your expenses below to keep track of your spending.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Expense Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead></TableHead> {/* Empty header for the trash icon */}
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" onClick={addRow}>
            + Add Row
          </Button>
          <Button type="submit">Save</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default Expenses;
