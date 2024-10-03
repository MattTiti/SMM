import PlaidLink from "@/components/PlaidLink";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { WandSparkles, CirclePlus } from "lucide-react";
import Spinner from "@/components/Spinner";

const AdvancedActions = ({
  userId,
  selectedMonth,
  handlePlaidSuccess,
  open,
  setOpen,
  loading,
  smartAddValue,
  setSmartAddValue,
  handleSmartAdd,
  setLoading,
}) => {
  return (
    <div className="flex justify-end gap-2">
      <PlaidLink
        userId={userId}
        selectedMonth={selectedMonth}
        onSuccess={handlePlaidSuccess}
        setLoading={setLoading}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full sm:w-auto"
          >
            <WandSparkles size={14} className="mr-1" /> Smart Add
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Smart Add</DialogTitle>
            <DialogDescription>
              Paste or type values below and click add to extract expenses.
              Longer text will take longer to process.
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
              <Button
                onClick={handleSmartAdd}
                className="mt-2 w-full sm:w-auto"
              >
                <CirclePlus size={16} className="mr-1" /> Add
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvancedActions;
