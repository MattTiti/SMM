import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
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
import { CirclePlus } from "lucide-react";

const ExpensesFooter = ({
  addRow,
  resetDialogOpen,
  setResetDialogOpen,
  handleReset,
}) => {
  return (
    <CardFooter className="flex flex-col sm:flex-row justify-between border-t border-black/10 pt-4 gap-4">
      <Button
        type="button"
        onClick={addRow}
        className="w-full sm:w-auto order-1 sm:order-none"
      >
        <CirclePlus size={16} className="mr-1" /> Add Row
      </Button>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Reset
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Reset</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reset all expenses? This action cannot
                be undone.
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
        <Button type="submit" className="w-full sm:w-auto">
          Save
        </Button>
      </div>
    </CardFooter>
  );
};

export default ExpensesFooter;
