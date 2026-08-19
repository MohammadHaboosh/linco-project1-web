import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./SectionCard.module.css";

const ThemeWrapper = ({ children }) => (
  <SkeletonTheme
    baseColor="var(--app-surface-soft)"
    highlightColor="var(--app-border)"
  >
    {children}
  </SkeletonTheme>
);

const SectionCardSkeleton = () => {
  return (
    <ThemeWrapper>
      <article className={`${styles.sectionCard} ${styles.cardActive}`}>
        <div className={styles.cardHeader}>
          <Skeleton width={160} height={26} borderRadius={8} />
          <div className={styles.headerActions}>
            <Skeleton width={42} height={42} borderRadius={12} />
          </div>
        </div>

        <div style={{ marginBottom: "25px", flex: 1, marginTop: "10px" }}>
          <Skeleton
            width="100%"
            height={14}
            borderRadius={4}
            style={{ marginBottom: "8px" }}
          />
          <Skeleton
            width="85%"
            height={14}
            borderRadius={4}
            style={{ marginBottom: "8px" }}
          />
          <Skeleton width="60%" height={14} borderRadius={4} />
        </div>

        <div
          className={styles.cardFooter}
          style={{ borderTop: "none", paddingTop: "0" }}
        >
          <div className={styles.tags}>
            <Skeleton width={65} height={26} borderRadius={20} />
            <Skeleton width={85} height={26} borderRadius={20} />
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <Skeleton circle width={16} height={16} />
              <Skeleton width={20} height={14} borderRadius={4} />
            </div>
            <div className={styles.statItem}>
              <Skeleton circle width={16} height={16} />
              <Skeleton width={20} height={14} borderRadius={4} />
            </div>
          </div>
        </div>
      </article>
    </ThemeWrapper>
  );
};

export default SectionCardSkeleton;
