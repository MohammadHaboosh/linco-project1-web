import {
  IoBusinessOutline,
  IoPencilOutline,
  IoImageOutline,
  IoCreateOutline,
  IoTrashOutline,
} from "react-icons/io5";
import styles from "./RequestRoom.module.css";

const RequestRoomStep1 = ({
  formData,
  previews,
  onChange,
  onFileChange,
  onClearFile,
  errors,
}) => {
  const renderUploadBox = (name, icon, label, preview) => {
    if (preview) {
      return (
        <div className={styles["preview-wrapper"]}>
          <img src={preview} alt={label} className={styles["preview-img"]} />
          <div className={styles["preview-overlay"]}>
            <button
              type="button"
              className={styles["btn-remove"]}
              onClick={(e) => {
                e.preventDefault();
                onClearFile(name);
              }}
            >
              <IoTrashOutline /> Remove
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
          accept="image/*"
          onChange={onFileChange}
        />
        {icon}
        <span className={styles["upload-text"]}>{label}</span>
      </label>
    );
  };

  return (
    <>
      <div className={styles["input-group"]}>
        <IoBusinessOutline className={styles["icon-left"]} />
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={onChange}
        />
      </div>
      {errors.companyName && (
        <span className={styles["error-text"]}>{errors.companyName}</span>
      )}

      <div className={styles["input-group"]}>
        <IoPencilOutline className={styles["icon-left"]} />
        <input
          type="text"
          name="description"
          placeholder="Brief Description"
          value={formData.description}
          onChange={onChange}
        />
      </div>
      {errors.description && (
        <span className={styles["error-text"]}>{errors.description}</span>
      )}

      <div className={styles["upload-grid"]}>
        <div className={styles["upload-column"]}>
          {renderUploadBox(
            "logo",
            <IoImageOutline className={styles["upload-icon"]} />,
            "Upload Logo",
            previews.logo,
          )}
          {errors.logo && (
            <span className={styles["error-text"]}>{errors.logo}</span>
          )}
        </div>

        <div className={styles["upload-column"]}>
          {renderUploadBox(
            "signature",
            <IoCreateOutline className={styles["upload-icon"]} />,
            "Upload Signature",
            previews.signature,
          )}
          {errors.signature && (
            <span className={styles["error-text"]}>{errors.signature}</span>
          )}
        </div>
      </div>
    </>
  );
};

export default RequestRoomStep1;
