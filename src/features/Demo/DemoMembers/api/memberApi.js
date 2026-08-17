import { apiFetch } from "../../../../api/apiFetch";

export const memberApi = {
  searchUsers: async (searchQuery, options = {}) => {
    const normalizedQuery = String(searchQuery ?? "").trim();

    if (!normalizedQuery) {
      return { data: [], meta: null };
    }

    const response = await apiFetch(
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

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok || responseData.success === false) {
      throw new Error(responseData.message || "Failed to search users.");
    }

    return {
      data: Array.isArray(responseData.data) ? responseData.data : [],
      meta: responseData.meta ?? null,
    };
  },

  inviteMember: async ({ receiverId, demoId, role }) => {
    if (!receiverId) {
      throw new Error("A user must be selected before sending an invitation.");
    }

    if (!demoId) {
      throw new Error("Demo ID is required to send an invitation.");
    }

    const normalizedRole = String(role ?? "")
      .trim()
      .toUpperCase();
    const allowedRoles = ["MEMBER", "ADMIN", "OWNER"];

    if (!allowedRoles.includes(normalizedRole)) {
      throw new Error("A valid invitation role is required.");
    }

    const response = await apiFetch("/invitations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-type": "web",
        "x-demo-id": demoId,
      },
      body: JSON.stringify({
        receiverId,
        demoId,
        role: normalizedRole,
      }),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok || responseData.success === false) {
      throw new Error(responseData.message || "Failed to send invitation.");
    }

    return responseData;
  },

  getMembers: async (demoId, options = {}) => {
    if (!demoId) {
      throw new Error("Demo ID is required to fetch members.");
    }

    const response = await apiFetch(`/members`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-client-type": "web",
        "x-demo-id": demoId,
      },
      signal: options.signal,
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok || responseData.success === false) {
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
      `/members/${encodeURIComponent(memberId)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
          "x-demo-id": demoId,
        },
      },
    );

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok || responseData.success === false) {
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

    const normalizedRole = String(role ?? "")
      .trim()
      .toUpperCase();
    const allowedRoles = ["OWNER", "ADMIN", "MEMBER"];

    if (!allowedRoles.includes(normalizedRole)) {
      throw new Error("A valid member role is required.");
    }

    const response = await apiFetch(
      `/members/${encodeURIComponent(memberId)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
          "x-demo-id": demoId,
        },
        body: JSON.stringify({ role: normalizedRole }),
      },
    );

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok || responseData.success === false) {
      throw new Error(responseData.message || "Failed to update member role.");
    }

    return responseData;
  },
};
