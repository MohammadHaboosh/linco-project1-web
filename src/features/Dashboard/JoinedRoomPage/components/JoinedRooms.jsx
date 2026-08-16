import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoEnterOutline,
  IoCompassOutline,
  IoFolderOpenOutline,
} from "react-icons/io5";
import SharedRoomsLayout from "../../components/SharedRoomsLayout";
import { PATHS } from "../../../../routes/paths";
import { useJoinedRooms } from "../hooks/useJoinedRooms.jsx";
import styles from "./JoinedRooms.module.css";

const JoinedRooms = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { joinedRooms, isLoading, error } = useJoinedRooms();

  const CheckInvitationsBtn = (
    <button
      type="button"
      onClick={() => navigate(PATHS.PENDING_INVITATIONS)}
      className={styles.invitationsButton}
    >
      <IoCompassOutline size={20} />
      {t("view-pending-invitations")}
    </button>
  );

  return (
    <SharedRoomsLayout
      headerIcon={<IoEnterOutline />}
      subHeading={t("collaboration")}
      title={t("joined-workspaces")}
      description={t(
        "access-training-spaces-you-have-been-invited-to-and-collaborate-with-your-teams",
      )}
      searchPlaceholder={t("search-workspaces-by-name")}
      isLoading={isLoading}
      error={error}
      roomsData={joinedRooms}
      emptyIcon={<IoFolderOpenOutline />}
      emptyTitle={t("no-joined-workspaces-yet")}
      emptyDesc={t("no-joined-workspaces-description")}
      emptyActionBtn={CheckInvitationsBtn}
    />
  );
};

export default JoinedRooms;
