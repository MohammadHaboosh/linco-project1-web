import { apiFetch } from "../../../../api/apiFetch";

const getBackendErrorMessage = (payload) => {
  const messages = Array.isArray(payload?.message)
    ? payload.message
    : [payload?.message];

  return messages
    .filter((message) => typeof message === "string")
    .map((message) => message.trim())
    .filter(Boolean)
    .join(" ");
};

const createDepartmentApiError = (payload) => {
  const backendMessage = getBackendErrorMessage(payload);
  const error = new Error(backendMessage || "Department request failed.");
  error.name = "DepartmentApiError";
  error.backendMessage = backendMessage;
  return error;
};

export const departmentApi = {
  searchMembers: async (demoId, searchQuery, options = {}) => {
    const normalizedQuery = String(searchQuery ?? "").trim();

    if (!normalizedQuery) {
      return [];
    }

    if (!demoId) {
      throw new Error("Demo ID is required to search members.");
    }

    try {
      const response = await apiFetch(
        `/members?search=${encodeURIComponent(normalizedQuery)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-client-type": "web",
            "x-demo-id": demoId,
          },
          signal: options.signal,
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw createDepartmentApiError(data);
      }

      return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("API Error during member search:", error);
      }
      throw error;
    }
  },

  createDepartment: async (demoId, departmentPayload) => {
    try {
      const response = await apiFetch(`/departments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
          "x-demo-id": demoId,
        },
        body: JSON.stringify(departmentPayload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw createDepartmentApiError(data);
      }
      return data;
    } catch (error) {
      console.error("API Error during department creation:", error);
      throw error;
    }
  },

  getDepartments: async (demoId) => {
    try {
      const response = await apiFetch(`/departments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
          "x-demo-id": demoId,
        },
      });

      const data = await response.json();
      if (!response.ok || data.success === false)
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

  deleteDepartment: async (demoId, departmentId) => {
    try {
      const response = await apiFetch(`/departments/${departmentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
          "x-demo-id": demoId,
        },
      });

      const data = await response.json();
      if (!response.ok || data.success === false)
        throw new Error(data.message || "Failed to delete department");

      return data;
    } catch (error) {
      console.error("API Error during department deletion:", error);
      throw error;
    }
  },
};
