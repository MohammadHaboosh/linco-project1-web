import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IoRibbonOutline,
  IoCheckmarkCircleOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import MemberReportModal from "./MemberReportModal";
import styles from "../OwnerHomeContent.module.css";
import { ReportMembersListSkeleton } from "./OwnerHomeSkeletons";

const getJobTitle = (jobTitle, fallback) => {
  if (Array.isArray(jobTitle)) return jobTitle.find(Boolean) || fallback;
  return jobTitle || fallback;
};

const isWorkspaceOwner = (member) =>
  member?.isOwner === true ||
  [member?.demoRole, member?.role].some(
    (role) => String(role || "").trim().toUpperCase() === "OWNER",
  );

const ReportMembersList = ({
  members,
  numberFormatter,
  percentFormatter,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  if (isLoading) return <ReportMembersListSkeleton />;

  const safeMembers = Array.isArray(members)
    ? members.filter((member) => !isWorkspaceOwner(member))
    : [];
  const sortedMembers = [...safeMembers].sort(
    (a, b) =>
      Number(b.certificationsEarned) - Number(a.certificationsEarned) ||
      Number(b.examsPassed) - Number(a.examsPassed),
  );

  const displayedMembers = showAll ? sortedMembers : sortedMembers.slice(0, 5);

  return (
    <>
      <div className={styles.membersCard}>
        <div className={styles.cardHeader}>
          <h3>
            {showAll
              ? t("analytics-all-members")
              : t("analytics-top-active-members")}
          </h3>
          {sortedMembers.length > 5 && (
            <button
              type="button"
              className={styles.viewAllBtn}
              onClick={() => setShowAll(!showAll)}
              aria-expanded={showAll}
              aria-controls="analytics-members-list"
            >
              {showAll
                ? t("analytics-show-fewer-members")
                : t("analytics-view-all-members")}
            </button>
          )}
        </div>

        {displayedMembers.length === 0 ? (
          <div className={styles.emptyState} role="status">
            <IoPeopleOutline aria-hidden="true" />
            <h4>{t("analytics-no-members-title")}</h4>
            <p>{t("analytics-no-members-description")}</p>
          </div>
        ) : (
          <ul
            id="analytics-members-list"
            className={`${styles.activityList} ${showAll ? styles.scrollableList : ""}`}
          >
            {displayedMembers.map((member, index) => {
              const memberName = member.fullName || t("member");
              const examsPassed = Number(member.examsPassed) || 0;
              const certificationsEarned =
                Number(member.certificationsEarned) || 0;

              return (
                <li
                  key={
                    member.memberId ||
                    member.email ||
                    `${memberName}-${index}`
                  }
                >
                  <button
                    type="button"
                    className={`${styles.activityItem} ${styles.clickableItem}`}
                    onClick={() => setSelectedMember(member)}
                    aria-label={t("analytics-view-member-report", {
                      name: memberName,
                    })}
                  >
                    <img
                      src={
                        member.imagePath ||
                        member.avatar ||
                        "/images/default-avatar.png"
                      }
                      alt={t("member-avatar-alt", { name: memberName })}
                      className={styles.memberAvatar}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          "/images/default-avatar.png";
                      }}
                    />

                    <div className={styles.activityDetails}>
                      <p className={styles.activityText}>
                        <strong>{memberName}</strong>
                        <span className={styles.memberJobTitle}>
                          {getJobTitle(member.jobTitle, t("member"))}
                        </span>
                      </p>
                      <div className={styles.memberMetrics}>
                        <span className={styles.metricBadge}>
                          <IoCheckmarkCircleOutline aria-hidden="true" />
                          {t("analytics-exams-passed-count", {
                            count: examsPassed,
                            formattedCount:
                              numberFormatter.format(examsPassed),
                          })}
                        </span>
                        <span className={styles.metricBadgeGold}>
                          <IoRibbonOutline aria-hidden="true" />
                          {t("analytics-certifications-earned-count", {
                            count: certificationsEarned,
                            formattedCount:
                              numberFormatter.format(certificationsEarned),
                          })}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {selectedMember && (
        <MemberReportModal
          member={selectedMember}
          numberFormatter={numberFormatter}
          percentFormatter={percentFormatter}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </>
  );
};

export default ReportMembersList;
