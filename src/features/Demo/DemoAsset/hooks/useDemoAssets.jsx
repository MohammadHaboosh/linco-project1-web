import { useState, useEffect } from "react";
import { ownerCoursesApi } from "../../OwnerCourses/api/ownerCoursesApi";

export const useDemoAssets = (demoId) => {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (demoId) {
      const fetchAssets = async () => {
        setIsLoading(true);
        try {
          const data = await ownerCoursesApi.getDemoAssets(demoId);
          setAssets(data || []);
        } catch (err) {
          console.error("Error fetching demo assets:", err);
          setError(err.message || "Failed to load assets");
        } finally {
          setIsLoading(false);
        }
      };
      fetchAssets();
    }
  }, [demoId]);

  return { assets, isLoading, error };
};
