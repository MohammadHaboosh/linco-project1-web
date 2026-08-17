import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  IoAddOutline,
  IoSearchOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import GroupCard from "./GroupCard";
import CreateGroupModal from "./CreateGroupModal";
import styles from "./Groups.module.css";

import { useFetchGroups } from "../hooks/useFetchGroups";
import { useUser } from "../../../../hooks/useUser";
import { memberApi } from "../../DemoMembers/api/memberApi";
import { useDeleteDepartment } from "../../HomeDemoPage/hooks/useDeleteDepartment";

const GroupsContent = () => {
  const { t } = useTranslation();
  const { demoId } = useParams();
  const { profile } = useUser();
  const userId = profile?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState(null);

  const { groups, isLoading, error, refetch } = useFetchGroups(demoId);

  const { deleteDepartment, isDeleting } = useDeleteDepartment(demoId, () => {
    refetch();
  });

  useEffect(() => {
    if (!demoId || !userId) return;
    let isMounted = true;

    const fetchCurrentMemberId = async () => {
      try {
        const response = await memberApi.getMembers(demoId);
        if (isMounted && response?.data) {
          const myMemberRecord = response.data.find(
            (member) => member.user?.id === userId,
          );
          if (myMemberRecord) {
            setCurrentMemberId(myMemberRecord.id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch demo members for ID matching:", error);
      }
    };

    fetchCurrentMemberId();
    return () => {
      isMounted = false;
    };
  }, [demoId, userId]);

  const filteredGroups = groups.filter((group) => {
    const groupName = group.title || group.name || "";
    return groupName.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
                <GroupCard
                  key={group.id}
                  group={group}
                  isManager={group.managerId === currentMemberId}
                  onDelete={() => deleteDepartment(group.id)}
                  isDeleting={isDeleting}
                />
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
          demoId={demoId}
          currentUserId={currentMemberId}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
};

export default GroupsContent;
