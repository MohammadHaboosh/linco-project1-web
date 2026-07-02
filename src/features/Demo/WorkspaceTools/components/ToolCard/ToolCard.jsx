import { IoOpenOutline } from "react-icons/io5";
import styles from "./ToolCard.module.css";

const ToolCard = ({ tool, onOpen }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.iconContainer}>
          <img src={tool.icon} alt={tool.name} className={styles.toolIcon} />
        </div>
        <div className={styles.tagsArea}>
          {tool.tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.toolName}>{tool.name}</h3>
        <p className={styles.toolDesc}>{tool.description}</p>
      </div>

      <div className={styles.cardFooter}>
        <button className={styles.launchBtn} onClick={onOpen}>
          Launch Tool <IoOpenOutline className={styles.btnIcon} />
        </button>
      </div>
    </div>
  );
};

export default ToolCard;
