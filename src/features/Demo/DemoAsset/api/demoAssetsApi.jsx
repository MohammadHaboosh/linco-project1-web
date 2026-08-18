import { apiFetch } from "../../../../api/apiFetch";

export const demoAssetsApi = {
  createDepartmentCourse: async (demoId, departmentId, assetId) => {
    try {
      const response = await apiFetch(`/departmentCourses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
          "x-demo-id": demoId,
          "x-department-id": departmentId,
        },
        body: JSON.stringify({ assetId: assetId }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to create department course");
      }
      return data;
    } catch (error) {
      console.error("API Error during department course creation:", error);
      throw error;
    }
  },
};
