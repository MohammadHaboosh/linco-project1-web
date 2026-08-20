import { IoPersonOutline, IoArrowBackOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import DatePicker from "../../../../components/form/DatePicker/DatePicker.jsx";
import styles from "./Signup.module.css";

const SignupStep2 = ({ formData, onChange, onBack, errors }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles["input-group"]}>
        <IoPersonOutline className={styles["icon-left"]} />
        <input
          type="text"
          name="firstName"
          placeholder={t("first-name")}
          value={formData.firstName}
          onChange={onChange}
          autoComplete="given-name"
        />
      </div>
      {errors.firstName && (
        <span className={styles["error-text"]}>{errors.firstName}</span>
      )}

      <div className={styles["input-group"]}>
        <IoPersonOutline className={styles["icon-left"]} />
        <input
          type="text"
          name="lastName"
          placeholder={t("last-name")}
          value={formData.lastName}
          onChange={onChange}
          autoComplete="family-name"
        />
      </div>
      {errors.lastName && (
        <span className={styles["error-text"]}>{errors.lastName}</span>
      )}

      <div className={styles["input-group"]}>
        <IoPersonOutline className={styles["icon-left"]} />
        <DatePicker
          name="birthDate" // Updated name
          placeholder={t("date-of-birth")}
          value={formData.birthDate} // Updated value
          onChange={onChange}
        />
      </div>
      {errors.birthDate && (
        <span className={styles["error-text"]}>{errors.birthDate}</span>
      )}

      <hr className={styles["thin-divider"]} />

      <button
        type="button"
        className={styles["btn-back-link"]}
        onClick={onBack}
      >
        <IoArrowBackOutline className={styles["back-icon"]} />
        {t("auth-register-with-another-email")}
      </button>
    </>
  );
};

export default SignupStep2;
