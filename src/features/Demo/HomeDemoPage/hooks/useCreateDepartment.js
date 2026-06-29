import { useState, useEffect } from "react";
import { departmentApi } from "../api/departmentApi";

export const useCreateDepartment = (demoId, onSuccess) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(formData);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await departmentApi.searchMembers(demoId, searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, demoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Department title is required.");
      return;
    }
    if (!selectedUser) {
      setError("Please select a manager/member from the search.");
      return;
    }
    if (!demoId) {
      setError("Demo ID is missing.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.title,
        description: formData.description,
        managerId: selectedUser.id,
      };

      await departmentApi.createDepartment(demoId, payload);

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(
        err.message || "An error occurred while creating the department.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleChange,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    selectedUser,
    setSelectedUser,
    isSubmitting,
    error,
    handleSubmit,
  };
};
