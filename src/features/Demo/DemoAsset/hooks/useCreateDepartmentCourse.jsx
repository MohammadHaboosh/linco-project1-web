import { useState } from "react";
import { demoAssetsApi } from "../api/demoAssetsApi";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";

export const useCreateDepartmentCourse = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);

  const pullToDepartment = async (demoId, departmentId, assetId) => {
    setIsImporting(true);
    setImportError(null);
    try {
      const response = await demoAssetsApi.createDepartmentCourse(
        demoId,
        departmentId,
        assetId,
      );
      return response;
    } catch (error) {
      setImportError(getApiErrorMessage(error) || true);
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  return { pullToDepartment, isImporting, importError };
};
