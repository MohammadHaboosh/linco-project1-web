import { apiFetch } from "../../../api/apiFetch";

export const fetchPendingInvitations = async () => {
  const response = await apiFetch("/invitations/cursor", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Failed to fetch pending invitations");
  }

  return data;
};

const updateInvitationStatus = async (invitationId, action) => {
  const response = await apiFetch(
    `/invitations/${encodeURIComponent(invitationId)}/${action}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const data = await response.json().catch(() => null);

  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || `Failed to ${action} invitation`);
  }

  return data;
};

export const acceptInvitation = (invitationId) =>
  updateInvitationStatus(invitationId, "accept");

export const rejectInvitation = (invitationId) =>
  updateInvitationStatus(invitationId, "reject");
