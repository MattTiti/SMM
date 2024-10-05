"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WandSparkles, CirclePlus } from "lucide-react";
import Spinner from "@/components/Spinner";

const SmartAdd = ({
  open,
  setOpen,
  setSmartAddValue,
  smartAddValue,
  handleSmartAdd,
  loading,
}) => {
  return (
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
            Paste or type values below and click add to extract expenses. Longer
            text will take longer to process.
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
            <Button onClick={handleSmartAdd} className="mt-2 w-full sm:w-auto">
              <CirclePlus size={16} className="mr-1" /> Add
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SmartAdd;
