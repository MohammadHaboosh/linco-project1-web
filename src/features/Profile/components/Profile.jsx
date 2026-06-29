import { useTranslation } from "react-i18next";
import {
  IoPersonOutline,
  IoMailOutline,
  IoCalendarOutline,
  IoCameraOutline,
} from "react-icons/io5";
import { useProfile } from "../hooks/useProfile.jsx";
import styles from "./ProfilePage.module.css"; 

const ProfilePage = () => {
  const { t } = useTranslation();

  const { profile, isLoading, firstName, lastName, fullName, initials } =
    useProfile();

  if (isLoading) {
    return <div className={styles["loading-state"]}>Loading profile...</div>;
  }

  return (
    <div className={styles["app-container"]}>
      <div className={styles["main-wrapper"]}>
        {/* Banner Section */}
        <div className={styles["top-banner"]}>
          <div className={styles["banner-content"]}>
            <h1 className={styles["page-title"]}>
              {t("my-profile") || "My Profile"}
            </h1>
            <p className={styles["page-subtitle"]}>
              Manage your personal information and LinCo account settings.
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={styles["profile-section"]}>
          <div className={styles["profile-grid"]}>
            {/* Avatar & Quick Actions Card */}
            <div className={styles["card"]}>
              <div className={styles["avatar-wrapper"]}>
                <div className={styles["user-avatar"]}>
                  {profile?.imagePath && profile.imagePath !== "123456789" ? (
                    <img src={profile.imagePath} alt={fullName} />
                  ) : (
                    <span>{initials}</span>
                  )}
                  <button
                    className={styles["edit-avatar-btn"]}
                    title="Update photo"
                  >
                    <IoCameraOutline />
                  </button>
                </div>
                <h2 className={styles["user-name"]}>{fullName}</h2>
                <span className={styles["user-role"]}>Trainee</span>
              </div>
            </div>

            {/* Personal Details Card */}
            <div className={`${styles["card"]} ${styles["details-card"]}`}>
              <div className={styles["card-header"]}>
                <h3>Personal Information</h3>
                <button className={styles["btn-edit"]}>Edit</button>
              </div>

              <div className={styles["info-group"]}>
                <div className={styles["info-item"]}>
                  <div className={styles["info-label"]}>
                    <IoPersonOutline className={styles["info-icon"]} />
                    First Name
                  </div>
                  <div className={styles["info-value"]}>{firstName}</div>
                </div>

                <div className={styles["info-item"]}>
                  <div className={styles["info-label"]}>
                    <IoPersonOutline className={styles["info-icon"]} />
                    Last Name
                  </div>
                  <div className={styles["info-value"]}>{lastName || "-"}</div>
                </div>

                <div className={styles["info-item"]}>
                  <div className={styles["info-label"]}>
                    <IoMailOutline className={styles["info-icon"]} />
                    Email Address
                  </div>
                  <div className={styles["info-value"]}>
                    {profile?.email || "No email provided"}
                  </div>
                </div>

                <div className={styles["info-item"]}>
                  <div className={styles["info-label"]}>
                    <IoCalendarOutline className={styles["info-icon"]} />
                    Date of Birth
                  </div>
                  <div className={styles["info-value"]}>
                    {profile?.birthDate || "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
