import { IoDownloadOutline, IoShareSocialOutline } from "react-icons/io5";
import styles from "./Certificates.module.css";

const CertificateCard = ({ certificate }) => {
  const studentName = certificate?.studentName || "Ahmad Ali";
  const courseName = certificate?.courseName || "Flutter Advanced Course";
  const issueDate = certificate?.issueDate || "10 August 2026";
  const provider = certificate?.provider || "ABC Academy";

  const providerLogo = certificate?.logo || "/images/linco-logo.png";
  const signatureImage = "/images/linco-logo.png";

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.certificateLayout}>
        <img
          src="/images/certificate-template.png"
          alt="Certificate Template"
          className={styles.templateBg}
        />

        <div className={styles.dynamicProviderLogo}>
          <img src={providerLogo} alt="Provider Logo" />
        </div>

        <div className={styles.dynamicStudentName}>{studentName}</div>

        <div className={styles.dynamicCourseName}>{courseName}</div>

        <div className={styles.dynamicProviderName}>{provider}</div>

        <div className={styles.dynamicDate}>{issueDate}</div>

        <div className={styles.dynamicSignature}>
          <img src={signatureImage} alt="Signature" />
        </div>
      </div>

      <div className={styles.actionsBar}>
        <button className={styles.actionBtn}>
          <IoDownloadOutline /> Download PDF
        </button>
        <button className={styles.actionBtnPrimary}>
          <IoShareSocialOutline /> Add to Profile
        </button>
      </div>
    </div>
  );
};

export default CertificateCard;
