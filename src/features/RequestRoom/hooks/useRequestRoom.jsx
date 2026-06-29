import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUploadUrl,
  uploadFileToCloud,
  createRoom,
} from "../api/requestRoomApi";

export const useRequestRoom = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
    logo: null,
    plan: "", 
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
    if (!formData.logo) newErrors.logo = "Company logo is required";
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
    if (!validateStep2()) return;

    setIsSubmitting(true);
    try {
      // 1. Get URL and fields
      const { data } = await getUploadUrl(formData.logo.name);
      const { uploadUrl, fields, cdnUrl } = data;
      console.log("Upload URL:", uploadUrl);
      console.log("Fields:", fields);
      console.log("CDN URL:", cdnUrl);
      // 2. Upload to Cloud
      await uploadFileToCloud(uploadUrl, fields, formData.logo);
      console.log("File uploaded successfully");
      // 3. Final submission
      await createRoom({
        name: formData.companyName,
        description: formData.description,
        plan: formData.plan,
        imagePath: cdnUrl,
      });

      console.log("Room created successfully");
      navigate("/home");
    } catch (error) {
      console.error("Room request error:", error);
      setErrors({ plan: error.message || "An error occurred." });
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
