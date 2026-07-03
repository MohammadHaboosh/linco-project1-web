import { useState } from "react";
import {
  IoPeopleOutline,
  IoSearchOutline,
  IoAddOutline,
  IoFilterOutline,
} from "react-icons/io5";
import MembersTable from "../MembersTable/MembersTable";
import InviteModal from "../InviteModal/InviteModal";
import styles from "./MembersContent.module.css";
import { useTranslation } from "react-i18next";

const MOCK_MEMBERS = [
  {
    id: 1,
    name: "Abrar Abo Auad",
    email: "abrar@linco.tech",
    role: "owner",
    status: "Owner",
    joinedAt: "Oct 24, 2025",
    avatar: null,
  },
  {
    id: 2,
    name: "Ahmad Sami",
    email: "ahmad.s@example.com",
    role: "sectionManager",
    status: "Manager",
    joinedAt: "Nov 12, 2025",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 3,
    name: "Lina Hassan",
    email: "lina.h@example.com",
    role: "trainee",
    status: "Senior",
    joinedAt: "Pending",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 4,
    name: "Omar Nabil",
    email: "omar.n@example.com",
    role: "trainee",
    status: "Junior",
    joinedAt: "Jan 05, 2026",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 5,
    name: "Sara Majed",
    email: "sara.m@example.com",
    role: "sectionManager",
    status: "Manager",
    joinedAt: "Feb 20, 2026",
    avatar: "https://i.pravatar.cc/150?img=9",
  },
];

const MembersContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const { t } = useTranslation();

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = (id) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div className={styles.contentArea}>
      <div className={styles.headerWrapper}>
        <div className={styles.headerInfo}>
          <div className={styles.iconContainer}>
            <IoPeopleOutline className={styles.headerIcon} />
          </div>
          <div>
            <span className={styles.subHeading}>
              {t("workspace-management")}
            </span>
            <h1 className={styles.mainHeading}>{t("demo-members")}</h1>
            <p className={styles.description}>
              {t(
                "manage-access-assign-roles-and-invite-new-members-to-your-workspace",
              )}
            </p>
          </div>
        </div>

        <button
          className={styles.inviteBtn}
          onClick={() => setIsInviteModalOpen(true)}
        >
          <IoAddOutline className={styles.btnIcon} />
          {t("invite-members")}
        </button>
      </div>

      <div className={styles.controlsBar}>
        <div className={styles.searchBox}>
          <IoSearchOutline className={styles.searchIcon} />
          <input
            type="text"
            placeholder={t("search-by-name-or-email")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <button className={styles.filterBtn}>
          <IoFilterOutline /> {t("filter")}
        </button>
      </div>

      <div className={styles.tableContainer}>
        <MembersTable members={filteredMembers} onDelete={handleDelete} />
      </div>

      {isInviteModalOpen && (
        <InviteModal onClose={() => setIsInviteModalOpen(false)} />
      )}
    </div>
  );
};

export default MembersContent;
