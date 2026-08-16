import { useTranslation } from "react-i18next";
import { IoFolderOpenOutline, IoBusinessOutline } from "react-icons/io5";
import { useOwnedRooms } from "../hooks/useOwnedRooms.jsx";
import SharedRoomsLayout from "../../components/SharedRoomsLayout";

const MyOwnRooms = () => {
  const { t } = useTranslation();
  const { ownedRooms, isLoading, error } = useOwnedRooms();

  return (
    <SharedRoomsLayout
      headerIcon={<IoFolderOpenOutline />}
      subHeading={t("management")}
      title={t("owned-workspaces")}
      description={t(
        "create-and-manage-your-owned-workspaces-invite-team-members-and-monitor-overall-progress",
      )}
      searchPlaceholder={t("search-workspaces-by-name")}
      isLoading={isLoading}
      error={error}
      roomsData={ownedRooms}
      emptyIcon={<IoBusinessOutline />}
      emptyTitle={t("no-owned-workspaces-yet")}
      emptyDesc={t("no-owned-workspaces-description")}
    />
  );
};

export default MyOwnRooms;
