import { useNavigate } from "react-router-dom";
import RoomsListLayout from "../../../../components/layouts/RoomList/RoomListLayout.jsx";
import { useOwnedRooms } from "../hooks/useOwnedRooms.jsx"; 
import { useTranslation } from "react-i18next";

const MyOwnRooms = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { ownedRooms, isLoading } = useOwnedRooms();

  if (isLoading) {
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
