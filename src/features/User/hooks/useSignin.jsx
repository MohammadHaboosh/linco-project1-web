import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signinUser, resendVerificationEmail } from "../api/userApi.js";
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

      dispatch(setUser(userData));
      navigate("/home");
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
  };
};
