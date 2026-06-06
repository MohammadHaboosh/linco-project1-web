import { styles } from "./../styles";

const invitationsData = [
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
  {
    id: 4,
    company: "Company name",
    caller: "Name of the caller",
    role: "As a trainee",
    time: "13:40 pm",
  },
];

const PendingInvitations = () => {
  return (
    <section>
      <h2 className={styles.sectionTitle}>New pending Invitations</h2>
      <div className="flex flex-col gap-1">
        {invitationsData.map((inv) => (
          <div key={inv.id} className={styles.invitationRow}>
            <span className={styles.invitationText}>{inv.company}</span>
            <span className={styles.invitationText}>{inv.caller}</span>
            <span className={styles.invitationText}>{inv.role}</span>
            <span className={styles.invitationText}>{inv.time}</span>
            <div className="flex gap-2">
              <button className={styles.actionBtn}>Accept</button>
              <button className={styles.actionBtn}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PendingInvitations;
