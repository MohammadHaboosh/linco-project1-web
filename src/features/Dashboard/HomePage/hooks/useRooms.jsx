import { useOwnedRooms } from "./useOwnedRooms.jsx";
import { useJoinedRooms } from "./useJoinedRooms.jsx"; 

export const useHomePage = () => {
  const { ownedRooms: allOwnedRooms, isLoading: isLoadingOwnedRooms } =
    useOwnedRooms();
  const { joinedRooms: allJoinedRooms, isLoading: isLoadingJoinedRooms } =
    useJoinedRooms();

  const ownedRooms = allOwnedRooms.slice(0, 2);
  const activeRooms = allJoinedRooms.slice(0, 2);

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
    ownedRooms,
    isLoadingOwnedRooms,
    activeRooms,
    isLoadingJoinedRooms, 
    workedRooms,
  };
};
