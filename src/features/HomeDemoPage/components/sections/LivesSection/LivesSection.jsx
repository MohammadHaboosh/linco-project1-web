import LiveCard from "../../../../../components/elements/LiveCard/LiveCard";
import styles from "../SharedSection.module.css";

const LivesSection = ({ lives }) => {
  return (
    <>
      <div className={styles["section-header"]}>
        <h2>New Lives</h2>
      </div>

      <div className={styles["cards-grid-2"]}>
        {lives.map((live) => (
          <LiveCard key={live.id} live={live} />
        ))}
      </div>
    </>
  );
};

export default LivesSection;
