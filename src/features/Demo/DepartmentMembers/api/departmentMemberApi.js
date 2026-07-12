import { apiFetch } from "../../../../api/apiFetch";

export const departmentMemberApi = {
  getMembers: async (departmentId, options = {}) => {
    if (!departmentId) {
      throw new Error("Department ID is required to fetch members.");
    }

    const response = await apiFetch(
      `/departments/${encodeURIComponent(departmentId)}/members`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
        },
        signal: options.signal,
      },
    );

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok || responseData.success === false) {
      throw new Error(
        responseData.message || "Failed to fetch department members.",
      );
    }

    return responseData;
  },
};
