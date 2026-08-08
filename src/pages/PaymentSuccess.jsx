import { useNavigate } from "react-router-dom";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { usePaymentStatus } from "../../hooks/usePaymentStatus";
import { useTranslation } from "react-i18next";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ملاحظة هامة: يجب أن تحصل على demoId هنا.
  // إما من (localStorage) أو (Context/Redux) الخاص ببيانات المستخدم الحالي
  const demoId = localStorage.getItem("currentDemoId");

  const { statusData, isLoading, error, sessionId } = usePaymentStatus(demoId);

  // إذا لم يكن هناك session_id في الرابط
  if (!sessionId) {
    return (
      <div style={{ textAlign: "center", padding: "50px", marginTop: "100px" }}>
        <h2>Invalid Request</h2>
        <p>No session ID found in the URL.</p>
        <button onClick={() => navigate("/")}>Go to Home</button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
          padding: "40px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        {isLoading ? (
          <div>
            <h2 style={{ color: "#0a2a54" }}>جاري تأكيد الدفع...</h2>
            <p style={{ color: "#64748b", marginTop: "10px" }}>
              يرجى الانتظار، لا تقم بإغلاق أو تحديث هذه الصفحة.
            </p>
          </div>
        ) : error ? (
          <div>
            <IoCloseCircle
              size={70}
              color="#dc2626"
              style={{ marginBottom: "15px" }}
            />
            <h2 style={{ color: "#dc2626" }}>عذراً، حدث خطأ</h2>
            <p style={{ color: "#475569", marginTop: "10px" }}>{error}</p>
            <button
              onClick={() => navigate("/library")}
              style={{
                marginTop: "25px",
                padding: "10px 24px",
                backgroundColor: "#f1f5f9",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              العودة للمكتبة
            </button>
          </div>
        ) : statusData?.paymentStatus === "paid" ? (
          <div>
            <IoCheckmarkCircle
              size={70}
              color="#10b981"
              style={{ marginBottom: "15px" }}
            />
            <h2 style={{ color: "#10b981" }}>تم الدفع بنجاح!</h2>
            <p style={{ color: "#475569", marginTop: "10px" }}>
              شكراً لك! تم شراء الكورس بنجاح.
            </p>

            <div
              style={{
                marginTop: "25px",
                padding: "20px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                textAlign: "left",
                border: "1px solid #e2e8f0",
              }}
            >
              <p style={{ margin: "5px 0" }}>
                <strong>المبلغ:</strong> ${statusData.amountTotal}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>الإيميل:</strong> {statusData.customerEmail}
              </p>
            </div>

            <button
              onClick={() => navigate(`/dashboard`)} // توجيه المستخدم للكورسات الخاصة به
              style={{
                marginTop: "30px",
                padding: "12px 24px",
                backgroundColor: "#0a2a54",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              الذهاب إلى كورساتي
            </button>
          </div>
        ) : (
          <div>
            <h2 style={{ color: "#f59e0b" }}>عملية الدفع معلقة</h2>
            <p style={{ color: "#475569", marginTop: "10px" }}>
              لم تكتمل العملية بعد، يرجى مراجعة حسابك لاحقاً.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
