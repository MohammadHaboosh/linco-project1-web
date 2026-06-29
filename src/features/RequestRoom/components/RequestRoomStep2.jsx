import { useTranslation } from "react-i18next";
import styles from "./RequestRoom.module.css";

const RequestRoomStep2 = ({ formData, onPlanSelect, errors }) => {
  const { t } = useTranslation();
  const plans = [
    {
      name: "STARTER",
      displayName: "Starter",
      price: "20$ /mo",
      details: "Up to 20 members, 5 sections",
    },
    {
      name: "PRO",
      displayName: "Pro",
      price: "100$ /mo",
      details: "Up to 100 members, unlimited sections",
    },
    {
      name: "ENTERPRISE",
      displayName: "Enterprise",
      price: "200$ /mo",
      details: "Unlimited members and sections",
    },
  ];

  return (
    <div className={styles["plans-container"]}>
      <h3 className={styles["step-heading"]}>{t("choose-plan")}</h3>

      {errors.plan && (
        <div
          className={styles["server-error-banner"]}
          style={{ marginBottom: "15px" }}
        >
          {errors.plan}
        </div>
      )}

      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`${styles["plan-card"]} ${formData.plan === plan.name ? styles["plan-active"] : ""}`}
          onClick={() => onPlanSelect(plan.name)}
        >
          <div className={styles["plan-info"]}>
            <h4>{plan.displayName}</h4>
            <p>{plan.details}</p>
          </div>
          <div className={styles["plan-price"]}>{plan.price}</div>
        </div>
      ))}
    </div>
  );
};

export default RequestRoomStep2;
