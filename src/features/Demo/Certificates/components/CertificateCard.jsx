import {
  IoDownloadOutline,
  IoShareSocialOutline,
  IoRibbon,
} from "react-icons/io5";
import styles from "./Certificates.module.css";

const CertificateCard = ({ certificate }) => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.certificateLayout}>
        <div className={styles.premiumOuterFrame}>
          <div className={styles.premiumInnerFrame}>
            <div className={`${styles.goldCorner} ${styles.tl}`}></div>
            <div className={`${styles.goldCorner} ${styles.tr}`}></div>
            <div className={`${styles.goldCorner} ${styles.bl}`}></div>
            <div className={`${styles.goldCorner} ${styles.br}`}></div>

            <div className={styles.watermark}>LinCo</div>

            <div className={styles.certSeal}>
              <IoRibbon className={styles.sealIcon} />
              <span>Certified</span>
            </div>

            <div className={styles.certHeader}>
              <img
                src={certificate.logo}
                alt="LinCo Logo"
                className={styles.certLogo}
              />
              <h4 className={styles.certTitle}>Certificate of Completion</h4>
            </div>

            <div className={styles.certBody}>
              <span className={styles.presentedTo}>
                This is proudly presented to
              </span>
              <h2 className={styles.studentName}>{certificate.studentName}</h2>
              <span className={styles.forCompletion}>
                for successfully mastering the curriculum of
              </span>
              <h3 className={styles.courseName}>{certificate.courseName}</h3>
            </div>

            <div className={styles.certFooter}>
              <div className={styles.footerCol}>
                <span className={styles.colValue}>{certificate.issueDate}</span>
                <div className={styles.colLine}></div>
                <span className={styles.colLabel}>Date Issued</span>
              </div>

              <div className={styles.footerCol}>
                <span className={styles.certId}>
                  ID: {certificate.credentialId}
                </span>
              </div>

              <div className={styles.footerCol}>
                <span className={styles.signatureFont}>
                  {certificate.instructor}
                </span>
                <div className={styles.colLine}></div>
                <span className={styles.colLabel}>Lead Instructor</span>
              </div>
            </div>
          </div>
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
