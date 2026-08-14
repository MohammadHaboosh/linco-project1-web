import { useState, useRef } from "react";
import { IoImageOutline, IoDocumentTextOutline } from "react-icons/io5";
import styles from "./Certificates.module.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CertificateCard = ({ certificate }) => {
  const certificateRef = useRef(null);

  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);

  const studentName = certificate?.userName || "Student Name";
  const courseName = certificate?.courseName || "Course Name";
  const provider = certificate?.demoName || "Provider Name";

  const providerLogo = certificate?.logoImagePath || "/images/linco-logo.png";
  const signatureImage = certificate?.signature || "/images/linco-logo.png";

  const rawDate = certificate?.issuedAt;
  const issueDate = rawDate
    ? new Date(rawDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Issue Date";

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

      const safeCourseName = courseName.replace(/[^a-zA-Z0-9]/g, "_");
      pdf.save(`Certificate_${safeCourseName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download the certificate. Please try again.");
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

      const safeCourseName = courseName.replace(/[^a-zA-Z0-9]/g, "_");
      link.download = `Certificate_${safeCourseName}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating Image:", error);
      alert("Failed to download the image. Please try again.");
    } finally {
      setIsDownloadingImage(false);
    }
  };

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.certificateLayout} ref={certificateRef}>
        <img
          src="/images/certificate-template.png"
          alt="Certificate Template"
          className={styles.templateBg}
          crossOrigin="anonymous"
        />

        <div className={styles.dynamicProviderLogo}>
          <img src={providerLogo} alt="Provider Logo" crossOrigin="anonymous" />
        </div>

        <div className={styles.dynamicStudentName}>{studentName}</div>

        <div className={styles.dynamicCourseName}>{courseName}</div>

        <div className={styles.dynamicProviderName}>{provider}</div>

        <div className={styles.dynamicDate}>{issueDate}</div>

        <div className={styles.dynamicSignature}>
          <img src={signatureImage} alt="Signature" crossOrigin="anonymous" />
        </div>
      </div>

      <div className={styles.actionsBar}>
        <button
          className={styles.actionBtn}
          onClick={handleDownloadImage}
          disabled={isDownloadingImage || isDownloadingPDF}
        >
          {isDownloadingImage ? (
            "Generating Image..."
          ) : (
            <>
              <IoImageOutline size={18} /> Download Image
            </>
          )}
        </button>

        <button
          className={styles.actionBtnPrimary}
          onClick={handleDownloadPDF}
          disabled={isDownloadingPDF || isDownloadingImage}
        >
          {isDownloadingPDF ? (
            "Generating PDF..."
          ) : (
            <>
              <IoDocumentTextOutline size={18} /> Download PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CertificateCard;
