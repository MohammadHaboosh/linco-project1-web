import { useState } from "react";
import { useTranslation } from "react-i18next";
import { departmentApi } from "../../HomeDemoPage/api/departmentApi";

export const useCreateGroup = (demoId, currentUserId, onSuccess) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError(t("group-name-required", "Group name is required"));
      return;
    }
    if (!demoId || !currentUserId) {
      setError(t("missing-data", "Missing required workspace or user data."));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        isGroup: true,
        managerId: currentUserId,
      };

      await departmentApi.createDepartment(demoId, payload);

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(
        err.message || t("group-create-failed", "Failed to create group"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleChange,
    isSubmitting,
    error,
    handleSubmit,
  };
};
