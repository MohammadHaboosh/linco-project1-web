import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoRibbonOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import MemberReportModal from "./MemberReportModal";
import styles from "../OwnerHomeContent.module.css";

const ReportMembersList = ({ members, numberFormatter }) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  if (!members || members.length === 0) return null;

  const sortedMembers = [...members].sort(
    (a, b) =>
      b.certificationsEarned - a.certificationsEarned ||
      b.examsPassed - a.examsPassed,
  );

  const displayedMembers = showAll ? sortedMembers : sortedMembers.slice(0, 5);

  return (
    <>
      <div className={styles.membersCard}>
        <div className={styles.cardHeader}>
          <h3>{showAll ? t("all-members") : t("top-active-members")}</h3>
          {sortedMembers.length > 5 && (
            <button
              type="button"
              className={styles.viewAllBtn}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? t("show-less") : t("view-all")}
            </button>
          )}
        </div>

        <div
          className={`${styles.activityList} ${showAll ? styles.scrollableList : ""}`}
        >
          {displayedMembers.map((member) => (
            <div
              key={member.memberId}
              className={`${styles.activityItem} ${styles.clickableItem}`}
              onClick={() => setSelectedMember(member)}
              role="button"
              tabIndex={0}
            >
              <img
                src={
                  member.imagePath ||
                  member.avatar ||
                  "/images/default-avatar.png"
                }
                alt={member.fullName}
                className={styles.memberAvatar}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/default-avatar.png";
                }}
              />

              <div className={styles.activityDetails}>
                <p className={styles.activityText}>
                  <strong>{member.fullName}</strong> (
                  {member.jobTitle?.[0] || t("member")})
                </p>
                <div className={styles.memberMetrics}>
                  <span className={styles.metricBadge}>
                    <IoCheckmarkCircleOutline />{" "}
                    {numberFormatter.format(member.examsPassed)}{" "}
                    {t("exams-passed")}
                  </span>
                  <span className={styles.metricBadgeGold}>
                    <IoRibbonOutline />{" "}
                    {numberFormatter.format(member.certificationsEarned)}{" "}
                    {t("certifications")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMember && (
        <MemberReportModal
          member={selectedMember}
          numberFormatter={numberFormatter}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </>
  );
};

export default ReportMembersList;
