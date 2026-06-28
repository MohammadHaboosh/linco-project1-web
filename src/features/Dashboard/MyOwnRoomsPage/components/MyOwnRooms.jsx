import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoomsListLayout from "../../../../components/layouts/RoomList/RoomListLayout.jsx";
import { fetchDemos } from "../../api/roomsApi.js";
import { useTranslation } from "react-i18next";

const MyOwnRooms = () => {
  const navigate = useNavigate();
  const [ownedRooms, setOwnedRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadOwnedRooms = async () => {
      try {
        setIsLoading(true);
        const json = await fetchDemos();

        if (json.success && json.data) {
          const mappedRooms = json.data.map((room) => ({
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
        setIsLoading(false);
      }
    };

    loadOwnedRooms();
  }, []);

  if (isLoading) {
    // Replace with a proper loader if you have one
    return <div>Loading...</div>;
  }

  return (
    <RoomsListLayout
      title={t("my-owned-rooms")}
      statsTitle={t("total-owned-rooms")}
      rooms={ownedRooms}
      bannerImage="/images/joined-rooms.png"
      onBackClick={() => navigate(-1)}
      emptyMessage={t("no-owned-rooms-yet")}
      emptySubtext={t(
        "you-havent-created-any-training-rooms-yet-once-you-create-them-they-will-appear-here",
      )}
    />
  );
};

export default MyOwnRooms;
