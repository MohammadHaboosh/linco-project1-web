import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signinUser } from "../api/userApi.js";
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

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      const response = await signinUser(formData);

      // Adjust these keys based on what your Nest.js backend actually returns
      const userData = response.user || response.data || response;

      // Store user in Redux global state
      dispatch(setUser(userData));

      // Store JWT token if your backend uses it
      if (response.token || response.accessToken) {
        localStorage.setItem("token", response.token || response.accessToken);
      }

      // Navigate to the main app dashboard
      navigate("/");
    } catch (error) {
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
    handleInputChange,
    handleSubmit,
  };
};
