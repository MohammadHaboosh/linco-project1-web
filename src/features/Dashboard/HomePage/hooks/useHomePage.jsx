// src/features/home/hooks/useHomePage.js (Adjust path according to your structure)
import { useState, useEffect } from "react";
import { fetchDemos } from "../../api/roomsApi.js";

export const useHomePage = () => {
  const [ownedRooms, setOwnedRooms] = useState([]);
  const [isLoadingOwnedRooms, setIsLoadingOwnedRooms] = useState(true);

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

  useEffect(() => {
    const loadOwnedRooms = async () => {
      try {
        setIsLoadingOwnedRooms(true);
        const json = await fetchDemos();

        if (json.success && json.data) {
          const mappedRooms = json.data.slice(0, 2).map((room) => ({
            id: room.id,
            companyName: room.name,
            role: "Owner",
            dateJoined: new Date(room.createdAt).toLocaleDateString("en-GB"),
            members: 0,
          }));

          setOwnedRooms(mappedRooms);
        }
      } catch (error) {
        console.error("Error fetching owned rooms:", error);
      } finally {
        setIsLoadingOwnedRooms(false);
      }
    };

    loadOwnedRooms();
  }, []);

  return {
    ownedRooms,
    isLoadingOwnedRooms,
    activeRooms,
    workedRooms,
  };
};
