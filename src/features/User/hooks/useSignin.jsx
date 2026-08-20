import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  signinUser,
  resendVerificationEmail,
  verify2FASignin,
} from "../api/userApi.js";
import { setUser } from "../store/userSlice.js";

export const useSignin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isUnverified, setIsUnverified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState({ type: "", text: "" });

  // 2FA States
  const [is2FAStep, setIs2FAStep] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    setServerError("");
    setIsUnverified(false);
    setResendMessage({ type: "", text: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = t("auth-email-required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("auth-valid-email-required");
    }

    if (!formData.password) {
      newErrors.password = t("auth-password-required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResendVerification = async () => {
    if (!formData.email) return;

    setIsResending(true);
    setResendMessage({ type: "", text: "" });

    try {
      await resendVerificationEmail(formData.email);
      setResendMessage({
        type: "success",
        text: t("auth-verification-email-sent"),
      });
    } catch (error) {
      setResendMessage({
        type: "error",
        text: error.message || t("auth-resend-email-failed"),
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setServerError("");
    setIsUnverified(false);
    setResendMessage({ type: "", text: "" });

    try {
      const response = await signinUser(formData);

      if (response?.data?.requires2FA) {
        setTwoFactorToken(response.data.twoFactorToken);
        setIs2FAStep(true);
        return; 
      }

      const userData = response?.data?.user;
      dispatch(setUser(userData));
      navigate("/home");
    } catch (error) {
      if (error.code === "EmailNotVerifiedException") {
        setIsUnverified(true);
      }
      setServerError(
        error.message || t("auth-signin-failed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify2FA = async (e) => {
    if (e) e.preventDefault();

    if (!twoFactorCode || twoFactorCode.length < 6) {
      setTwoFactorError(t("auth-valid-six-digit-code-required"));
      return;
    }

    setIsVerifying2FA(true);
    setTwoFactorError("");

    try {
      const response = await verify2FASignin(twoFactorToken, twoFactorCode);
      const userData = response?.data?.user;
      dispatch(setUser(userData));
      navigate("/home");
    } catch (error) {
      setTwoFactorError(error.message || t("auth-invalid-authentication-code"));
    } finally {
      setIsVerifying2FA(false);
    }
  };

  return {
    formData,
    errors,
    serverError,
    isSubmitting,
    isUnverified,
    isResending,
    resendMessage,
    handleInputChange,
    handleSubmit,
    handleResendVerification,
    // 2FA Exports
    is2FAStep,
    setIs2FAStep,
    twoFactorCode,
    setTwoFactorCode,
    isVerifying2FA,
    twoFactorError,
    handleVerify2FA,
  };
};
