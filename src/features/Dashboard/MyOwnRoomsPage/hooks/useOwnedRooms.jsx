import { useState, useEffect } from "react";
import { fetchDemos } from "../api/roomsApi.js"; 

export const useOwnedRooms = () => {
  const [ownedRooms, setOwnedRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOwnedRooms = async () => {
      try {
        setIsLoading(true);
        const json = await fetchDemos();

        if (json.success && json.data) {
          const mappedRooms = json.data
            .filter((room) => room.isOwner === true)
            .map((room) => ({
              ...room,
              id: room.id,
              companyName: room.name,
              role: "Owner",
              dateJoined: new Date(room.createdAt).toLocaleDateString("en-GB"),
              members: room.membersCount ?? 0,
            }));

          setOwnedRooms(mappedRooms);
        }
      } catch (err) {
        console.error("Error fetching owned rooms:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOwnedRooms();
  }, []);

  return { ownedRooms, isLoading, error };
};
