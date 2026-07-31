import { memo, useMemo } from "react";
import {
  IoChatbubblesOutline,
  IoRefreshOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import {
  getDepartmentMemberInitials,
  getDepartmentMemberName,
} from "../utils/messageUtils";
import styles from "./Chats.module.css";

const ChatHeader = ({
  connectionStatus,
  currentDepartmentMemberId,
  onlineMembers,
  retry,
}) => {
  const { t } = useTranslation();
  const isConnected = connectionStatus === "connected";
  const connectionLabel = t(`chat-status-${connectionStatus}`, {
    defaultValue: t("chat-status-disconnected"),
  });
  const sortedOnlineMembers = useMemo(
    () =>
      [...onlineMembers].sort((first, second) => {
        if (first.departmentMemberId === currentDepartmentMemberId) {
          return -1;
        }

        if (second.departmentMemberId === currentDepartmentMemberId) {
          return 1;
        }

        return getDepartmentMemberName(first, "").localeCompare(
          getDepartmentMemberName(second, ""),
        );
      }),
    [currentDepartmentMemberId, onlineMembers],
  );

  return (
    <header className={styles.roomHeader}>
      <div className={styles.headerLeft}>
        <div className={styles.roomAvatar} aria-hidden="true">
          <IoChatbubblesOutline />
        </div>
        <div className={styles.roomMeta}>
          <h2>{t("department-chat")}</h2>
          <span
            className={`${styles.connectionStatus} ${
              styles[`status-${connectionStatus}`] || ""
            }`}
          >
            <span className={styles.statusDot} />
            {connectionLabel}
          </span>
        </div>
      </div>

      <div className={styles.headerActions}>
        {isConnected && sortedOnlineMembers.length > 0 && (
          <details className={styles.onlineMembersMenu}>
            <summary
              className={styles.onlineMembersSummary}
              aria-label={t("chat-online-count", {
                count: sortedOnlineMembers.length,
              })}
            >
              <span className={styles.onlineAvatarStack} aria-hidden="true">
                {sortedOnlineMembers.slice(0, 3).map((member) => {
                  const memberName = getDepartmentMemberName(
                    member,
                    t("chat-unknown-member"),
                  );

                  return (
                    <span
                      className={styles.onlineAvatar}
                      key={member.departmentMemberId}
                      title={memberName}
                    >
                      {member.imagePath ? (
                        <img src={member.imagePath} alt="" />
                      ) : (
                        getDepartmentMemberInitials(member)
                      )}
                    </span>
                  );
                })}
                {sortedOnlineMembers.length > 3 && (
                  <span className={styles.onlineAvatarOverflow}>
                    +{sortedOnlineMembers.length - 3}
                  </span>
                )}
              </span>
              <span className={styles.onlineCountLabel}>
                {t("chat-online-count", {
                  count: sortedOnlineMembers.length,
                })}
              </span>
            </summary>

            <div className={styles.onlineMembersPopover}>
              <strong className={styles.onlineMembersTitle}>
                {t("chat-online-members")}
              </strong>
              <ul className={styles.onlineMembersList}>
                {sortedOnlineMembers.map((member) => {
                  const memberName = getDepartmentMemberName(
                    member,
                    t("chat-unknown-member"),
                  );
                  const isCurrentMember =
                    member.departmentMemberId === currentDepartmentMemberId;

                  return (
                    <li
                      className={styles.onlineMemberItem}
                      key={member.departmentMemberId}
                    >
                      <span className={styles.onlineMemberAvatar}>
                        {member.imagePath ? (
                          <img src={member.imagePath} alt="" />
                        ) : (
                          getDepartmentMemberInitials(member)
                        )}
                        <span className={styles.onlinePresenceDot} />
                      </span>
                      <span className={styles.onlineMemberDetails}>
                        <strong>
                          {memberName}
                          {isCurrentMember && ` (${t("chat-you")})`}
                        </strong>
                        <small>{t("chat-online-now")}</small>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </details>
        )}

        {!isConnected && (
          <button
            type="button"
            className={styles.retryHeaderButton}
            onClick={retry}
          >
            <IoRefreshOutline />
            {t("try-again")}
          </button>
        )}
      </div>
    </header>
  );
};

export default memo(ChatHeader);
