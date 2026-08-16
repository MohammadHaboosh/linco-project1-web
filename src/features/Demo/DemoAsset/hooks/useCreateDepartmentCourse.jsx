import { useState } from "react";
import { demoAssetsApi } from "../api/demoAssetsApi";

export const useCreateDepartmentCourse = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(false);

  const pullToDepartment = async (demoId, departmentId, assetId) => {
    setIsImporting(true);
    setImportError(false);
    try {
      const response = await demoAssetsApi.createDepartmentCourse(
        demoId,
        departmentId,
        assetId,
      );
      return response;
    } catch (error) {
      setImportError(true);
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  return { pullToDepartment, isImporting, importError };
};
