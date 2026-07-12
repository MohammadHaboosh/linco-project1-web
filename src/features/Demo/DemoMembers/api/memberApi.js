import { apiFetch } from "../../../../api/apiFetch";

export const memberApi = {
  getMembers: async (demoId, options = {}) => {
    if (!demoId) {
      throw new Error("Demo ID is required to fetch members.");
    }

    const response = await apiFetch(
      `/demos/${encodeURIComponent(demoId)}/members`,
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

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch demo members.");
    }

    return responseData;
  },

  deleteMember: async (demoId, memberId) => {
    if (!demoId) {
      throw new Error("Demo ID is required to delete a member.");
    }

    if (!memberId) {
      throw new Error("Member ID is required to delete a member.");
    }

    const response = await apiFetch(
      `/demos/${encodeURIComponent(demoId)}/members/${encodeURIComponent(memberId)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
        },
      },
    );

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to delete demo member.");
    }

    return responseData;
  },

  updateMemberRole: async (demoId, memberId, role) => {
    if (!demoId) {
      throw new Error("Demo ID is required to update a member role.");
    }

    if (!memberId) {
      throw new Error("Member ID is required to update a member role.");
    }

    const normalizedRole = String(role ?? "").trim().toUpperCase();
    const allowedRoles = ["OWNER", "TRAINER", "MANAGER"];

    if (!allowedRoles.includes(normalizedRole)) {
      throw new Error("A valid member role is required.");
    }

    const response = await apiFetch(
      `/demos/${encodeURIComponent(demoId)}/members/${encodeURIComponent(memberId)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
        },
        body: JSON.stringify({ role: normalizedRole }),
      },
    );

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to update member role.");
    }

    return responseData;
  },
};
