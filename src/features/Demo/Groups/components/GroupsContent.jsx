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

const MOCK_GROUPS = [
  {
    id: "g1",
    name: "React Developers",
    description: "Discussing advanced React patterns and hooks.",
    membersCount: 142,
    privacy: "PUBLIC",
  },
  {
    id: "g2",
    name: "UI/UX Masters",
    description: "Design systems, Figma tips, and Vica-style UI.",
    membersCount: 56,
    privacy: "PRIVATE",
  },
  {
    id: "g3",
    name: "Backend Architecture",
    description: "Node.js, microservices, and system design.",
    membersCount: 89,
    privacy: "PUBLIC",
  },
];

const GroupsContent = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredGroups = MOCK_GROUPS.filter((group) =>
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

        <div className={styles.groupsGrid}>
          {filteredGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateGroupModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
};

export default GroupsContent;
