import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./LiveCard.module.css";

const ThemeWrapper = ({ children }) => (
  <SkeletonTheme
    baseColor="var(--app-surface-soft)"
    highlightColor="var(--app-border)"
  >
    {children}
  </SkeletonTheme>
);

const LiveCardSkeleton = () => {
  return (
    <ThemeWrapper>
      <article className={`${styles.card} ${styles.endedCard}`}>
        <div
          className={styles.visual}
          style={{ background: "var(--app-surface-muted)" }}
        >
          <div className={styles.visualHeader}>
            <Skeleton width={80} height={26} borderRadius={20} />
          </div>

          <div
            className={styles.broadcastMark}
            aria-hidden="true"
            style={{ background: "transparent", boxShadow: "none" }}
          >
            <Skeleton circle width={56} height={56} />
          </div>

          <div className={styles.visualFooter}>
            <Skeleton width={110} height={14} borderRadius={4} />
          </div>
        </div>

        <div className={styles.cardBody}>
          <div style={{ marginBottom: "8px" }}>
            <Skeleton width="85%" height={24} borderRadius={6} />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <Skeleton
              width="100%"
              height={14}
              borderRadius={4}
              style={{ marginBottom: "6px" }}
            />
            <Skeleton width="60%" height={14} borderRadius={4} />
          </div>

          <div
            className={styles.metaPanel}
            style={{ border: "none", padding: 0 }}
          >
            <div style={{ display: "flex", gap: "16px", width: "100%" }}>
              <Skeleton width={90} height={16} borderRadius={4} />
              <Skeleton width={70} height={16} borderRadius={4} />
            </div>
          </div>

          <div style={{ marginTop: "auto" }}>
            <Skeleton height={42} borderRadius={12} />
          </div>
        </div>
      </article>
    </ThemeWrapper>
  );
};

export default LiveCardSkeleton;
