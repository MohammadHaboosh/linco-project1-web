import {
  IoLockClosedOutline,
  IoQrCodeOutline,
  IoHardwareChipOutline,
} from "react-icons/io5";
import { useProfile } from "../hooks/useProfile.jsx";
import styles from "./ProfileContent.module.css";
import { t } from "i18next";

const SecurityTab = () => {
  const {
    is2FAEnabled,
    setIs2FAEnabled,
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordStatus,
    isUpdatingPassword,
    handleUpdatePassword,
  } = useProfile();

  return (
    <div className={styles.cardSection}>
      {/* Password Change */}
      <div className={styles.securityBlock}>
        <div className={styles.sectionHeader}>
          <h2>{t('change-password')}</h2>
          <p>
            {t('ensure-your-account-is-using-a-long-random-password-to-stay-secure')}
          </p>
        </div>

        <div className={styles.passwordForm}>
          
          {passwordStatus.message && (
            <div style={{ 
              padding: "10px", 
              borderRadius: "8px", 
              backgroundColor: passwordStatus.type === "error" ? "#fee2e2" : "#d1fae5",
              color: passwordStatus.type === "error" ? "#b91c1c" : "#047857",
              fontSize: "0.9rem",
              fontWeight: "600"
            }}>
              {passwordStatus.message}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>{t('current-password')}</label>
            <div className={styles.inputWrapper}>
              <IoLockClosedOutline className={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                className={styles.input}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>{t('new-password')}</label>
            <div className={styles.inputWrapper}>
              <IoLockClosedOutline className={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                className={styles.input}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>{t('confirm-new-password')}</label>
            <div className={styles.inputWrapper}>
              <IoLockClosedOutline className={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.actionRow}>
            <button 
              className={styles.btnPrimary} 
              onClick={handleUpdatePassword}
              disabled={isUpdatingPassword}
              style={{ opacity: isUpdatingPassword ? 0.7 : 1, cursor: isUpdatingPassword ? 'not-allowed' : 'pointer' }}
            >
              {isUpdatingPassword ? "Updating..." : t('update-password')}
            </button>
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.securityBlock}>
        <div className={styles.sectionHeader}>
          <h2>{t('two-factor-authentication-2fa')}</h2>
          <p>{t('add-an-extra-layer-of-security-to-your-account')}</p>
        </div>

        <div className={styles.twoFactorContainer}>
          <div className={styles.twoFactorStatus}>
            <div className={styles.statusInfo}>
              <div
                className={`${styles.statusDot} ${is2FAEnabled ? styles.activeDot : ""}`}
              ></div>
              <div>
                <h3>Authenticator App</h3>
                <p>
                  {is2FAEnabled
                    ? "Two-factor authentication is currently enabled."
                    : "Secure your account with TOTP authentication."}
                </p>
              </div>
            </div>

            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={is2FAEnabled}
                onChange={() => setIs2FAEnabled(!is2FAEnabled)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          {is2FAEnabled && (
            <div className={styles.qrCodeSection}>
              <div className={styles.qrInfo}>
                <IoHardwareChipOutline className={styles.qrIconBig} />
                <div>
                  <h4>{t('configure-authenticator')}</h4>
                  <p>{t('scan-the-qr-code-using-google-authenticator-or-authy')}</p>
                </div>
              </div>
              <button className={styles.btnOutline}>
                <IoQrCodeOutline className={styles.btnIcon} /> {t('generate-qr-code')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;