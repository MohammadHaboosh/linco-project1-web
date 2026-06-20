import styles from "./PendingInvitations.module.css";
import InvitationCard from "../../../../components/elements/InvitationCard.jsx";

const PendingInvitations = () => {
  // Mock data array
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

  return (
    <div
      className={styles["content-section"]}
      style={{ background: "transparent" }}
    >
      <div className={styles["section-header"]}>
        <h2>New pending Invitations</h2>
        <button className={styles["view-all"]}>View All</button>
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
