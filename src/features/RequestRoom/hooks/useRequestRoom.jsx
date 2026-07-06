import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUploadUrl,
  uploadFileToCloud,
  createRoom,
} from "../api/requestRoomApi";

export const useRequestRoom = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
    logo: null,
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

  const validateRequest = () => {
    const newErrors = {};
    if (!formData.companyName)
      newErrors.companyName = "Company Name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.logo) newErrors.logo = "Company logo is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateRequest()) return;

    setIsSubmitting(true);
    try {
      const { data } = await getUploadUrl(formData.logo.name);
      const { uploadUrl, cdnUrl } = data;
      
      await uploadFileToCloud(uploadUrl, formData.logo);
      
      await createRoom({
        name: formData.companyName,
        imagePath: cdnUrl,
        description: formData.description,
      });

      navigate("/home");
    } catch (error) {
      console.error("Room request error:", error);
      setErrors({ submit: error.message || "An error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    handleSubmit,
  };
};
