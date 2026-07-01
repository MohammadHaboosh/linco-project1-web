import { useState, useEffect } from "react";
import { fetchDemos } from "../../api/roomsApi.js";

export const useJoinedRooms = () => {
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadJoinedRooms = async () => {
      try {
        setIsLoading(true);
        const json = await fetchDemos();

        if (json.success && json.data) {
          const mappedRooms = json.data
            .filter((room) => !room.isOwner)
            .map((room) => ({
              id: room.id,
              companyName: room.name,
              // Defaulting to Trainee as seen in your previous mock data
              role: room.role || "Trainee", 
              dateJoined: new Date(room.createdAt).toLocaleDateString("en-GB"),
              members: room.membersCount || 0,
            }));

          setJoinedRooms(mappedRooms);
        }
      } catch (err) {
        console.error("Error fetching recently active rooms:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadJoinedRooms();
  }, []);

  return { joinedRooms, isLoading, error };
};