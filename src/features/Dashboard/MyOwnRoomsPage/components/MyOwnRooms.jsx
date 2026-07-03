import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoBriefcaseOutline,
  IoSearchOutline,
  IoAddOutline,
  IoFolderOpenOutline,
} from "react-icons/io5";
import RoomCard from "../../../../components/elements/RoomCard/RoomCard.jsx";
import { useOwnedRooms } from "../hooks/useOwnedRooms.jsx";
import { PATHS } from "../../../../routes/paths";
import styles from "./MyOwnRooms.module.css";

const MyOwnRooms = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { ownedRooms, isLoading } = useOwnedRooms();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = ownedRooms.filter((room) =>
    room.companyName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.pageHeader}>
          <div className={styles.headerInfo}>
            <div className={styles.iconBox}>
              <IoBriefcaseOutline className={styles.headerIcon} />
            </div>
            <div>
              <span className={styles.subHeading}>{t("administration")}</span>
              <h1 className={styles.title}>{t("my-workspaces")}</h1>
              <p className={styles.description}>
                {t(
                  "manage-the-workspaces-you-own-oversee-your-teams-and-track-your-subscriptions-0",
                )}
              </p>
            </div>
          </div>

          <button
            className={styles.createBtn}
            onClick={() => navigate(PATHS.REQUEST_ROOM)}
          >
            <IoAddOutline className={styles.btnIcon} />
            {t("new-workspace")}
          </button>
        </div>

        <div className={styles.controlsSection}>
          <div className={styles.searchBox}>
            <IoSearchOutline className={styles.searchIcon} />
            <input
              type="text"
              placeholder={t("search-workspaces-by-company-name")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.listSection}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <span className={styles.loader}></span>
              <p>{t("loading-your-rooms")}</p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconBox}>
                <IoFolderOpenOutline />
              </div>
              <h3>
                {searchQuery
                  ? t("no-workspaces-found")
                  : t("no-owned-workspaces-yet")}
              </h3>
              <p>
                {searchQuery
                  ? t("no-companies-found-matching")
                  : t(
                      "you-dont-have-any-active-workspaces-right-now-request-one-to-get-started",
                    )}
              </p>
              {!searchQuery && (
                <button
                  className={styles.outlineBtn}
                  onClick={() => navigate(PATHS.REQUEST_ROOM)}
                >
                  {t("request-a-workspace")}
                </button>
              )}
            </div>
          ) : (
            <div className={styles.cardsGrid}>
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOwnRooms;
