import { useScrollReveal } from "../../../../hooks/useScrollReveal";
import stylesLanding from "../../LandingPage.module.css";
import styles from "./TestimonialsSection.module.css";
import placeholderImg from "/public/images/linco-logo.jpg";

const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const testimonials = [
    {
      role: "(HR Director)",
      quote:
        '"LinCo ended the chaos in our onboarding process. The ability to draw customized roadmaps for each department made our employee training faster and much more professional."',
    },
    {
      role: "(Chief Technology Officer)",
      quote:
        '"The XP system and leaderboard completely shifted our company culture. Employees are now passionately competing to finish courses and weekly tasks like never before."',
    },
    {
      role: "(Design Team Lead)",
      quote:
        '"Integrating tools like Figma right into the lessons, alongside real-time chat, transformed theoretical training into instant practical application. A truly comprehensive platform."',
    },
  ];

  return (
    <section className={styles.testimonialsContainer} ref={ref}>
      <div className={`reveal-up ${isVisible ? "reveal-visible" : ""}`}>
        <h2 className={stylesLanding.sectionTitle}>What Our Clients Say</h2>
        <p
          className={stylesLanding.sectionSubtitle}
          style={{ color: "var(--color-linco-blue)", fontWeight: "600" }}
        >
          How We Help Companies Build Exceptional Teams
        </p>

        <div className={styles.grid}>
          {testimonials.map((test, index) => (
            <div
              key={index}
              className={styles.card}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={styles.header}>
                <img
                  src={placeholderImg}
                  alt="Client Avatar"
                  className={styles.avatar}
                />
                <span className={styles.role}>{test.role}</span>
              </div>
              <p className={styles.quote}>{test.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
