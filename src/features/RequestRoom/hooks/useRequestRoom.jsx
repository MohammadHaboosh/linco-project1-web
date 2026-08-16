import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getUploadUrl,
  getSignatureUploadUrl,
  uploadFileToCloud,
  createRoom,
} from "../api/requestRoomApi";

export const useRequestRoom = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
  const previewsRef = useRef(previews);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(() => {
    return () => {
      Object.values(previewsRef.current).forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name] || errors.submit) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
        submit: null,
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);

      setFormData((prevData) => ({
        ...prevData,
        [name]: file,
      }));

      setPreviews((prev) => {
        if (prev[name]) URL.revokeObjectURL(prev[name]);

        return {
          ...prev,
          [name]: previewUrl,
        };
      });

      if (errors[name] || errors.submit) {
        setErrors((prev) => ({
          ...prev,
          [name]: null,
          submit: null,
        }));
      }
    }
  };

  const clearFile = (name) => {
    setFormData((prev) => ({ ...prev, [name]: null }));
    setPreviews((prev) => {
      if (prev[name]) URL.revokeObjectURL(prev[name]);
      return { ...prev, [name]: null };
    });
  };

  const validateRequest = () => {
    const newErrors = {};
    if (!formData.companyName.trim())
      newErrors.companyName = t("request-workspace-company-name-required");
    if (!formData.description.trim())
      newErrors.description = t("request-workspace-description-required");
    if (!formData.logo)
      newErrors.logo = t("request-workspace-logo-required");
    if (!formData.signature)
      newErrors.signature = t("request-workspace-signature-required");
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
        signatureImagePath: sigData.cdnUrl || sigData.fileKey,
        description: formData.description,
      });

      navigate("/home");
    } catch (error) {
      console.error("Room request error:", error);
      setErrors({
        submit: error.message || t("request-workspace-submit-error"),
      });
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
