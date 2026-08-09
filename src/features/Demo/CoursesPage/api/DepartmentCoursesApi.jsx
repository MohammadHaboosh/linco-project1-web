import { apiFetch } from "../../../../api/apiFetch";

export const DepartmentCoursesApi = {
  getDepartmentCourse: async (demoId, departmentId) => {
    try {
      const response = await apiFetch(`/departmentCourses/cursor`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
          "x-demo-id": demoId,
          "x-department-id": departmentId,
        },
      });

      const data = await response.json();
      console.log("Get Department Courses Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch department course");
      }
      return data;
    } catch (error) {
      console.error("API Error during department course fetch:", error);
      throw error;
    }
  },
};
