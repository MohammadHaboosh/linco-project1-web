import { useCallback, useEffect, useState } from "react";
import { departmentApi } from "../api/departmentApi";

const SEARCH_DEBOUNCE_MS = 300;

export const useCreateDepartment = (demoId, onSuccess) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery || selectedUser) {
      return undefined;
    }

    const controller = new AbortController();

    const delayDebounceFn = setTimeout(async () => {
      try {
        const results = await departmentApi.searchMembers(
          demoId,
          normalizedQuery,
          { signal: controller.signal },
        );

        if (!controller.signal.aborted) {
          setSearchResults(results);
        }
      } catch (err) {
        if (err.name === "AbortError") return;

        if (!controller.signal.aborted) {
          setSearchResults([]);
          setSearchError(err.message || "Failed to search members.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [demoId, searchQuery, selectedUser]);

  const updateSearchQuery = useCallback((value) => {
    const nextQuery = String(value ?? "");

    setSearchQuery(nextQuery);
    setSearchResults([]);
    setSearchError(null);
    setIsSearching(Boolean(nextQuery.trim()));
  }, []);

  const selectUser = useCallback((user) => {
    setSelectedUser(user);
    setSearchQuery("");
    setSearchResults([]);
    setSearchError(null);
    setIsSearching(false);
  }, []);

  const clearSelectedUser = useCallback(() => {
    setSelectedUser(null);
    setSearchQuery("");
    setSearchResults([]);
    setSearchError(null);
    setIsSearching(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!formData.name.trim()) {
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
        name: formData.name,
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
    setSearchQuery: updateSearchQuery,
    searchResults,
    isSearching,
    searchError,
    selectedUser,
    selectUser,
    clearSelectedUser,
    isSubmitting,
    error,
    handleSubmit,
  };
};
