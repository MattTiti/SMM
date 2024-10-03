import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
const PlaidLink = ({ selectedMonth, onSuccess, setLoading }) => {
  const [hasExistingToken, setHasExistingToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkExistingToken = async () => {
      try {
        const response = await axios.get(`/api/plaid/check-token`);
        setHasExistingToken(response.data.hasToken);
      } catch (error) {
        console.error("Error checking existing token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingToken();
  }, []);

  const handleConnectBank = useCallback(async () => {
    if (!hasExistingToken) {
      try {
        const response = await axios.post("/api/plaid/create-link-token");
        setToken(response.data.link_token);
      } catch (error) {
        console.error("Error creating link token:", error);
      }
    }
  }, [hasExistingToken]);

  const handleSync = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/plaid/get-transactions", {
        selectedMonth,
      });
      onSuccess(response.data.transactions);
    } catch (error) {
      console.error("Error syncing transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, onSuccess]);

  if (isLoading) {
    return <Button disabled>Loading...</Button>;
  }

  if (hasExistingToken) {
    return (
      <Button onClick={handleSync} className="w-full sm:w-auto">
        <CreditCard className="mr-2 h-4 w-4" /> Auto Sync
      </Button>
    );
  }

  return (
    <>
      <Button onClick={handleConnectBank}>Connect a bank account</Button>
      {token && (
        <PlaidLinkComponent
          token={token}
          selectedMonth={selectedMonth}
          onSuccess={onSuccess}
          onExit={() => setToken(null)}
        />
      )}
    </>
  );
};

const PlaidLinkComponent = ({ token, selectedMonth, onSuccess, onExit }) => {
  const handlePlaidSuccess = useCallback(
    async (publicToken, metadata) => {
      try {
        // Exchange public token for access token
        await axios.post("/api/plaid/exchange-token", {
          publicToken,
        });

        // Fetch transactions for the selected month
        const transactionsResponse = await axios.post(
          "/api/plaid/get-transactions",
          {
            selectedMonth,
          }
        );

        onSuccess(transactionsResponse.data.transactions);
      } catch (error) {
        console.error("Error in Plaid flow:", error);
      } finally {
        onExit(); // Clean up after success
      }
    },
    [selectedMonth, onSuccess, onExit]
  );

  const { open, ready } = usePlaidLink({
    token,
    onSuccess: handlePlaidSuccess,
    onExit,
  });

  useEffect(() => {
    if (ready) {
      open();
    }
  }, [ready, open]);

  return null; // No UI needed here
};

export default PlaidLink;
