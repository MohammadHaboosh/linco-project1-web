import { useState } from "react";
import {
  IoLockClosedOutline,
  IoQrCodeOutline,
  IoHardwareChipOutline,
} from "react-icons/io5";
import styles from "./ProfileContent.module.css";
import { t } from "i18next";

const SecurityTab = ({ profile }) => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(
    profile?.isTwoFactorEnabled || false,
  );

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
          <div className={styles.inputGroup}>
            <label>{t('current-password')}</label>
            <div className={styles.inputWrapper}>
              <IoLockClosedOutline className={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                className={styles.input}
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
              />
            </div>
          </div>
          <div className={styles.actionRow}>
            <button className={styles.btnPrimary}>{t('update-password')}</button>
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* Two-Factor Authentication */}
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
