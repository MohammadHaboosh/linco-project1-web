import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useRequestRoom = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
    logo: null,
    plan: "", // No default selection
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      logo: e.target.files[0],
    }));
    if (errors.logo) {
      setErrors((prev) => ({ ...prev, logo: null }));
    }
  };

  const handlePlanSelect = (planName) => {
    setFormData((prevData) => ({
      ...prevData,
      plan: planName,
    }));
    if (errors.plan) {
      setErrors((prev) => ({ ...prev, plan: null }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.companyName)
      newErrors.companyName = "Company Name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.plan) newErrors.plan = "Please select a plan to continue";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step < 2) setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return; // Enforce plan selection

    setIsSubmitting(true);
    try {
      // 1. Send formData to your backend
      // 2. Receive the Stripe Checkout Session URL
      console.log("Sending to backend:", formData);

      // const stripeUrl = await getStripeSessionUrl(formData);
      // window.location.href = stripeUrl; // Redirect to Stripe
    } catch (error) {
      console.error("Room request error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    handlePlanSelect,
    handleNextStep,
    handlePrevStep,
    handleSubmit,
  };
};
