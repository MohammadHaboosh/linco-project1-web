import { apiFetch } from "../../../../api/apiFetch";

export const departmentMemberApi = {
  searchDemoMembers: async (demoId, searchQuery, options = {}) => {
    const normalizedQuery = String(searchQuery ?? "").trim();

    if (!normalizedQuery) {
      return { data: [], meta: null };
    }

    if (!demoId) {
      throw new Error("Demo ID is required to search members.");
    }

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

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok || responseData.success === false) {
      throw new Error(responseData.message || "Failed to search members.");
    }

    return {
      data: Array.isArray(responseData.data) ? responseData.data : [],
      meta: responseData.meta ?? null,
    };
  },

  addMember: async ({ demoId, departmentId, demoMemberId, jobTitle }) => {
    if (!demoId) {
      throw new Error("Demo ID is required to add a department member.");
    }

    if (!departmentId) {
      throw new Error("Department ID is required to add a member.");
    }

    if (!demoMemberId) {
      throw new Error("A demo member must be selected.");
    }

    const normalizedJobTitle = String(jobTitle ?? "")
      .trim()
      .toUpperCase();
    const allowedJobTitles = ["INTERN", "JUNIOR", "SENIOR"];

    if (!allowedJobTitles.includes(normalizedJobTitle)) {
      throw new Error("A valid job title is required.");
    }

    const response = await apiFetch("/departmentMembers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-type": "web",
        "x-demo-id": demoId,
        "x-department-id": departmentId,
      },
      body: JSON.stringify({
        demoMemberId,
        jobTitle: normalizedJobTitle,
      }),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok || responseData.success === false) {
      throw new Error(
        responseData.message || "Failed to add the department member.",
      );
    }

    return responseData;
  },

  getMembers: async (departmentId, demoId, options = {}) => {
    if (!departmentId) {
      throw new Error("Department ID is required to fetch members.");
    }

    const response = await apiFetch(`/departmentMembers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-client-type": "web",
        "x-demo-id": demoId,
        "x-department-id": departmentId,
      },
      signal: options.signal,
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok || responseData.success === false) {
      throw new Error(
        responseData.message || "Failed to fetch department members.",
      );
    }

    return responseData;
  },
};
