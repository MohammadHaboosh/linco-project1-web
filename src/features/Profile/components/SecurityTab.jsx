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
    // Password
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordStatus,
    isUpdatingPassword,
    handleUpdatePassword,
    // 2FA
    is2FAEnabled,
    isSettingUp2FA,
    setIsSettingUp2FA,
    qrCodeData,
    verificationCode,
    setVerificationCode,
    twoFactorMessage,
    isVerifying2FA,
    handleGenerate2FA,
    handleTurnOn2FA,
  } = useProfile();

  return (
    <div className={styles.cardSection}>
      {/* Password Change Section (Unchanged) */}
      <div className={styles.securityBlock}>
        <div className={styles.sectionHeader}>
          <h2>{t("change-password")}</h2>
          <p>
            {t(
              "ensure-your-account-is-using-a-long-random-password-to-stay-secure",
            )}
          </p>
        </div>

        <div className={styles.passwordForm}>
          {passwordStatus.message && (
            <div
              style={{
                padding: "10px",
                borderRadius: "8px",
                backgroundColor:
                  passwordStatus.type === "error" ? "#fee2e2" : "#d1fae5",
                color: passwordStatus.type === "error" ? "#b91c1c" : "#047857",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              {passwordStatus.message}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>{t("current-password")}</label>
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
            <label>{t("new-password")}</label>
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
            <label>{t("confirm-new-password")}</label>
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
              style={{
                opacity: isUpdatingPassword ? 0.7 : 1,
                cursor: isUpdatingPassword ? "not-allowed" : "pointer",
              }}
            >
              {isUpdatingPassword ? "Updating..." : t("update-password")}
            </button>
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* 2FA Section */}
      <div className={styles.securityBlock}>
        <div className={styles.sectionHeader}>
          <h2>{t("two-factor-authentication-2fa")}</h2>
          <p>{t("add-an-extra-layer-of-security-to-your-account")}</p>
        </div>

        <div className={styles.twoFactorContainer}>
          <div className={styles.twoFactorStatus}>
            <div className={styles.statusInfo}>
              <div
                className={`${styles.statusDot} ${
                  is2FAEnabled ? styles.activeDot : ""
                }`}
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
                checked={is2FAEnabled || isSettingUp2FA}
                disabled={is2FAEnabled} 
                onChange={() => {
                  if (!is2FAEnabled && !isSettingUp2FA) {
                    handleGenerate2FA();
                  } else if (isSettingUp2FA) {
                    setIsSettingUp2FA(false);
                  }
                }}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          {twoFactorMessage.message && (
            <div
              style={{
                padding: "10px",
                marginTop: "15px",
                borderRadius: "8px",
                backgroundColor:
                  twoFactorMessage.type === "error" ? "#fee2e2" : "#d1fae5",
                color:
                  twoFactorMessage.type === "error" ? "#b91c1c" : "#047857",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              {twoFactorMessage.message}
            </div>
          )}

          {/* Setup UI */}
          {isSettingUp2FA && !is2FAEnabled && qrCodeData && (
            <div className={styles.qrSetupSection}>
              <div className={styles.qrCodeWrapper}>
                <img
                  src={qrCodeData}
                  alt="2FA QR Code"
                  className={styles.qrImage}
                />
              </div>
              <div className={styles.qrInstructions}>
                <h4>{t("configure-authenticator")}</h4>
                <p>
                  {t("scan-the-qr-code-using-google-authenticator-or-authy")}
                </p>
                <div className={styles.verifyGroup}>
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength="6"
                    className={styles.verifyInput}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <button
                    className={styles.btnPrimary}
                    onClick={handleTurnOn2FA}
                    disabled={isVerifying2FA}
                    style={{
                      opacity: isVerifying2FA ? 0.7 : 1,
                      cursor: isVerifying2FA ? "not-allowed" : "pointer",
                    }}
                  >
                    {isVerifying2FA ? "Verifying..." : "Verify & Enable"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
