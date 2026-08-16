import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { departmentApi } from "../api/departmentApi";

export const useDeleteDepartment = (demoId, onSuccess) => {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deleteDepartment = useCallback(
    async (departmentId) => {
      setIsDeleting(true);
      setError(null);

      try {
        await departmentApi.deleteDepartment(demoId, departmentId);

        if (onSuccess) onSuccess();
        return true;
      } catch {
        setError(t("department-delete-failed"));
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [demoId, onSuccess, t],
  );

  return {
    deleteDepartment,
    isDeleting,
    error,
    clearError: () => setError(null),
  };
};
