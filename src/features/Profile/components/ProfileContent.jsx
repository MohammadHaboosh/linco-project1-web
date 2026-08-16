import { useState } from "react";
import { useProfile } from "../hooks/useProfile.jsx";
import ProfileSidebar from "./ProfileSidebar";
import GeneralTab from "./GeneralTab";
import SecurityTab from "./SecurityTab";
import styles from "./ProfileContent.module.css";
import { useTranslation } from "react-i18next";

const ProfileContent = () => {
  const { t } = useTranslation();
  const {
    profile,
    isLoading,
    error,
    retryLoadProfile,
    firstName,
    lastName,
    fullName,
    initials,
    isUploadingPhoto,
    photoUploadError,
    photoUploadStatus,
    handlePhotoChange,
  } = useProfile();
  const [activeTab, setActiveTab] = useState("general");

  if (isLoading) {
    return (
      <div
        className={`${styles.contentWrapper} ${styles.pageState}`}
        role="status"
        aria-live="polite"
      >
        <span className={styles.spinner} aria-hidden="true" />
        <p>{t("loading-account-settings")}</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className={`${styles.contentWrapper} ${styles.pageState}`}>
        <div className={styles.errorState} role="alert">
          <h1>{t("profile-load-error-title")}</h1>
          <p>{t(error)}</p>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={retryLoadProfile}
          >
            {t("try-again")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contentWrapper}>
      <header className={styles.ovalBackground}>
        <div className={styles.headerText}>
          <h1 id="profile-page-title">{t("account-settings")}</h1>
          <p>{t("manage-your-account-details-and-security-preferences")}</p>
        </div>
      </header>

      <div className={styles.overlapContainer}>
        <div className={styles.layoutGrid}>
          <ProfileSidebar
            profile={profile}
            fullName={fullName}
            initials={initials}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isUploadingPhoto={isUploadingPhoto}
            photoUploadError={photoUploadError}
            photoUploadStatus={photoUploadStatus}
            onPhotoChange={handlePhotoChange}
          />

          <main
            className={styles.tabContentArea}
            aria-labelledby="profile-page-title"
          >
            {activeTab === "general" && (
              <GeneralTab
                profile={profile}
                firstName={firstName}
                lastName={lastName}
              />
            )}
            {activeTab === "security" && <SecurityTab profile={profile} />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
