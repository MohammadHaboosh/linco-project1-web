import { useState, useRef } from "react";
import { IoImageOutline, IoDocumentTextOutline } from "react-icons/io5";
import styles from "./Certificates.module.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useTranslation } from "react-i18next";

const CertificateCard = ({ certificate }) => {
  const { t, i18n } = useTranslation();
  const certificateRef = useRef(null);

  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);

  const studentName = certificate?.userName || t("certificate-student-name");
  const courseName = certificate?.courseName || t("certificate-course-name");
  const provider = certificate?.demoName || t("certificate-provider-name");

  const providerLogo = certificate?.logoImagePath || "/images/linco-logo.png";
  const signatureImage = certificate?.signature || "/images/linco-logo.png";
  const safeCourseName = courseName
    .replace(/[<>:"/\\|?*]/g, "_")
    .trim();
  const certificateFileName = `${t("certificate-file-prefix")}_${
    safeCourseName || "course"
  }`;

  const rawDate = certificate?.issuedAt;
  const issueDate = rawDate
    ? new Date(rawDate).toLocaleDateString(i18n.resolvedLanguage, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : t("certificate-issue-date");

  const generateCanvas = async () => {
    return await html2canvas(certificateRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
  };

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;

    setIsDownloadingPDF(true);
    try {
      const canvas = await generateCanvas();
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      pdf.save(`${certificateFileName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(t("certificate-download-failed"));
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!certificateRef.current) return;

    setIsDownloadingImage(true);
    try {
      const canvas = await generateCanvas();
      const imgData = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = imgData;

      link.download = `${certificateFileName}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating Image:", error);
      alert(t("certificate-image-download-failed"));
    } finally {
      setIsDownloadingImage(false);
    }
  };

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.certificateLayout} ref={certificateRef}>
        <img
          src="/images/certificate-template.png"
          alt={t("certificate-template-alt")}
          className={styles.templateBg}
          crossOrigin="anonymous"
        />

        <div className={styles.dynamicProviderLogo}>
          <img
            src={providerLogo}
            alt={t("certificate-provider-logo-alt")}
            crossOrigin="anonymous"
          />
        </div>

        <div className={styles.dynamicStudentName}>{studentName}</div>

        <div className={styles.dynamicCourseName}>{courseName}</div>

        <div className={styles.dynamicProviderName}>{provider}</div>

        <div className={styles.dynamicDate}>{issueDate}</div>

        <div className={styles.dynamicSignature}>
          <img
            src={signatureImage}
            alt={t("certificate-signature-alt")}
            crossOrigin="anonymous"
          />
        </div>
      </div>

      <div className={styles.actionsBar}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={handleDownloadImage}
          disabled={isDownloadingImage || isDownloadingPDF}
        >
          {isDownloadingImage ? (
            t("generating-image")
          ) : (
            <>
              <IoImageOutline size={18} /> {t("download-image")}
            </>
          )}
        </button>

        <button
          type="button"
          className={styles.actionBtnPrimary}
          onClick={handleDownloadPDF}
          disabled={isDownloadingPDF || isDownloadingImage}
        >
          {isDownloadingPDF ? (
            t("generating-pdf")
          ) : (
            <>
              <IoDocumentTextOutline size={18} /> {t("download-pdf")}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CertificateCard;
