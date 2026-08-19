import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./Certificates.module.css";

const ThemeWrapper = ({ children }) => (
  <SkeletonTheme
    baseColor="var(--app-surface-soft)"
    highlightColor="var(--app-border)"
  >
    {children}
  </SkeletonTheme>
);

const CertificateCardSkeleton = () => {
  return (
    <ThemeWrapper>
      <div
        className={styles.cardWrapper}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div
          className={styles.certificateLayout}
          style={{
            background: "var(--app-surface-muted)",
            border: "1px solid var(--app-border)",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "30px 20px",
            minHeight: "220px",
            boxSizing: "border-box",
          }}
        >
          <Skeleton
            circle
            width={56}
            height={56}
            style={{ marginBottom: "16px" }}
          />

          <Skeleton
            width={180}
            height={22}
            borderRadius={6}
            style={{ marginBottom: "12px" }}
          />
          <Skeleton
            width={240}
            height={14}
            borderRadius={4}
            style={{ marginBottom: "24px" }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "auto",
            }}
          >
            <Skeleton width={70} height={12} borderRadius={4} />
            <Skeleton width={70} height={12} borderRadius={4} />
          </div>
        </div>

        <div
          className={styles.actionsBar}
          style={{ display: "flex", gap: "12px", marginTop: "16px" }}
        >
          <div style={{ flex: 1 }}>
            <Skeleton height={42} borderRadius={10} />
          </div>
          <div style={{ flex: 1 }}>
            <Skeleton height={42} borderRadius={10} />
          </div>
        </div>
      </div>
    </ThemeWrapper>
  );
};

export default CertificateCardSkeleton;
