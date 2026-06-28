import {
  IoBusinessOutline,
  IoPencilOutline,
  IoImageOutline,
} from "react-icons/io5";
import styles from "./RequestRoom.module.css";

const RequestRoomStep1 = ({ formData, onChange, onFileChange, errors }) => {
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
          placeholder="Description"
          value={formData.description}
          onChange={onChange}
        />
      </div>
      {errors.description && (
        <span className={styles["error-text"]}>{errors.description}</span>
      )}

      <label className={styles["upload-box"]}>
        <input
          type="file"
          name="logo"
          className={styles["file-input"]}
          accept="image/*"
          onChange={onFileChange}
        />
        <IoImageOutline className={styles["upload-icon"]} />
        <span className={styles["upload-text"]}>
          {formData.logo ? formData.logo.name : "Upload your company logo"}
        </span>
      </label>
      {errors.logo && (
        <span className={styles["error-text"]}>{errors.logo}</span>
      )}
    </>
  );
};

export default RequestRoomStep1;
