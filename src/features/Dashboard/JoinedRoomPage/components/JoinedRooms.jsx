import { useNavigate } from "react-router-dom";
import RoomsListLayout from "../../../../components/layouts/RoomList/RoomListLayout.jsx";
import { useTranslation } from "react-i18next";
import { useJoinedRooms } from "../hooks/useJoinedRooms.jsx";

const JoinedRoomsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Consume the hook
  const { joinedRooms, isLoading } = useJoinedRooms();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <RoomsListLayout
      title={t("joined-training-rooms")}
      statsTitle={t("number-of-training-companies")}
      rooms={joinedRooms}
      bannerImage="/images/joined-rooms.png"
      onBackClick={() => navigate(-1)}
      emptyMessage={t("no-joined-rooms-yet")}
      emptySubtext={t(
        "you-havent-joined-any-training-rooms-yet-once-you-join-them-they-will-appear-here",
      )}
    />
  );
};

export default JoinedRoomsPage;
