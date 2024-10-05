import PlaidLink from "@/components/dashboard/PlaidLink";
import Notifications from "@/components/dashboard/Notifications";
import SmartAdd from "@/components/dashboard/SmartAdd";

const AdvancedActions = ({
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
    <div className="flex justify-between gap-2 flex-wrap sm:flex-nowrap">
      <Notifications />
      <div className="flex justify-end gap-2 w-full">
        <PlaidLink
          selectedMonth={selectedMonth}
          onSuccess={handlePlaidSuccess}
          setLoading={setLoading}
        />
        <SmartAdd
          open={open}
          setOpen={setOpen}
          smartAddValue={smartAddValue}
          setSmartAddValue={setSmartAddValue}
          handleSmartAdd={handleSmartAdd}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AdvancedActions;
