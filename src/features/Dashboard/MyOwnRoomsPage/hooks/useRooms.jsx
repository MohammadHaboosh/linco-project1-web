import { useOwnedRooms } from "./useOwnedRooms.jsx"; 

export const useHomePage = () => {
  const { ownedRooms: allOwnedRooms, isLoading: isLoadingOwnedRooms } =
    useOwnedRooms();

  const ownedRooms = allOwnedRooms.slice(0, 2);

  const activeRooms = [
    {
      id: 1,
      companyName: "Company Demo Name",
      role: "Trainee",
      dateJoined: "12/12/2025",
      members: 120,
    },
  ];

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
    workedRooms,
  };
};
