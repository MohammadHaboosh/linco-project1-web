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

        <div className={styles.goldBorderOuter}>
          <div className={styles.goldBorderInner}></div>
        </div>

        <div className={styles.ribbonContainer}>
          <div className={styles.ribbonBody}>
            <img src={logo} alt="Mascot" className={styles.ribbonLogo} />
            <span className={styles.ribbonText}>LinCo</span>
          </div>
          <div className={styles.ribbonTail}></div>
        </div>

        <div className={styles.providerBoxContainer}>
          <span className={styles.providerLabel}>PROVIDER LOGO</span>
          <div className={styles.providerBox}>
            <img src={logo} alt="Provider" className={styles.providerLogo} />
          </div>
          <span className={styles.goldOrnament}>⬩</span>
        </div>

        <img src={logo} alt="" className={styles.watermarkBg} />

        <div className={styles.certContent}>
          <div className={styles.titleSection}>
            <div className={styles.mainTitleRow}>
              <span className={styles.goldOrnament}>⬩</span>
              <h1 className={styles.certMainTitle}>CERTIFICATE</h1>
              <span className={styles.goldOrnament}>⬩</span>
            </div>
            <h3 className={styles.certSubTitle}>• OF COMPLETION •</h3>
          </div>

          <div className={styles.recipientSection}>
            <div className={styles.labelWithOrnaments}>
              <span className={styles.tinyOrnament}>⬩</span>
              <p>THIS CERTIFICATE IS PROUDLY PRESENTED TO</p>
              <span className={styles.tinyOrnament}>⬩</span>
            </div>
            <h2 className={styles.studentName}>{studentName}</h2>
          </div>

          <div className={styles.diamondDivider}>
            <div className={styles.line}></div>
            <span className={styles.diamond}>⬩</span>
            <div className={styles.line}></div>
          </div>

          <div className={styles.courseSection}>
            <p className={styles.reasonLabel}>
              FOR SUCCESSFULLY COMPLETING THE COURSE
            </p>
            <h3 className={styles.courseName}>{courseName}</h3>
          </div>

          <div className={styles.diamondDivider}>
            <div className={styles.line}></div>
          </div>

          <div className={styles.providerSection}>
            <p className={styles.reasonLabel}>PROUDLY OFFERED BY</p>
            <h4 className={styles.providerName}>{provider}</h4>
          </div>
        </div>

        <div className={styles.certFooter}>
          <div className={styles.footerCol}>
            <span className={styles.footerValue}>{issueDate}</span>
            <div className={styles.footerLine}></div>
            <span className={styles.footerLabel}>DATE OF COMPLETION</span>
          </div>

          <div className={styles.footerColCenter}>
            <span className={styles.centerOrnament}>⬩</span>
            <div className={styles.goldSeal}>
              <div className={styles.goldSealInner}>
                <IoStar className={styles.sealStar} />
              </div>
            </div>
            <span className={styles.centerOrnament}>⬩</span>
          </div>

          <div className={styles.footerCol}>
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
