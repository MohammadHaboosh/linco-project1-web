import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IoPeopleOutline,
  IoTrashOutline,
  IoPersonAddOutline,
} from "react-icons/io5";
import { useDepartmentMembers } from "../../DepartmentMembers/hooks/useDepartmentMembers";
import { departmentMemberApi } from "../../DepartmentMembers/api/departmentMemberApi";
import AddGroupMemberModal from "./AddGroupMemberModal";
import styles from "./Groups.module.css";

const GroupMembersPanel = ({ demoId, groupId, isManager, currentUserId }) => {
  const { t } = useTranslation();
  const { members, isLoading, refetch } = useDepartmentMembers(groupId);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemoveMember = async (memberId) => {
    if (
      !window.confirm(
        t(
          "confirm-remove-member",
          "Are you sure you want to remove this member?",
        ),
      )
    )
      return;
    setIsDeleting(true);
    try {
      await departmentMemberApi.deleteMember(demoId, memberId);
      await refetch();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingPanel}>{t("loading", "Loading...")}</div>
    );
  }

  return (
    <div className={styles.panelContainer}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>
          <IoPeopleOutline /> {t("group-members", "Group Members")} (
          {members.length})
        </h2>
        {isManager && (
          <button
            type="button"
            onClick={() => setIsAddMemberOpen(true)}
            className={styles.addMemberBtn}
            aria-label={t("add-members", "Add Members")}
          >
            <IoPersonAddOutline />
            <span className={styles.addMemberLabel}>
              {t("add-members", "Add Members")}
            </span>
          </button>
        )}
      </div>

      <div className={styles.membersGrid}>
        {members.length === 0 && (
          <div className={styles.membersEmptyState}>
            <IoPeopleOutline aria-hidden="true" />
            <strong>{t("no-group-members", "No group members yet")}</strong>
            <span>
              {t(
                "no-group-members-description",
                "Add members to start collaborating in this demo.",
              )}
            </span>
          </div>
        )}
        {members.map((member) => {
          const user = member.demoMember?.user || {};
          const isCurrentUser = user.id === currentUserId;

          const fullName =
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.email;
          const initials = fullName.substring(0, 2).toUpperCase();

          return (
            <div key={member.id} className={styles.memberCard}>
              <div className={styles.memberIdentity}>
                <div className={styles.memberAvatarBox}>
                  {user.imagePath ? (
                    <img
                      src={user.imagePath}
                      alt={fullName}
                      className={styles.avatarImg}
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                <div className={styles.memberDetails}>
                  <strong className={styles.memberName}>
                    {fullName}
                    {isCurrentUser && (
                      <span
                        style={{
                          color: "var(--app-link)",
                          fontSize: "0.8rem",
                          marginInlineStart: "4px",
                        }}
                      >
                        ({t("you", "you")})
                      </span>
                    )}
                  </strong>
                  <span className={styles.memberEmail}>{user.email}</span>
                </div>
              </div>

              {isManager && !isCurrentUser && (
                <button
                  type="button"
                  onClick={() => handleRemoveMember(member.id)}
                  disabled={isDeleting}
                  className={styles.removeBtn}
                  title={t("remove", "Remove")}
                  aria-label={t("remove-member-name", {
                    defaultValue: "Remove {{name}}",
                    name: fullName,
                  })}
                >
                  <IoTrashOutline />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isAddMemberOpen && (
        <AddGroupMemberModal
          demoId={demoId}
          groupId={groupId}
          onClose={() => setIsAddMemberOpen(false)}
          onSuccess={async () => {
            await refetch();
            setIsAddMemberOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default GroupMembersPanel;
