const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const departmentApi = {
  searchMembers: async (demoId, searchQuery) => {
    try {
      const response = await fetch(
        `${BASE_URL}/demos/${demoId}/members?search=${encodeURIComponent(searchQuery)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-client-type": "web",
          },
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to search members");
      }

      return data.data;
    } catch (error) {
      console.error("API Error during member search:", error);
      throw error;
    }
  },

  createDepartment: async (demoId, departmentPayload) => {
    try {
      console.log(departmentPayload);
      console.log(JSON.stringify(departmentPayload));
      const response = await fetch(`${BASE_URL}/demos/${demoId}/departments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
        },
        credentials: "include",
        body: JSON.stringify(departmentPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create department");
      }
      return data;
    } catch (error) {
      console.error("API Error during department creation:", error);
      throw error;
    }
  },

  getDepartments: async (demoId) => {
    try {
      const response = await fetch(`${BASE_URL}/demos/${demoId}/departments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
        },
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch departments");
      const rawDepartments = data.data || [];

      const mappedDepartments = rawDepartments.map((dept) => ({
        id: dept.id,
        title: dept.name,
        description: dept.description,
        coursesCount: dept.courseCount,
        membersCount: dept.membersCount,
        isLocked: !dept.isJoind,
        tags: [],
        progress: 0,
        ...dept,
      }));

      return mappedDepartments;
    } catch (error) {
      console.error("API Error during fetching departments:", error);
      throw error;
    }
  },
};
