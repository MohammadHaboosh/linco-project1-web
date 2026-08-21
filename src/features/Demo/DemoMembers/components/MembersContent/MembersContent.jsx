import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IoCheckmarkCircleOutline,
  IoCloseOutline,
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
import { useAppAlert } from "../../../../../components/common/AppAlerts/useAppAlert";

const MembersContent = () => {
  const { demoId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [invitationSuccessMessage, setInvitationSuccessMessage] =
    useState(null);
  const { t } = useTranslation();
  const { confirmAction } = useAppAlert();
  const {
    members,
    isLoading,
    error,
    refetch,
    deleteMember,
    deletingMemberId,
    deleteError,
  } = useMembers(demoId);

  useEffect(() => {
    if (!invitationSuccessMessage) return undefined;

    const dismissTimer = setTimeout(() => {
      setInvitationSuccessMessage(null);
    }, 5000);

    return () => clearTimeout(dismissTimer);
  }, [invitationSuccessMessage]);

  const handleInvitationSuccess = useCallback(
    () => {
      setInvitationSuccessMessage(t("workspace-invitation-created"));
      setIsInviteModalOpen(false);
    },
    [t],
  );

  const filteredMembers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return members.filter((member) => {
      const { firstName = "", lastName = "", email = "" } = member.user ?? {};
      const searchableText = `${firstName} ${lastName} ${email}`.toLowerCase();

      const normalizedRole = String(member.role ?? "").toUpperCase();
      const matchesRole =
        roleFilter === "ALL" ||
        (roleFilter === "OWNER" && normalizedRole === "OWNER") ||
        (roleFilter === "MEMBER" && normalizedRole !== "OWNER");

      const matchesSearch =
        !normalizedQuery || searchableText.includes(normalizedQuery);

      return matchesSearch && matchesRole;
    });
  }, [members, roleFilter, searchQuery]);

  const handleDeleteMember = async (memberId) => {
    const shouldDelete = await confirmAction({
      message: t("remove-member-confirmation"),
      confirmLabel: t("remove"),
      tone: "danger",
    });

    if (!shouldDelete) return;

    await deleteMember(memberId);
  };

  return (
    <div className={styles.contentArea}>
      {invitationSuccessMessage && (
        <div className={styles.successToast} role="status" aria-live="polite">
          <IoCheckmarkCircleOutline className={styles.successToastIcon} />
          <div className={styles.successToastContent}>
            <strong>{t("invitation-sent")}</strong>
            <span>{invitationSuccessMessage}</span>
          </div>
          <button
            type="button"
            className={styles.successToastClose}
            onClick={() => setInvitationSuccessMessage(null)}
            aria-label={t("dismiss-invitation-success")}
          >
            <IoCloseOutline />
          </button>
        </div>
      )}

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
          type="button"
          className={styles.inviteBtn}
          onClick={() => {
            setInvitationSuccessMessage(null);
            setIsInviteModalOpen(true);
          }}
        >
          <IoAddOutline className={styles.btnIcon} />
          {t("invite-members")}
        </button>
      </div>

      <div className={styles.controlsBar}>
        <div className={styles.searchBox}>
          <IoSearchOutline className={styles.searchIcon} />
          <input
            type="search"
            placeholder={t("search-by-name-or-email")}
            aria-label={t("search-workspace-members")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <label className={styles.filterControl}>
          <span className={styles.visuallyHidden}>
            {t("filter-members-by-role")}
          </span>
          <IoFilterOutline aria-hidden="true" />
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            aria-label={t("filter-members-by-role")}
          >
            <option value="ALL">{t("all-roles")}</option>
            <option value="OWNER">{t("owner")}</option>
            <option value="MEMBER">{t("member")}</option>
          </select>
        </label>
      </div>

      <div className={styles.tableContainer}>
        <MembersTable
          members={filteredMembers}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          deletingMemberId={deletingMemberId}
          deleteError={deleteError}
          onDelete={handleDeleteMember}
        />
      </div>

      {isInviteModalOpen && (
        <InviteModal
          demoId={demoId}
          onClose={() => setIsInviteModalOpen(false)}
          onSuccess={handleInvitationSuccess}
        />
      )}
    </div>
  );
};

export default MembersContent;
