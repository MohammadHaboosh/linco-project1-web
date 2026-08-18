import { IoPulseOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import styles from "../OwnerHomeContent.module.css";
import { WelcomeBannerSkeleton } from "./OwnerHomeSkeletons";

const WelcomeBanner = ({ workspaceName, isLoading }) => {
  const { t } = useTranslation();

  if (isLoading) return <WelcomeBannerSkeleton />;
  return (
    <div className={styles.welcomeBanner}>
      <div className={styles.bannerContent}>
        <h1 className={styles.greeting}>
          {t("overview-for-workspace", { workspaceName })}
        </h1>
        <p className={styles.bannerDesc}>
          {t("heres-what-happening-in-your-workspace-today")}
        </p>
      </div>
      <div className={styles.bannerDecoration}>
        <IoPulseOutline className={styles.bgIcon} />
      </div>
    </div>
  );
};

export default WelcomeBanner;
