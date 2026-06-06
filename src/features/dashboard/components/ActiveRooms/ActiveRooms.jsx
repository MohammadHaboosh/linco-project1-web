import { styles } from "./../styles";

const roomsData = [
  {
    id: 1,
    name: "Company Demo Name",
    role: "Trainee",
    date: "12/12/2025",
    users: 120,
  },
  {
    id: 2,
    name: "Company Demo Name",
    role: "Trainee",
    date: "12/12/2025",
    users: 120,
  },
  {
    id: 3,
    name: "Company Demo Name",
    role: "Trainee",
    date: "12/12/2025",
    users: 120,
  },
];

const ActiveRooms = () => {
  return (
    <section>
      <h2 className={styles.sectionTitle}>Recently Active Rooms</h2>
      <div className={styles.roomsGrid}>
        {roomsData.map((room) => (
          <div key={room.id} className={styles.roomCard}>
            <h3 className={styles.roomTitle}>{room.name}</h3>
            <p className={styles.roomText}>Role: {room.role}</p>
            <p className={styles.roomText}>Joined at {room.date}</p>

            <div className={styles.participantsBadge}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              {room.users}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActiveRooms;
