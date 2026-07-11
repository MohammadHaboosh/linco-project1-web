import { useState } from "react";
import { useProfile } from "../hooks/useProfile.jsx";
import ProfileSidebar from "./ProfileSidebar";
import GeneralTab from "./GeneralTab";
import SecurityTab from "./SecurityTab";
import styles from "./ProfileContent.module.css";
import { t } from "i18next";

const ProfileContent = () => {
  const {
    profile,
    isLoading,
    firstName,
    lastName,
    fullName,
    initials,
    isUploadingPhoto,
    photoUploadError,
    handlePhotoChange,
  } = useProfile();
  const [activeTab, setActiveTab] = useState("general");

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>{t("loading-account-settings")}</p>
      </div>
    );
  }

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.ovalBackground}>
        <div className={styles.headerText}>
          <h1>{t("account-settings")}</h1>
          <p>{t("manage-your-account-details-and-security-preferences")}</p>
        </div>
      </div>

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
            onPhotoChange={handlePhotoChange}
          />

          <main className={styles.tabContentArea}>
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
