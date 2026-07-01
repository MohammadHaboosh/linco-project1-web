import {
  IoPersonOutline,
  IoShieldCheckmarkOutline,
  IoCameraOutline,
} from "react-icons/io5";
import styles from "./ProfileContent.module.css";

const ProfileSidebar = ({
  profile,
  fullName,
  initials,
  activeTab,
  setActiveTab,
}) => {
  return (
    <aside className={styles.leftSidebar}>
      <div className={styles.userBriefCard}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            {profile?.imagePath ? (
              <img src={profile.imagePath} alt={fullName} />
            ) : (
              <span>{initials}</span>
            )}
            <button className={styles.editAvatarBtn} title="Change Avatar">
              <IoCameraOutline />
            </button>
          </div>
        </div>
        <h2 className={styles.userName}>{fullName}</h2>
        <p className={styles.userEmail}>
          {profile?.email || "nameusername@gmail.com"}
        </p>
        <div className={styles.roleBadge}>Trainee</div>
      </div>

      <nav className={styles.settingsNav}>
        <button
          className={`${styles.navItem} ${activeTab === "general" ? styles.activeNav : ""}`}
          onClick={() => setActiveTab("general")}
        >
          <IoPersonOutline className={styles.navIcon} />
          General Information
        </button>
        <button
          className={`${styles.navItem} ${activeTab === "security" ? styles.activeNav : ""}`}
          onClick={() => setActiveTab("security")}
        >
          <IoShieldCheckmarkOutline className={styles.navIcon} />
          Security & Sign-in
        </button>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
