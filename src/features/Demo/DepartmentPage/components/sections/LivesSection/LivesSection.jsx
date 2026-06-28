import { useTranslation } from "react-i18next";
import LiveCard from "../../../../../../components/elements/LiveCard/LiveCard";
import styles from "../SharedSection.module.css";

const LivesSection = ({ lives }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles["section-header"]}>
        <h2>{t("new-lives")}</h2>
      </div>

      <div className={styles["cards-grid-2"]}>
        {lives.map((live) => (
          <LiveCard key={live.id} live={live} />
        ))}
      </div>
    </>
  );
};

export default LivesSection;
