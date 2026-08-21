import { useOwnedRooms } from "../../MyOwnRoomsPage/hooks/useOwnedRooms";
import { usePendingInvitations } from "../../PendingInvitationsPage/hooks/usePendingInvitations.jsx";
import { useJoinedRooms } from "./useJoinedRooms.jsx";

export const useHomePage = () => {
  const {
    ownedRooms,
    isLoading: isLoadingOwnedRooms,
    error: ownedRoomsError,
  } = useOwnedRooms();
  const {
    joinedRooms,
    isLoading: isLoadingJoinedRooms,
    error: joinedRoomsError,
  } = useJoinedRooms();
  const {
    invitations,
    isLoading: isLoadingInvitations,
    error: invitationsError,
    acceptInvitation,
    rejectInvitation,
    processingInvitationId,
    processingAction,
    actionError: invitationActionError,
  } = usePendingInvitations();

  const previewOwnedRooms = ownedRooms.slice(0, 2);
  const previewJoinedRooms = joinedRooms.slice(0, 2);
  const previewInvitations = invitations.slice(0, 3);

  const workedRooms = [
    {
      id: 1,
      companyName: "Company Demo Name",
      role: "Member",
      dateJoined: "12/12/2025",
      members: 120,
    },
  ];

  return {
    ownedRooms: previewOwnedRooms,
    isLoadingOwnedRooms,
    ownedRoomsError,
    activeRooms: previewJoinedRooms,
    isLoadingJoinedRooms,
    joinedRoomsError,
    pendingInvitations: previewInvitations,
    isLoadingInvitations,
    invitationsError,
    acceptInvitation,
    rejectInvitation,
    processingInvitationId,
    processingAction,
    invitationActionError,
    workedRooms,
  };
};
