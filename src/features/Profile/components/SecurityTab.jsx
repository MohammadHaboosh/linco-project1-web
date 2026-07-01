import { useState } from "react";
import {
  IoLockClosedOutline,
  IoQrCodeOutline,
  IoHardwareChipOutline,
} from "react-icons/io5";
import styles from "./ProfileContent.module.css";

const SecurityTab = ({ profile }) => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(
    profile?.isTwoFactorEnabled || false,
  );

  return (
    <div className={styles.cardSection}>
      {/* Password Change */}
      <div className={styles.securityBlock}>
        <div className={styles.sectionHeader}>
          <h2>Change Password</h2>
          <p>
            Ensure your account is using a long, random password to stay secure.
          </p>
        </div>

        <div className={styles.passwordForm}>
          <div className={styles.inputGroup}>
            <label>Current Password</label>
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
            <label>New Password</label>
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
            <label>Confirm New Password</label>
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
            <button className={styles.btnPrimary}>Update Password</button>
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* Two-Factor Authentication */}
      <div className={styles.securityBlock}>
        <div className={styles.sectionHeader}>
          <h2>Two-Factor Authentication (2FA)</h2>
          <p>Add an extra layer of security to your account.</p>
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
                  <h4>Configure Authenticator</h4>
                  <p>Scan the QR code using Google Authenticator or Authy.</p>
                </div>
              </div>
              <button className={styles.btnOutline}>
                <IoQrCodeOutline className={styles.btnIcon} /> Generate QR Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
