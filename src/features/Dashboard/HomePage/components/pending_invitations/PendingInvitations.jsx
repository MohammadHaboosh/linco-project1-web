import styles from "./PendingInvitations.module.css";
import InvitationCard from "../../../../../components/elements/InvitationCard/InvitationCard.jsx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../../../routes/paths.js";

const PendingInvitations = () => {
  const navigate = useNavigate();
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
        <button
          className={styles["view-all"]}
          onClick={() => navigate(PATHS.PENDING_INVITATIONS)}
        >
          {t("view-all-pending-invitations")}
        </button>
      </div>

      <div className={styles["list-container"]}>
        {invitations.map((inv) => (
          <InvitationCard key={inv.id} invitation={inv} compact={true} />
        ))}
      </div>
    </div>
  );
};

export default PendingInvitations;
