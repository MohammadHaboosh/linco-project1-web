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

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to fetch department course");
      }
      return data;
    } catch (error) {
      console.error("API Error during department course fetch:", error);
      throw error;
    }
  },

  deleteDepartmentCourse: async (
    demoId,
    departmentId,
    departmentCourseId,
  ) => {
    if (!demoId) {
      throw new Error("Demo ID is required to delete a department course.");
    }

    if (!departmentId) {
      throw new Error("Department ID is required to delete a course.");
    }

    if (!departmentCourseId) {
      throw new Error(
        "Department course ID is required to delete a department course.",
      );
    }

    const response = await apiFetch(
      `/departmentCourses/${encodeURIComponent(departmentCourseId)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
          "x-demo-id": demoId,
          "x-department-id": departmentId,
        },
      },
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      throw new Error(data.message || "Failed to delete department course");
    }

    return data;
  },
};
