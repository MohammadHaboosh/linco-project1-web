import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import RoomCard from "../../../components/elements/RoomCard/RoomCard.jsx";
import styles from "./SharedRoomsLayout.module.css";
import { useTranslation } from "react-i18next";

const SharedRoomsLayout = ({
  headerIcon,
  subHeading,
  title,
  description,
  searchPlaceholder,
  isLoading,
  roomsData,
  emptyIcon,
  emptyTitle,
  emptyDesc,
  emptyActionBtn,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = roomsData.filter((room) =>
    (room.name || room.companyName)
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.pageHeader}>
          <div className={styles.headerInfo}>
            <div className={styles.iconBox}>{headerIcon}</div>
            <div>
              <span className={styles.subHeading}>{subHeading}</span>
              <h1 className={styles.title}>{title}</h1>
              <p className={styles.description}>{description}</p>
            </div>
          </div>
        </div>

        <div className={styles.controlsSection}>
          <div className={styles.searchBox}>
            <IoSearchOutline className={styles.searchIcon} />
            <input
              type="text"
              placeholder={searchPlaceholder}
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
              <div className={styles.emptyIconBox}>{emptyIcon}</div>
              <h3>{searchQuery ? t("no-results-found") : emptyTitle}</h3>
              <p>
                {searchQuery
                  ? t(
                      "we-couldnt-find-any-workspace-matching-your-search-query",
                    )
                  : emptyDesc}
              </p>
              {!searchQuery && emptyActionBtn && (
                <div className={styles.actionBtnWrapper}>{emptyActionBtn}</div>
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

export default SharedRoomsLayout;
