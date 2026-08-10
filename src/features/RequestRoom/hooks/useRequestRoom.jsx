import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUploadUrl,
  getSignatureUploadUrl,
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
    signature: null,
  });

  const [previews, setPreviews] = useState({
    logo: null,
    signature: null,
  });

  useEffect(() => {
    return () => {
      if (previews.logo) URL.revokeObjectURL(previews.logo);
      if (previews.signature) URL.revokeObjectURL(previews.signature);
    };
  }, [previews]);

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
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];

      setFormData((prevData) => ({
        ...prevData,
        [name]: file,
      }));

      setPreviews((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(file),
      }));

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: null }));
      }
    }
  };

  const clearFile = (name) => {
    setFormData((prev) => ({ ...prev, [name]: null }));
    setPreviews((prev) => ({ ...prev, [name]: null }));
  };

  const validateRequest = () => {
    const newErrors = {};
    if (!formData.companyName)
      newErrors.companyName = "Company Name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.logo) newErrors.logo = "Company logo is required";
    if (!formData.signature)
      newErrors.signature = "Signature image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateRequest()) return;

    setIsSubmitting(true);
    try {
      const { data: logoData } = await getUploadUrl(formData.logo.name);
      await uploadFileToCloud(logoData.uploadUrl, formData.logo);

      const { data: sigData } = await getSignatureUploadUrl(
        formData.signature.name,
      );
      await uploadFileToCloud(sigData.uploadUrl, formData.signature);

      await createRoom({
        name: formData.companyName,
        imagePath: logoData.cdnUrl || logoData.fileKey,
        signaturePath: sigData.cdnUrl || sigData.fileKey,
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
    previews,
    errors,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    clearFile,
    handleSubmit,
  };
};
