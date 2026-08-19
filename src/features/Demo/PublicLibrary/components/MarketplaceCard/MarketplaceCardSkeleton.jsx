import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./MarketplaceCard.module.css";

const ThemeWrapper = ({ children }) => (
  <SkeletonTheme
    baseColor="var(--app-surface-soft)"
    highlightColor="var(--app-border)"
  >
    {children}
  </SkeletonTheme>
);

const MarketplaceCardSkeleton = () => {
  return (
    <ThemeWrapper>
      <article className={styles.card}>
        <div className={styles.imageWrapper}>
          <Skeleton
            height="100%"
            borderRadius={0}
            style={{ display: "block", lineHeight: "1" }}
          />
          <div
            className={styles.priceBadge}
            style={{
              background: "transparent",
              border: "none",
              boxShadow: "none",
              padding: 0,
              insetInlineEnd: "12px",
            }}
          >
            <Skeleton width={50} height={24} borderRadius={20} />
          </div>
          <div
            className={styles.privacyBadge}
            style={{
              background: "transparent",
              border: "none",
              boxShadow: "none",
              padding: 0,
              insetInlineStart: "12px",
            }}
          >
            <Skeleton width={65} height={24} borderRadius={20} />
          </div>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.metaRow}>
            <div className={styles.companyInfo}>
              <Skeleton circle width={16} height={16} />
              <Skeleton width={110} height={14} borderRadius={4} />
            </div>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <Skeleton width="85%" height={22} borderRadius={6} />
          </div>

          <div style={{ marginBottom: "16px", flex: 1 }}>
            <Skeleton
              width="100%"
              height={14}
              borderRadius={4}
              style={{ marginBottom: "6px" }}
            />
            <Skeleton width="75%" height={14} borderRadius={4} />
          </div>

          <div className={styles.tagsContainer}>
            <Skeleton width={60} height={22} borderRadius={20} />
            <Skeleton width={80} height={22} borderRadius={20} />
            <Skeleton width={50} height={22} borderRadius={20} />
          </div>

          <div className={styles.divider}></div>

          <div className={styles.footerRow}>
            <div className={styles.courseStats}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <Skeleton circle width={14} height={14} />
                <Skeleton width={45} height={12} borderRadius={4} />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginInlineStart: "8px",
                }}
              >
                <Skeleton circle width={14} height={14} />
                <Skeleton width={45} height={12} borderRadius={4} />
              </div>
            </div>

            <div className={styles.actionArea}>
              <Skeleton width={42} height={42} borderRadius={12} />
            </div>
          </div>
        </div>
      </article>
    </ThemeWrapper>
  );
};

export default MarketplaceCardSkeleton;
