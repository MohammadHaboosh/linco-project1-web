import { useOwnedRooms } from "../../MyOwnRoomsPage/hooks/useOwnedRooms";
import { useJoinedRooms } from "./useJoinedRooms.jsx"

export const useHomePage = () => {
  const { ownedRooms, isLoading: isLoadingOwnedRooms } = useOwnedRooms();
  const { joinedRooms, isLoading: isLoadingJoinedRooms } =
    useJoinedRooms();

  const previewOwnedRooms = ownedRooms.slice(0, 2);
  const previewJoinedRooms = joinedRooms.slice(0, 2);

  const workedRooms = [
    {
      id: 1,
      companyName: "Company Demo Name",
      role: "Trainee",
      dateJoined: "12/12/2025",
      members: 120,
    },
  ];

  return {
    ownedRooms: previewOwnedRooms,
    isLoadingOwnedRooms,
    activeRooms: previewJoinedRooms,
    isLoadingJoinedRooms,
    workedRooms,
  };
};
