import { useState } from "react";
import {
  IoAddOutline,
  IoSearchOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import GroupCard from "./GroupCard";
import CreateGroupModal from "./CreateGroupModal";
import styles from "./Groups.module.css";
import { useGroups } from "../hooks/useGroups";

const GroupsContent = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { groups, isLoading, error, createGroup, isCreating } = useGroups();

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.pageHeader}>
          <div className={styles.headerInfo}>
            <div className={styles.iconBox}>
              <IoPeopleOutline />
            </div>
            <div>
              <span className={styles.eyebrow}>
                {t("collaboration", "Collaboration")}
              </span>
              <h1 className={styles.title}>
                {t("learning-groups", "Learning Groups")}
              </h1>
              <p className={styles.description}>
                {t(
                  "join-groups-desc",
                  "Join communities, share knowledge, and learn together with your peers.",
                )}
              </p>
            </div>
          </div>

          <button
            className={styles.createBtn}
            onClick={() => setIsCreateModalOpen(true)}
          >
            <IoAddOutline /> {t("create-group", "Create Group")}
          </button>
        </header>

        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <IoSearchOutline className={styles.searchIcon} />
            <input
              type="text"
              placeholder={t("search-groups", "Search groups by name...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "60px 0",
              color: "var(--app-muted)",
            }}
          >
            <p>{t("loading-groups", "Loading groups...")}</p>
          </div>
        ) : error ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--app-danger-text)",
            }}
          >
            <p>{error}</p>
          </div>
        ) : (
          <div className={styles.groupsGrid}>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))
            ) : (
              <p
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  color: "var(--app-muted)",
                  padding: "40px",
                }}
              >
                {searchQuery
                  ? t("no-groups-match", "No groups match your search.")
                  : t(
                      "no-groups-yet",
                      "No groups available. Create one to get started!",
                    )}
              </p>
            )}
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateGroupModal
          onClose={() => setIsCreateModalOpen(false)}
          createGroup={createGroup}
          isCreating={isCreating}
        />
      )}
    </div>
  );
};

export default GroupsContent;
