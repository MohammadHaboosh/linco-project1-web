import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoEnterOutline,
  IoCompassOutline,
  IoFolderOpenOutline,
} from "react-icons/io5";
import SharedRoomsLayout from "../../components/SharedRoomsLayout";
import { PATHS } from "../../../../routes/paths";

const JoinedRooms = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [joinedRooms, setJoinedRooms] = useState([]);

  const CheckInvitationsBtn = (
    <button
      onClick={() => navigate(PATHS.PENDING_INVITATIONS)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "transparent",
        color: "#1a56db",
        border: "2px solid #1a56db",
        padding: "12px 24px",
        borderRadius: "12px",
        fontWeight: "700",
        cursor: "pointer",
        fontSize: "0.95rem",
      }}
    >
      <IoCompassOutline size={20} />
      {t("view-pending-invitations", "Check Invitations")}
    </button>
  );

  return (
    <SharedRoomsLayout
      headerIcon={<IoEnterOutline />}
      subHeading={t("collaboration")}
      title={t("joined-training-rooms")}
      description={t(
        "access-training-spaces-you-have-been-invited-to-and-collaborate-with-your-teams",
      )}
      searchPlaceholder={t("search-room-by-name")}
      isLoading={isLoading}
      roomsData={joinedRooms}
      emptyIcon={<IoFolderOpenOutline />}
      emptyTitle={t("no-joined-rooms-yet")}
      emptyDesc={t(
        "you-havent-joined-any-workspace-yet-check-your-pending-invitations",
      )}
      emptyActionBtn={CheckInvitationsBtn}
    />
  );
};

export default JoinedRooms;
