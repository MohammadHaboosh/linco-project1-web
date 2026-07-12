import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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
import { useMembers } from "../../hooks/useMembers";

const MembersContent = () => {
  const { demoId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { t } = useTranslation();
  const {
    members,
    isLoading,
    error,
    deleteMember,
    deletingMemberId,
    deleteError,
  } = useMembers(demoId);

  const filteredMembers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) return members;

    return members.filter((member) => {
      const { firstName = "", lastName = "", email = "" } =
        member.user ?? {};
      const searchableText = `${firstName} ${lastName} ${email}`.toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [members, searchQuery]);

  const handleDeleteMember = async (memberId) => {
    const shouldDelete = window.confirm(
      t(
        "remove-member-confirmation",
        "Are you sure you want to remove this member from the workspace?",
      ),
    );

    if (!shouldDelete) return;

    await deleteMember(memberId);
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
        <MembersTable
          members={filteredMembers}
          isLoading={isLoading}
          error={error}
          deletingMemberId={deletingMemberId}
          deleteError={deleteError}
          onDelete={handleDeleteMember}
        />
      </div>

      {isInviteModalOpen && (
        <InviteModal onClose={() => setIsInviteModalOpen(false)} />
      )}
    </div>
  );
};

export default MembersContent;
