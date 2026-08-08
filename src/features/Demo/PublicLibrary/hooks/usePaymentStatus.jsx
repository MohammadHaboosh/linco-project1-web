import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { libraryApi } from "../api/libraryApi";

export const usePaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [statusData, setStatusData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sessionId) {
      const checkStatus = async () => {
        setIsLoading(true);
        try {
          const response = await libraryApi.getPaymentStatus(sessionId);
          if (response.success) {
            setStatusData(response.data);
          }
        } catch (err) {
          setError(err.message || "Error fetching payment status");
        } finally {
          setIsLoading(false);
        }
      };

      checkStatus();
    }
  }, [sessionId]);

  return { statusData, isLoading, error, sessionId };
};
