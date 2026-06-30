import { useState, useCallback } from "react";
import { departmentApi } from "../api/departmentApi";

export const useDeleteDepartment = (demoId, onSuccess) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deleteDepartment = useCallback(
    async (departmentId) => {
      if (!window.confirm("Are you sure you want to delete this department?")) {
        return;
      }

      setIsDeleting(true);
      setError(null);

      try {
        await departmentApi.deleteDepartment(demoId, departmentId);

        if (onSuccess) onSuccess();
      } catch (err) {
        setError(
          err.message || "An error occurred while deleting the department.",
        );
        alert(err.message || "Failed to delete the department.");
      } finally {
        setIsDeleting(false);
      }
    },
    [demoId, onSuccess],
  );

  return {
    deleteDepartment,
    isDeleting,
    error,
  };
};
