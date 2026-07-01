import styles from "./PendingInvitations.module.css";
import InvitationCard from "../../../../../components/elements/InvitationCard/InvitationCard.jsx";
import { useTranslation } from "react-i18next";

const PendingInvitations = () => {
  const invitations = [
    {
      id: 1,
      company: "Company name",
      caller: "Name of the caller",
      role: "As a trainee",
      time: "13:40 pm",
    },
    {
      id: 2,
      company: "Company name",
      caller: "Name of the caller",
      role: "As a trainee",
      time: "13:40 pm",
    },
    {
      id: 3,
      company: "Company name",
      caller: "Name of the caller",
      role: "As a trainee",
      time: "13:40 pm",
    },
  ];
  const { t } = useTranslation();

  return (
    <div
      className={styles["content-section"]}
      style={{ background: "transparent" }}
    >
      <div className={styles["section-header"]}>
        <h2>{t("new-pending-invitations")}</h2>
        <button className={styles["view-all"]}>{t('view-all-pending-invitations')}</button>
      </div>

      <div className={styles["list-container"]}>
        {invitations.map((inv) => (
          <InvitationCard key={inv.id} invitation={inv} />
        ))}
      </div>
    </div>
  );
};

export default PendingInvitations;
