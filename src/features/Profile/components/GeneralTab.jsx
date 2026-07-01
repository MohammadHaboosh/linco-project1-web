import {
  IoPersonOutline,
  IoMailOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import styles from "./ProfileContent.module.css";

const GeneralTab = ({ profile, firstName, lastName }) => {
  return (
    <div className={styles.cardSection}>
      <div className={styles.sectionHeader}>
        <h2>Personal Information</h2>
        <p>Update your personal details.</p>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label>First Name</label>
          <div className={styles.inputWrapper}>
            <IoPersonOutline className={styles.inputIcon} />
            <input
              type="text"
              defaultValue={firstName}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Last Name</label>
          <div className={styles.inputWrapper}>
            <IoPersonOutline className={styles.inputIcon} />
            <input
              type="text"
              defaultValue={lastName}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Date of Birth</label>
          <div className={styles.inputWrapper}>
            <IoCalendarOutline className={styles.inputIcon} />
            <input
              type="date"
              defaultValue={profile?.birthDate?.split("T")[0]}
              className={styles.input}
            />
          </div>
        </div>
      </div>

      <div className={styles.actionRow}>
        <button className={styles.btnPrimary}>Save Changes</button>
      </div>
    </div>
  );
};

export default GeneralTab;
