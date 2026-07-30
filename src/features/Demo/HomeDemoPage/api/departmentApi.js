import { apiFetch } from "../../../../api/apiFetch";

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
      const usersResponse = await apiFetch(
        `/users/cursor?search=${encodeURIComponent(normalizedQuery)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-client-type": "web",
          },
          signal: options.signal,
        },
      );

      const usersData = await usersResponse.json().catch(() => ({}));

      if (!usersResponse.ok || usersData.success === false) {
        throw new Error(usersData.message || "Failed to search users.");
      }

      const matchingUserIds = new Set(
        (Array.isArray(usersData.data) ? usersData.data : [])
          .map((user) => user?.id)
          .filter(Boolean),
      );

      if (matchingUserIds.size === 0) {
        return [];
      }

      const matchingMembers = [];
      let cursor = null;
      let hasNextPage = true;

      while (hasNextPage) {
        const query = new URLSearchParams({ take: "50" });

        if (cursor) {
          query.set("cursor", cursor);
        }

        const membersResponse = await apiFetch(`/members?${query.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-client-type": "web",
            "x-demo-id": demoId,
          },
          signal: options.signal,
        });
        const membersData = await membersResponse.json().catch(() => ({}));

        if (!membersResponse.ok || membersData.success === false) {
          throw new Error(
            membersData.message || "Failed to load demo members.",
          );
        }

        const members = Array.isArray(membersData.data)
          ? membersData.data
          : [];

        matchingMembers.push(
          ...members.filter((member) =>
            matchingUserIds.has(member?.userId ?? member?.user?.id),
          ),
        );

        cursor = membersData.meta?.endCursor ?? null;
        hasNextPage = Boolean(membersData.meta?.hasNextPage && cursor);
      }

      return matchingMembers;
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("API Error during member search:", error);
      }
      throw error;
    }
  },

  createDepartment: async (demoId, departmentPayload) => {
    try {
      console.log(departmentPayload);
      console.log(JSON.stringify(departmentPayload));
      const response = await apiFetch(`/departments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
          "x-demo-id": demoId,
        },
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
      const response = await apiFetch(`/departments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
          "x-demo-id": demoId,
        },
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
      if (!response.ok)
        throw new Error(data.message || "Failed to delete department");

      return data;
    } catch (error) {
      console.error("API Error during department deletion:", error);
      throw error;
    }
  },
};
