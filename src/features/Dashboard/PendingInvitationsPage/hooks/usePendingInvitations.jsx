import { useEffect, useRef, useState } from "react";
import {
  acceptInvitation as acceptInvitationRequest,
  fetchPendingInvitations,
  rejectInvitation as rejectInvitationRequest,
} from "../../api/invitationsApi.js";

const formatRole = (role) =>
  role
    ? role
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase())
    : "";

const mapInvitation = (invitation) => {
  const senderName = [
    invitation.sender?.firstName,
    invitation.sender?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    ...invitation,
    company: invitation.demo?.name || "",
    caller: senderName || invitation.sender?.email || "",
    role: formatRole(invitation.role),
    time: invitation.createdAt
      ? new Date(invitation.createdAt).toLocaleString()
      : "",
  };
};

export const usePendingInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingInvitationId, setProcessingInvitationId] = useState(null);
  const [processingAction, setProcessingAction] = useState(null);
  const [actionError, setActionError] = useState(null);
  const processingInvitationRef = useRef(null);

  useEffect(() => {
    const loadPendingInvitations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const json = await fetchPendingInvitations();

        if (json.success && Array.isArray(json.data)) {
          setInvitations(
            json.data
              .filter((invitation) => invitation.status === "PENDING")
              .map(mapInvitation),
          );
        } else {
          setInvitations([]);
        }
      } catch (err) {
        console.error("Error fetching pending invitations:", err);
        setError(err);
        setInvitations([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPendingInvitations();
  }, []);

  const updateInvitation = async (invitationId, action, request) => {
    if (processingInvitationRef.current) return;

    processingInvitationRef.current = invitationId;
    setProcessingInvitationId(invitationId);
    setProcessingAction(action);
    setActionError(null);

    try {
      await request(invitationId);
      setInvitations((currentInvitations) =>
        currentInvitations.filter(
          (invitation) => invitation.id !== invitationId,
        ),
      );
    } catch (err) {
      console.error(`Error ${action}ing invitation:`, err);
      setActionError({ invitationId, message: err.message });
    } finally {
      processingInvitationRef.current = null;
      setProcessingInvitationId(null);
      setProcessingAction(null);
    }
  };

  const acceptInvitation = (invitationId) =>
    updateInvitation(invitationId, "accept", acceptInvitationRequest);

  const rejectInvitation = (invitationId) =>
    updateInvitation(invitationId, "reject", rejectInvitationRequest);

  return {
    invitations,
    isLoading,
    error,
    acceptInvitation,
    rejectInvitation,
    processingInvitationId,
    processingAction,
    actionError,
  };
};
