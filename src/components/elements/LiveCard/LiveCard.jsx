import {
  IoPlayCircleOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoTimeOutline,
} from "react-icons/io5";
import styles from "./LiveCard.module.css";
import placeholderImg from "../../../../public/images/linco-logo.jpg";
import { useTranslation } from "react-i18next";

const LiveCard = ({ live }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={placeholderImg} alt={live.title} className={styles.image} />
        <IoPlayCircleOutline className={styles.playIcon} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{live.title}</h3>
        <div className={styles.details}>
          <p>
            <IoPersonOutline className={styles.icon} /> {live.instructor}
          </p>
          <p>
            <IoCalendarOutline className={styles.icon} /> {live.date}
          </p>
          <p>
            <IoTimeOutline className={styles.icon} /> {live.duration}
          </p>
        </div>
        <div className={styles.actionRow}>
          <button className={styles.btn}>{t("join-now")}</button>
        </div>
      </div>
    </div>
  );
};

export default LiveCard;
