import { useState } from "react";
import { registerUser, getUploadUrl, uploadFileToCloud } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/paths";

export const useSignup = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    imagePath: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setServerError("");

    if (errors[name] || errors.passwordMatch) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
        passwordMatch: null,
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      imagePath: e.target.files[0],
    }));
    setServerError("");
    if (errors.imagePath) {
      setErrors((prev) => ({ ...prev, imagePath: null }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!formData.email) newErrors.email = "Email is required";

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Please meet all password requirements.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    }

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.passwordMatch = "Passwords do not match!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.birthDate) newErrors.birthDate = "Date of birth is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.imagePath)
      newErrors.imagePath = "Please upload a profile image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    setServerError("");
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step < 3) setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setServerError("");
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      let finalImagePath = "";

      if (formData.imagePath) {
        // 1. Get the pre-signed URL from the backend
        const { data } = await getUploadUrl(formData.imagePath.name);
        const { uploadUrl, cdnUrl } = data;

        await uploadFileToCloud(uploadUrl, formData.imagePath);

        finalImagePath = cdnUrl;
      }

      await registerUser({
        ...formData,
        imagePath: finalImagePath,
      });

      navigate(PATHS.CHECK_EMAIL, { state: { email: formData.email } });
    } catch (error) {
      console.error("Signup error:", error);

      if (error.message === "Email already exists") {
        setStep(1);
        setErrors((prev) => ({
          ...prev,
          email: "This email is already in use. Please sign in or use another.",
        }));
      } else {
        setServerError(error.message || "Failed to sign up. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    formData,
    errors,
    serverError,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    handleNextStep,
    handlePrevStep,
    handleSubmit,
  };
};
