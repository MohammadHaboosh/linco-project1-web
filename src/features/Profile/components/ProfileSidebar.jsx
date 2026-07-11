import {
  IoPersonOutline,
  IoShieldCheckmarkOutline,
  IoCameraOutline,
} from "react-icons/io5";
import { useRef } from "react";
import styles from "./ProfileContent.module.css";
import { t } from "i18next";

const ProfileSidebar = ({
  profile,
  fullName,
  initials,
  activeTab,
  setActiveTab,
  isUploadingPhoto,
  photoUploadError,
  onPhotoChange,
}) => {
  const photoInputRef = useRef(null);

  const handleFileSelection = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    onPhotoChange(file);
  };

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
            {isUploadingPhoto && (
              <div
                className={styles.avatarUploadOverlay}
                role="status"
                aria-label="Uploading profile photo"
              >
                <span className={styles.avatarSpinner} />
              </div>
            )}
            <input
              ref={photoInputRef}
              className={styles.hiddenFileInput}
              type="file"
              accept="image/*"
              onChange={handleFileSelection}
              disabled={isUploadingPhoto}
            />
            <button
              type="button"
              className={styles.editAvatarBtn}
              title="Change Avatar"
              aria-label="Change profile photo"
              aria-busy={isUploadingPhoto}
              disabled={isUploadingPhoto}
              onClick={() => photoInputRef.current?.click()}
            >
              <IoCameraOutline />
            </button>
          </div>
        </div>
        {photoUploadError && (
          <p className={styles.photoUploadError} role="alert">
            {photoUploadError}
          </p>
        )}
        <h2 className={styles.userName}>{fullName}</h2>
        <p className={styles.userEmail}>
          {profile?.email || "nameusername@gmail.com"}
        </p>
        <div className={styles.roleBadge}>{t('trainee')}</div>
      </div>

      <nav className={styles.settingsNav}>
        <button
          className={`${styles.navItem} ${activeTab === "general" ? styles.activeNav : ""}`}
          onClick={() => setActiveTab("general")}
        >
          <IoPersonOutline className={styles.navIcon} />
          {t('general-information')}
        </button>
        <button
          className={`${styles.navItem} ${activeTab === "security" ? styles.activeNav : ""}`}
          onClick={() => setActiveTab("security")}
        >
          <IoShieldCheckmarkOutline className={styles.navIcon} />
          {t('security-and-sign-in')}
        </button>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
