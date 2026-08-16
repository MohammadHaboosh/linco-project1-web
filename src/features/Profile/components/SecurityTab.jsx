import { IoLockClosedOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useProfile } from "../hooks/useProfile.jsx";
import styles from "./ProfileContent.module.css";

const SecurityTab = () => {
  const { t } = useTranslation();
  const {
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordStatus,
    isUpdatingPassword,
    handleUpdatePassword,
    is2FAEnabled,
    isSettingUp2FA,
    isGenerating2FA,
    qrCodeData,
    verificationCode,
    setVerificationCode,
    twoFactorMessage,
    isVerifying2FA,
    handleGenerate2FA,
    handleCancel2FASetup,
    handleTurnOn2FA,
  } = useProfile();

  const authenticatorToggleLabel = is2FAEnabled
    ? t("profile-authenticator-enabled-label")
    : isSettingUp2FA
      ? t("profile-cancel-authenticator-setup")
      : t("profile-enable-authenticator-app");

  const submitPassword = (event) => {
    event.preventDefault();
    handleUpdatePassword();
  };

  const submitVerificationCode = (event) => {
    event.preventDefault();
    handleTurnOn2FA();
  };

  return (
    <section
      className={styles.cardSection}
      aria-labelledby="security-settings-heading"
    >
      <div className={styles.securityBlock}>
        <div className={styles.sectionHeader}>
          <h2 id="security-settings-heading">{t("change-password")}</h2>
          <p>
            {t(
              "ensure-your-account-is-using-a-long-random-password-to-stay-secure",
            )}
          </p>
        </div>

        <form className={styles.passwordForm} onSubmit={submitPassword}>
          {passwordStatus.message && (
            <div
              className={`${styles.statusMessage} ${
                passwordStatus.type === "error"
                  ? styles.errorMessage
                  : styles.successMessage
              }`}
              role={passwordStatus.type === "error" ? "alert" : "status"}
            >
              {t(passwordStatus.message)}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="profile-current-password">
              {t("current-password")}
            </label>
            <div className={styles.inputWrapper}>
              <IoLockClosedOutline
                className={styles.inputIcon}
                aria-hidden="true"
              />
              <input
                id="profile-current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                placeholder={t("enter-current-password")}
                className={styles.input}
                value={oldPassword}
                onChange={(event) => setOldPassword(event.target.value)}
                disabled={isUpdatingPassword}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="profile-new-password">{t("new-password")}</label>
            <div className={styles.inputWrapper}>
              <IoLockClosedOutline
                className={styles.inputIcon}
                aria-hidden="true"
              />
              <input
                id="profile-new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                placeholder={t("enter-new-password")}
                className={styles.input}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                disabled={isUpdatingPassword}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="profile-confirm-password">
              {t("confirm-new-password")}
            </label>
            <div className={styles.inputWrapper}>
              <IoLockClosedOutline
                className={styles.inputIcon}
                aria-hidden="true"
              />
              <input
                id="profile-confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder={t("confirm-your-new-password")}
                className={styles.input}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={isUpdatingPassword}
              />
            </div>
          </div>
          <div className={styles.actionRow}>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={isUpdatingPassword}
              aria-busy={isUpdatingPassword}
            >
              {isUpdatingPassword
                ? t("profile-updating-password")
                : t("update-password")}
            </button>
          </div>
        </form>
      </div>

      <hr className={styles.divider} />

      <div className={styles.securityBlock}>
        <div className={styles.sectionHeader}>
          <h2>{t("two-factor-authentication-2fa")}</h2>
          <p>{t("add-an-extra-layer-of-security-to-your-account")}</p>
        </div>

        <div className={styles.twoFactorContainer}>
          <div className={styles.twoFactorStatus}>
            <div className={styles.statusInfo}>
              <span
                className={`${styles.statusDot} ${
                  is2FAEnabled ? styles.activeDot : ""
                }`}
                aria-hidden="true"
              />
              <div className={styles.statusCopy}>
                <h3 id="authenticator-app-heading">
                  {t("authenticator-app")}
                </h3>
                <p id="authenticator-app-description">
                  {is2FAEnabled
                    ? t("profile-2fa-currently-enabled")
                    : t("profile-2fa-totp-description")}
                </p>
              </div>
            </div>

            <label className={styles.switch}>
              <span className={styles.srOnly}>{authenticatorToggleLabel}</span>
              <input
                type="checkbox"
                checked={is2FAEnabled || isSettingUp2FA}
                disabled={is2FAEnabled || isGenerating2FA}
                aria-describedby="authenticator-app-description"
                aria-busy={isGenerating2FA}
                onChange={() => {
                  if (!is2FAEnabled && !isSettingUp2FA) {
                    handleGenerate2FA();
                  } else if (isSettingUp2FA) {
                    handleCancel2FASetup();
                  }
                }}
              />
              <span className={styles.slider} aria-hidden="true" />
            </label>
          </div>

          {isGenerating2FA && (
            <div className={styles.inlineProgress} role="status">
              <span className={styles.smallSpinner} aria-hidden="true" />
              {t("profile-generating-authenticator-code")}
            </div>
          )}

          {twoFactorMessage.message && (
            <div
              className={`${styles.statusMessage} ${styles.twoFactorMessage} ${
                twoFactorMessage.type === "error"
                  ? styles.errorMessage
                  : styles.successMessage
              }`}
              role={twoFactorMessage.type === "error" ? "alert" : "status"}
            >
              {t(twoFactorMessage.message)}
            </div>
          )}

          {isSettingUp2FA && !is2FAEnabled && qrCodeData && (
            <div className={styles.qrSetupSection}>
              <div className={styles.qrCodeWrapper}>
                <img
                  src={qrCodeData}
                  alt={t("profile-2fa-qr-code-alt")}
                  className={styles.qrImage}
                />
              </div>
              <div className={styles.qrInstructions}>
                <h4>{t("configure-authenticator")}</h4>
                <p>
                  {t("scan-the-qr-code-using-google-authenticator-or-authy")}
                </p>
                <form
                  className={styles.verificationForm}
                  onSubmit={submitVerificationCode}
                >
                  <label
                    className={styles.verificationLabel}
                    htmlFor="profile-verification-code"
                  >
                    {t("verification-code")}
                  </label>
                  <div className={styles.verifyGroup}>
                    <input
                      id="profile-verification-code"
                      name="verificationCode"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]*"
                      placeholder="000000"
                      maxLength={6}
                      dir="ltr"
                      className={styles.verifyInput}
                      value={verificationCode}
                      onChange={(event) =>
                        setVerificationCode(
                          event.target.value.replace(/\D/g, ""),
                        )
                      }
                      disabled={isVerifying2FA}
                    />
                    <button
                      type="submit"
                      className={styles.btnPrimary}
                      disabled={isVerifying2FA}
                      aria-busy={isVerifying2FA}
                    >
                      {isVerifying2FA
                        ? t("profile-verifying-authenticator-code")
                        : t("verify-and-enable")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SecurityTab;
