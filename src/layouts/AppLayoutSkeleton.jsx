import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./AppLayoutSkeleton.module.css";

const AppLayoutSkeleton = () => {
  return (
    <SkeletonTheme
      baseColor="var(--app-surface-soft)"
      highlightColor="var(--app-border)"
    >
      <div className={styles.skeletonContainer}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarLogo}>
            <Skeleton circle width={42} height={42} />
            <Skeleton width={120} height={20} borderRadius={6} />
          </div>

          <div className={styles.sidebarNav}>
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className={styles.navItem}>
                  <Skeleton width={24} height={24} borderRadius={6} />
                  <Skeleton width={130} height={14} borderRadius={4} />
                </div>
              ))}
          </div>
        </aside>

        <div className={styles.mainWrapper}>
          <header className={styles.header}>
            <Skeleton width={180} height={24} borderRadius={6} />
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Skeleton circle width={38} height={38} />
              <Skeleton circle width={42} height={42} />
            </div>
          </header>

          <div className={styles.subHeader}>
            <div style={{ display: "flex", gap: "24px" }}>
              <Skeleton width={80} height={14} borderRadius={4} />
              <Skeleton width={80} height={14} borderRadius={4} />
              <Skeleton width={80} height={14} borderRadius={4} />
            </div>
          </div>

          <main className={styles.content}>
            <div style={{ marginBottom: "24px" }}>
              <Skeleton
                width={250}
                height={32}
                borderRadius={8}
                style={{ marginBottom: "8px" }}
              />
              <Skeleton width={400} height={16} borderRadius={4} />
            </div>

            <div className={styles.grid}>
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} height={220} borderRadius={16} />
                ))}
            </div>
          </main>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default AppLayoutSkeleton;
