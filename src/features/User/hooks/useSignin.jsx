import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signinUser,
  resendVerificationEmail,
  verifyTwoFactorSignin,
} from "../api/userApi.js";
import { setUser } from "../store/userSlice.js";

export const useSignin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [tempUserData, setTempUserData] = useState(null);

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
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
        text: "Verification email sent successfully! Please check your inbox.",
      });
    } catch (error) {
      setResendMessage({
        type: "error",
        text: error.message || "Failed to resend email. Please try again.",
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
      const userData = response?.data?.user;

      if (userData?.isTwoFactorEnabled) {
        setRequires2FA(true);
        setTempUserData(userData);
      } else {
        dispatch(setUser(userData));
        navigate("/home");
      }
    } catch (error) {
      if (error.code === "EmailNotVerifiedException") {
        setIsUnverified(true);
      }
      setServerError(
        error.message || "Failed to sign in. Please check your credentials.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTwoFactorSubmit = async () => {
    if (!twoFactorCode || twoFactorCode.length < 6) {
      setServerError("Please enter a valid 6-digit code.");
      return;
    }

    setIsSubmitting(true);
    setServerError("");

    try {
      await verifyTwoFactorSignin(twoFactorCode);

      dispatch(setUser(tempUserData));
      navigate("/home");
    } catch (error) {
      setServerError(error.message || "Invalid 2FA code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancel2FA = () => {
    setRequires2FA(false);
    setTwoFactorCode("");
    setTempUserData(null);
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
    requires2FA,
    twoFactorCode,
    setTwoFactorCode,
    handleTwoFactorSubmit,
    cancel2FA,
  };
};
