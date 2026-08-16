import { IoOpenOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import styles from "./ToolCard.module.css";

const ToolCard = ({ tool, onOpen }) => {
  const { t } = useTranslation();

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.iconContainer}>
          <img
            src={tool.icon}
            alt={t("tool-logo-alt", { name: tool.name })}
            className={styles.toolIcon}
          />
        </div>
        <div className={styles.tagsArea}>
          {tool.tagKeys.slice(0, 2).map((tagKey) => (
            <span key={tagKey} className={styles.tag}>
              {t(tagKey)}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.toolName}>{tool.name}</h3>
        <p className={styles.toolDesc}>{t(tool.descriptionKey)}</p>
      </div>

      <div className={styles.cardFooter}>
        <button
          type="button"
          className={styles.launchBtn}
          onClick={onOpen}
          aria-label={t("launch-named-tool", { name: tool.name })}
        >
          {t("launch-tool")}
          <IoOpenOutline className={styles.btnIcon} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};

export default ToolCard;
