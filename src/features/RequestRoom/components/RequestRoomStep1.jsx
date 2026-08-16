import {
  IoBusinessOutline,
  IoCreateOutline,
  IoImageOutline,
  IoInformationCircleOutline,
  IoPencilOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import styles from "./RequestRoom.module.css";

const RequestRoomStep1 = ({
  formData,
  previews,
  onChange,
  onFileChange,
  onClearFile,
  errors,
}) => {
  const { t } = useTranslation();

  const renderUploadBox = ({ name, icon, prompt, label, preview }) => {
    if (preview) {
      return (
        <div className={styles["preview-wrapper"]}>
          <img
            src={preview}
            alt={t("request-workspace-selected-preview", { label })}
            className={styles["preview-img"]}
          />
          <div className={styles["preview-overlay"]}>
            <button
              type="button"
              className={styles["btn-remove"]}
              onClick={() => onClearFile(name)}
              aria-label={t("request-workspace-remove-image", { label })}
            >
              <IoTrashOutline aria-hidden="true" />
              {t("remove")}
            </button>
          </div>
        </div>
      );
    }

    return (
      <label className={styles["upload-box"]}>
        <input
          type="file"
          name={name}
          className={styles["file-input"]}
          accept="image/png,image/jpeg,image/webp"
          onChange={onFileChange}
          aria-label={prompt}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        />
        {icon}
        <span className={styles["upload-text"]}>{prompt}</span>
        <small>{t("request-workspace-image-formats")}</small>
      </label>
    );
  };

  return (
    <>
      <div className={styles["field-block"]}>
        <label className={styles["field-label"]} htmlFor="companyName">
          {t("company-name")}
        </label>
        <div className={styles["input-group"]}>
          <IoBusinessOutline className={styles["icon-left"]} aria-hidden="true" />
          <input
            id="companyName"
            type="text"
            name="companyName"
            placeholder={t("request-workspace-company-name-placeholder")}
            value={formData.companyName}
            onChange={onChange}
            autoComplete="organization"
            aria-invalid={Boolean(errors.companyName)}
            aria-describedby={errors.companyName ? "companyName-error" : undefined}
          />
        </div>
        {errors.companyName && (
          <span id="companyName-error" className={styles["error-text"]}>
            {errors.companyName}
          </span>
        )}
      </div>

      <div className={styles["field-block"]}>
        <label className={styles["field-label"]} htmlFor="description">
          {t("request-workspace-description-label")}
        </label>
        <div className={`${styles["input-group"]} ${styles["textarea-group"]}`}>
          <IoPencilOutline className={styles["icon-left"]} aria-hidden="true" />
          <textarea
            id="description"
            name="description"
            placeholder={t("request-workspace-description-placeholder")}
            value={formData.description}
            onChange={onChange}
            rows="4"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? "description-error" : undefined}
          />
        </div>
        {errors.description && (
          <span id="description-error" className={styles["error-text"]}>
            {errors.description}
          </span>
        )}
      </div>

      <div className={styles["upload-heading"]}>
        <span>{t("request-workspace-brand-assets")}</span>
        <small>{t("request-workspace-brand-assets-description")}</small>
      </div>

      <div className={styles["upload-grid"]}>
        <div className={styles["upload-column"]}>
          <span className={styles["upload-label"]}>
            {t("request-workspace-company-logo")}
          </span>
          {renderUploadBox({
            name: "logo",
            icon: <IoImageOutline className={styles["upload-icon"]} aria-hidden="true" />,
            prompt: t("request-workspace-upload-logo"),
            label: t("request-workspace-company-logo"),
            preview: previews.logo,
          })}
          {errors.logo && (
            <span id="logo-error" className={styles["error-text"]}>
              {errors.logo}
            </span>
          )}
        </div>

        <div className={styles["upload-column"]}>
          <span className={styles["upload-label"]}>
            {t("request-workspace-authorized-signature")}
          </span>
          {renderUploadBox({
            name: "signature",
            icon: <IoCreateOutline className={styles["upload-icon"]} aria-hidden="true" />,
            prompt: t("request-workspace-upload-signature"),
            label: t("request-workspace-authorized-signature"),
            preview: previews.signature,
          })}
          {errors.signature && (
            <span id="signature-error" className={styles["error-text"]}>
              {errors.signature}
            </span>
          )}
        </div>
      </div>

      <div className={styles["form-note"]}>
        <IoInformationCircleOutline aria-hidden="true" />
        <span>{t("request-workspace-review-note")}</span>
      </div>
    </>
  );
};

export default RequestRoomStep1;
