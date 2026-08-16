import {
  IoPersonOutline,
  IoShieldCheckmarkOutline,
  IoCameraOutline,
} from "react-icons/io5";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import styles from "./ProfileContent.module.css";

const ProfileSidebar = ({
  profile,
  fullName,
  initials,
  activeTab,
  setActiveTab,
  isUploadingPhoto,
  photoUploadError,
  photoUploadStatus,
  onPhotoChange,
}) => {
  const { t } = useTranslation();
  const photoInputRef = useRef(null);

  const handleFileSelection = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    onPhotoChange(file);
  };

  return (
    <aside className={styles.leftSidebar} aria-label={t("profile-summary")}>
      <div className={styles.userBriefCard}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            {profile?.imagePath ? (
              <img
                src={profile.imagePath}
                alt={t("profile-image-alt", { name: fullName })}
              />
            ) : (
              <span>{initials}</span>
            )}
            {isUploadingPhoto && (
              <div
                className={styles.avatarUploadOverlay}
                role="status"
                aria-label={t("profile-photo-uploading")}
              >
                <span className={styles.avatarSpinner} aria-hidden="true" />
              </div>
            )}
            <input
              ref={photoInputRef}
              className={styles.hiddenFileInput}
              type="file"
              accept="image/*"
              aria-label={t("select-profile-photo")}
              onChange={handleFileSelection}
              disabled={isUploadingPhoto}
            />
            <button
              type="button"
              className={styles.editAvatarBtn}
              title={t("change-profile-photo")}
              aria-label={t("change-profile-photo")}
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
            {t(photoUploadError)}
          </p>
        )}
        {photoUploadStatus && !photoUploadError && (
          <p className={styles.photoUploadSuccess} role="status">
            {t(photoUploadStatus)}
          </p>
        )}
        <h2 className={styles.userName}>{fullName}</h2>
        <p className={styles.userEmail}>
          {profile?.email || t("email-not-provided")}
        </p>
        <div className={styles.roleBadge}>{t("trainee")}</div>
      </div>

      <nav
        className={styles.settingsNav}
        aria-label={t("account-settings-navigation")}
      >
        <button
          type="button"
          className={`${styles.navItem} ${activeTab === "general" ? styles.activeNav : ""}`}
          onClick={() => setActiveTab("general")}
          aria-pressed={activeTab === "general"}
        >
          <IoPersonOutline className={styles.navIcon} aria-hidden="true" />
          {t("general-information")}
        </button>
        <button
          type="button"
          className={`${styles.navItem} ${activeTab === "security" ? styles.activeNav : ""}`}
          onClick={() => setActiveTab("security")}
          aria-pressed={activeTab === "security"}
        >
          <IoShieldCheckmarkOutline
            className={styles.navIcon}
            aria-hidden="true"
          />
          {t("security-and-sign-in")}
        </button>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
