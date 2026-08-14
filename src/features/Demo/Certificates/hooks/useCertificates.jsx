import { useState, useEffect } from "react";
import { certificatesApi } from "../api/certificatesApi";

export const useCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    queueMicrotask(() => {
      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }
    });

    const loadData = async () => {
      try {
        const data = await certificatesApi.getMyCertificates();
        if (isMounted) setCertificates(data || []);
      } catch (err) {
        if (isMounted)
          setError(
            err.message || "An error occurred while fetching certificates.",
          );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await certificatesApi.getMyCertificates();
      setCertificates(data || []);
    } catch (err) {
      setError(err.message || "An error occurred while fetching certificates.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    certificates,
    isLoading,
    error,
    refetch,
  };
};
