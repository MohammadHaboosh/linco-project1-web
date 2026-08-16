import {
  IoTrashOutline,
  IoCreateOutline,
  IoShieldCheckmark,
  IoCheckmarkOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { useState } from "react";
import styles from "./MembersTable.module.css";
import { useTranslation } from "react-i18next";

const MembersTable = ({
  members,
  isLoading,
  error,
  deletingMemberId,
  deleteError,
  updatingMemberId,
  updateError,
  onRetry,
  onDelete,
  onUpdateRole,
}) => {
  const { t, i18n } = useTranslation();
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("MEMBER");

  const normalizeRole = (role) =>
    String(role ?? "")
      .trim()
      .replace(/[\s-]+/g, "_")
      .toUpperCase();

  const getRoleBadge = (role) => {
    switch (normalizeRole(role)) {
      case "OWNER":
        return (
          <span className={`${styles.badge} ${styles.badgeOwner}`}>
            <IoShieldCheckmark /> {t("owner")}
          </span>
        );
      case "ADMIN":
      case "MANAGER":
        return (
          <span className={`${styles.badge} ${styles.badgeManager}`}>
            {t("manager")}
          </span>
        );
      case "MEMBER":
        return (
          <span className={`${styles.badge} ${styles.badgeTrainee}`}>
            {t("member")}
          </span>
        );
      default:
        return (
          <span className={`${styles.badge} ${styles.badgeTrainee}`}>
            {t("trainee")}
          </span>
        );
    }
  };

  const formatJoinedAt = (joinedAt) => {
    if (!joinedAt) return t("date-not-available");

    const date = new Date(joinedAt);

    if (Number.isNaN(date.getTime())) return t("date-not-available");

    return new Intl.DateTimeFormat(i18n.resolvedLanguage || i18n.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getEditableRole = (role) => {
    const normalizedRole = normalizeRole(role);

    if (["MANAGER", "ADMIN"].includes(normalizedRole)) {
      return "ADMIN";
    }

    if (normalizedRole === "MEMBER") return "MEMBER";

    return ["OWNER", "ADMIN", "MEMBER"].includes(normalizedRole)
      ? normalizedRole
      : "MEMBER";
  };

  const startEditingRole = (member) => {
    setEditingMemberId(member.id);
    setSelectedRole(getEditableRole(member.role));
  };

  const cancelEditingRole = () => {
    setEditingMemberId(null);
    setSelectedRole("MEMBER");
  };

  const saveRole = async (memberId) => {
    const wasUpdated = await onUpdateRole?.(memberId, selectedRole);

    if (wasUpdated) cancelEditingRole();
  };

  return (
    <div
      className={styles.tableWrapper}
      aria-busy={isLoading}
      aria-live="polite"
    >
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t("member")}</th>
            <th>{t("role")}</th>
            <th>{t("joined")}</th>
            <th className={styles.actionsCol}>{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {(deleteError || updateError) && !isLoading && !error && (
            <tr className={styles.stateRow}>
              <td colSpan="4" className={styles.errorState} role="alert">
                {deleteError || updateError}
              </td>
            </tr>
          )}
          {isLoading ? (
            <tr className={styles.stateRow}>
              <td
                colSpan="4"
                className={styles.emptyState}
                role="status"
              >
                {t("loading-members")}
              </td>
            </tr>
          ) : error ? (
            <tr className={styles.stateRow}>
              <td colSpan="4" className={styles.emptyState} role="alert">
                <span>{error}</span>
                <button
                  type="button"
                  className={styles.retryButton}
                  onClick={onRetry}
                >
                  {t("try-again")}
                </button>
              </td>
            </tr>
          ) : members.length === 0 ? (
            <tr className={styles.stateRow}>
              <td colSpan="4" className={styles.emptyState} role="status">
                {t("no-members-found")}
              </td>
            </tr>
          ) : (
            members.map((member) => {
              const user = member.user ?? {};
              const fullName =
                [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                user.email ||
                t("member");
              const initials =
                `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`.toUpperCase() ||
                fullName.charAt(0).toUpperCase();
              const isOwner = normalizeRole(member.role) === "OWNER";
              const isDeleting = deletingMemberId === member.id;
              const isEditing = editingMemberId === member.id;
              const isUpdating = updatingMemberId === member.id;
              const mutationInProgress = Boolean(
                deletingMemberId || updatingMemberId,
              );

              return (
                <tr key={member.id} className={styles.tableRow}>
                  <td data-label={t("member")}>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        {user.imagePath ? (
                          <img
                            src={user.imagePath}
                            alt={t("member-avatar-alt", { name: fullName })}
                          />
                        ) : (
                          <span>{initials}</span>
                        )}
                      </div>
                      <div className={styles.userDetails}>
                        <span className={styles.userName}>{fullName}</span>
                        <span className={styles.userEmail}>{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td data-label={t("role")}>
                    {isEditing ? (
                      <select
                        className={styles.roleSelect}
                        value={selectedRole}
                        onChange={(event) =>
                          setSelectedRole(event.target.value)
                        }
                        disabled={isUpdating}
                        aria-label={t("assign-role")}
                      >
                        <option value="OWNER">{t("owner")}</option>
                        <option value="MEMBER">{t("member")}</option>
                        <option value="ADMIN">{t("admin")}</option>
                      </select>
                    ) : (
                      getRoleBadge(member.role)
                    )}
                  </td>
                  <td className={styles.dateText} data-label={t("joined")}>
                    {formatJoinedAt(member.joinedAt)}
                  </td>
                  <td
                    className={styles.actionsCol}
                    data-label={t("actions")}
                  >
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          className={`${styles.actionBtn} ${styles.saveBtn}`}
                          title={t("save-role")}
                          aria-label={t("save-member-role", {
                            name: fullName,
                          })}
                          onClick={() => saveRole(member.id)}
                          disabled={isUpdating}
                          aria-busy={isUpdating}
                        >
                          <IoCheckmarkOutline />
                        </button>
                        <button
                          type="button"
                          className={`${styles.actionBtn} ${styles.cancelEditBtn}`}
                          title={t("cancel")}
                          aria-label={t("cancel-member-role-edit", {
                            name: fullName,
                          })}
                          onClick={cancelEditingRole}
                          disabled={isUpdating}
                        >
                          <IoCloseOutline />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className={styles.actionBtn}
                        title={t("edit-role")}
                        aria-label={t("edit-member-role", { name: fullName })}
                        onClick={() => startEditingRole(member)}
                        disabled={mutationInProgress}
                      >
                        <IoCreateOutline />
                      </button>
                    )}
                    {!isEditing && !isOwner && (
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        title={
                          isDeleting
                            ? t("removing-member")
                            : t("remove-member")
                        }
                        aria-label={
                          isDeleting
                            ? t("removing-named-member", { name: fullName })
                            : t("remove-named-member", { name: fullName })
                        }
                        onClick={() => onDelete?.(member.id)}
                        disabled={mutationInProgress}
                        aria-busy={isDeleting}
                      >
                        <IoTrashOutline />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MembersTable;
