import React, { useState } from "react";
import styles from "./AIFloatingAssistant.module.css";
import {
  IoSparkles,
  IoChatbubbleEllipsesOutline,
  IoBulbOutline,
  IoCloseOutline,
} from "react-icons/io5";

const AIFloatingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.aiWrapper}>
      {isOpen && (
        <div className={styles.aiMenu}>
          <div className={styles.menuHeader}>
            <div className={styles.headerTitle}>
              <IoSparkles className={styles.sparkleIcon} />
              <span>مساعد الذكاء الاصطناعي</span>
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
            >
              <IoCloseOutline />
            </button>
          </div>
          <div className={styles.menuOptions}>
            <button className={styles.optionBtn}>
              <div
                className={styles.optionIcon}
                style={{ background: "#e0e7ff", color: "#4338ca" }}
              >
                <IoChatbubbleEllipsesOutline />
              </div>
              <div className={styles.optionText}>
                <strong>تحدث مع المساعد</strong>
                <span>اسأل أي شيء حول محتوى الكورس</span>
              </div>
            </button>

            <button className={styles.optionBtn}>
              <div
                className={styles.optionIcon}
                style={{ background: "#fce7f3", color: "#be185d" }}
              >
                <IoBulbOutline />
              </div>
              <div className={styles.optionText}>
                <strong>توليد كويز تجريبي</strong>
                <span>استخرج أسئلة لاختبار فهمك للكورس</span>
              </div>
            </button>
          </div>
        </div>
      )}

      <button className={styles.floatingBtn} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <IoCloseOutline className={styles.btnIcon} />
        ) : (
          <IoSparkles className={styles.btnIcon} />
        )}
      </button>
    </div>
  );
};

export default AIFloatingAssistant;
