import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { useScrollReveal } from "../../../../hooks/useScrollReveal";
import stylesLanding from "../../LandingPage.module.css";
import styles from "./FAQSection.module.css";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.faqItem}>
      <div className={styles.faqHeader} onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <IoChevronDown
          className={`${styles.faqIcon} ${isOpen ? styles.open : ""}`}
        />
      </div>
      {isOpen && <div className={styles.faqBody}>{answer}</div>}
    </div>
  );
};

const FAQSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const faqs = [
    {
      q: "How can I create a workspace for my company?",
      a: "Simply sign up, navigate to your dashboard, and click 'Create Workspace'. You can then invite your team members.",
    },
    {
      q: "Can I customize permissions for each employee?",
      a: "Yes, LinCo provides granular role-based access control for trainees, managers, and admins.",
    },
    {
      q: "Can we use the platform to train teams from different disciplines?",
      a: "Absolutely. You can create specialized departments (e.g., Front-End, HR, Sales) each with its own roadmap.",
    },
  ];

  return (
    <section className={styles.faqContainer} id="faq" ref={ref}>
      <div className={`reveal-up ${isVisible ? "reveal-visible" : ""}`}>
        <h2 className={stylesLanding.sectionTitle}>FAQs</h2>

        <div className={styles.faqWrapper}>
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
