import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./InvitationCard.module.css";

const InvitationCardSkeleton = ({ compact = false }) => {
  return (
    <SkeletonTheme
      baseColor="var(--app-surface-soft)"
      highlightColor="var(--app-border)"
    >
      {compact ? (
        <div
          className={`${styles["list-item"]} ${styles["compact-card"]}`}
          style={{ cursor: "default" }}
        >
          <div className={styles["compact-header"]}>
            <Skeleton width={110} height={18} borderRadius={6} />
            <Skeleton width={60} height={14} borderRadius={4} />
          </div>
          <div className={styles["compact-details"]}>
            <Skeleton width={130} height={14} borderRadius={4} />
            <Skeleton width={80} height={14} borderRadius={4} />
          </div>
          <div
            className={`${styles["list-actions"]} ${styles["compact-actions"]}`}
          >
            <Skeleton width="100%" height={38} borderRadius={8} />
            <Skeleton width="100%" height={38} borderRadius={8} />
          </div>
        </div>
      ) : (
        <div
          className={styles["list-item"]}
          style={{ cursor: "default", alignItems: "center" }}
        >
          <div className={styles["company-name"]}>
            <Skeleton width={140} height={20} borderRadius={6} />
          </div>
          <div className={styles["vertical-divider"]}></div>
          <div className={styles["text-item"]}>
            <Skeleton width={120} height={16} borderRadius={4} />
          </div>
          <div className={styles["vertical-divider"]}></div>
          <div className={styles["text-item"]}>
            <Skeleton width={90} height={16} borderRadius={4} />
          </div>
          <div className={styles["vertical-divider"]}></div>
          <div className={styles["text-item"]}>
            <Skeleton width={110} height={16} borderRadius={4} />
          </div>
          <div
            className={styles["list-actions"]}
            style={{ marginLeft: "auto", display: "flex", gap: "8px" }}
          >
            <Skeleton width={85} height={42} borderRadius={10} />
            <Skeleton width={85} height={42} borderRadius={10} />
          </div>
        </div>
      )}
    </SkeletonTheme>
  );
};

export default InvitationCardSkeleton;
