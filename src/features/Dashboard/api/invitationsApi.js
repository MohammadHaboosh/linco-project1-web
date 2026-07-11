const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchPendingInvitations = async () => {
  const response = await fetch(`${BASE_URL}/invitations/cursor`);

  if (!response.ok) {
    throw new Error("Failed to fetch pending invitations");
  }

  return response.json();
};

const updateInvitationStatus = async (invitationId, action) => {
  const response = await fetch(
    `${BASE_URL}/invitations/${encodeURIComponent(invitationId)}/${action}`,
    { method: "POST" },
  );
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `Failed to ${action} invitation`);
  }

  return data;
};

export const acceptInvitation = (invitationId) =>
  updateInvitationStatus(invitationId, "accept");

export const rejectInvitation = (invitationId) =>
  updateInvitationStatus(invitationId, "reject");
