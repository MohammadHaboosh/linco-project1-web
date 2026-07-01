import { useOwnedRooms } from "../../MyOwnRoomsPage/hooks/useOwnedRooms";

export const useHomePage = () => {
  const { ownedRooms, isLoading: isLoadingOwnedRooms } = useOwnedRooms();
  const previewOwnedRooms = ownedRooms.slice(0, 2);

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
    ownedRooms: previewOwnedRooms, 
    isLoadingOwnedRooms,
    activeRooms,
    workedRooms,
  };
};