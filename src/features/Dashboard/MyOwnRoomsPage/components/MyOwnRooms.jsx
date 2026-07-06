import { useState } from "react";
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
      title={t("my-own-rooms")}
      description={t(
        "create-and-manage-your-owned-workspaces-invite-team-members-and-monitor-overall-progress",
      )}
      searchPlaceholder={t("search-by-room-name")}
      isLoading={isLoading}
      roomsData={ownedRooms}
      emptyIcon={<IoBusinessOutline />}
      emptyTitle={t("no-owned-rooms-yet")}
      emptyDesc={t(
        "you-havent-created-any-workspaces-yet-start-by-creating-one-to-manage-your-team",
      )}
    />
  );
};

export default MyOwnRooms;
