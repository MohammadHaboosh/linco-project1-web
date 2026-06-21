import { IoPerson, IoArrowBackOutline } from "react-icons/io5";
import styles from "./Signup.module.css";

const SignupStep3 = ({ formData, onFileChange, onBack, errors }) => {
  return (
    <>
      <label className={styles["upload-box"]}>
        <input
          type="file"
          name="imagePath"
          className={styles["file-input"]}
          accept="image/*"
          onChange={onFileChange}
        />
        <IoPerson className={styles["upload-icon"]} />
        <span className={styles["upload-text"]}>
          {formData.imagePath
            ? formData.imagePath.name
            : "Upload a profile image"}
        </span>
      </label>
      {errors.imagePath && (
        <span
          className={styles["error-text"]}
          style={{ textAlign: "center", width: "100%" }}
        >
          {errors.imagePath}
        </span>
      )}

      <hr className={styles["thin-divider"]} />

      <button
        type="button"
        className={styles["btn-back-link"]}
        onClick={onBack}
      >
        <IoArrowBackOutline className={styles["back-icon"]} />
        Back to edit
      </button>
    </>
  );
};

export default SignupStep3;
