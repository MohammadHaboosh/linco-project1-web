import {
  IoDownloadOutline,
  IoShareSocialOutline,
  IoStar,
} from "react-icons/io5";
import styles from "./Certificates.module.css";

const CertificateCard = ({ certificate }) => {
  const studentName = certificate?.studentName || "Ahmad Ali";
  const courseName = certificate?.courseName || "Flutter Advanced Course";
  const issueDate = certificate?.issueDate || "10 August 2026";
  const provider = certificate?.provider || "ABC Academy";
  const logo = certificate?.logo || "/images/linco-logo.png";

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.certificateLayout}>
        <div className={styles.cornerTopLeft}></div>
        <div className={styles.cornerBottomRight}></div>

        <div className={styles.ribbonWrapper}>
          <div className={styles.ribbonFold}></div>
          <div className={styles.ribbonBody}>
            <div className={styles.ribbonInnerBorder}>
              <img src={logo} alt="LinCo" className={styles.ribbonLogo} />
              <span className={styles.ribbonText}>LinCo</span>
            </div>
          </div>
          <div className={styles.ribbonTail}></div>
        </div>

        <div className={styles.providerBoxContainer}>
          <span className={styles.providerLabel}>PROVIDER LOGO</span>
          <div className={styles.providerBox}>
            <img src={logo} alt="Provider" className={styles.providerLogo} />
          </div>
          <span className={styles.goldDiamondTiny}>⬩</span>
        </div>

        <img src={logo} alt="Watermark" className={styles.watermarkBg} />

        <div className={styles.certContent}>
          <div className={styles.headerSection}>
            <div className={styles.titleRow}>
              <span className={styles.goldDiamondLarge}>⬩</span>
              <h1 className={styles.mainTitle}>CERTIFICATE</h1>
              <span className={styles.goldDiamondLarge}>⬩</span>
            </div>
            <div className={styles.subTitleRow}>
              <span className={styles.goldDot}>•</span>
              <h3 className={styles.subTitle}>OF COMPLETION</h3>
              <span className={styles.goldDot}>•</span>
            </div>
          </div>

          <div className={styles.studentSection}>
            <div className={styles.presentedRow}>
              <span className={styles.goldDiamondTiny}>⬩</span>
              <p>THIS CERTIFICATE IS PROUDLY PRESENTED TO</p>
              <span className={styles.goldDiamondTiny}>⬩</span>
            </div>
            <h2 className={styles.studentName}>{studentName}</h2>
          </div>

          <div className={styles.dividerRow}>
            <div className={styles.dividerLine}></div>
            <span className={styles.goldDiamondSmall}>⬩</span>
            <div className={styles.dividerLine}></div>
          </div>

          <div className={styles.courseSection}>
            <p className={styles.kickerText}>
              FOR SUCCESSFULLY COMPLETING THE COURSE
            </p>
            <h3 className={styles.courseName}>{courseName}</h3>
          </div>

          <div className={styles.dividerRow}>
            <div className={styles.dividerLine}></div>
          </div>

          <div className={styles.providerSection}>
            <p className={styles.kickerText}>PROUDLY OFFERED BY</p>
            <h4 className={styles.providerName}>{provider}</h4>
          </div>
        </div>

        <div className={styles.certFooter}>
          <div className={styles.footerColumn}>
            <span className={styles.footerValue}>{issueDate}</span>
            <div className={styles.footerLine}></div>
            <span className={styles.footerLabel}>DATE OF COMPLETION</span>
          </div>

          <div className={styles.sealWrapper}>
            <span className={styles.goldDiamondSmall}>⬩</span>
            <div className={styles.sealOuter}>
              <div className={styles.sealInner}>
                <IoStar className={styles.sealStar} />
              </div>
            </div>
            <span className={styles.goldDiamondSmall}>⬩</span>
          </div>

          <div className={styles.footerColumn}>
            <img src={logo} alt="Signature" className={styles.signatureImg} />
            <div className={styles.footerLine}></div>
            <span className={styles.footerLabel}>SIGNATURE</span>
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
