import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { departmentApi } from "../../HomeDemoPage/api/departmentApi";
import { departmentMemberApi } from "../../DepartmentMembers/api/departmentMemberApi";

const SEARCH_DEBOUNCE_MS = 300;

export const useCreateGroup = (demoId, currentUserId, onSuccess) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: "", description: "" });

  const [selectedMembers, setSelectedMembers] = useState([]);
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
    if (!normalizedQuery) return undefined;

    const controller = new AbortController();
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const responseData = await departmentMemberApi.searchDemoMembers(
          demoId,
          normalizedQuery,
          { signal: controller.signal },
        );

        if (!controller.signal.aborted) {
          const filteredResults = responseData.data.filter(
            (member) => !selectedMembers.find((m) => m.id === member.id),
          );
          setSearchResults(filteredResults);
          setSearchError(null);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        if (!controller.signal.aborted) {
          setSearchResults([]);
          setSearchError(t("member-search-failed"));
        }
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [demoId, searchQuery, selectedMembers, t]);

  const updateSearchQuery = useCallback((value) => {
    const nextQuery = String(value ?? "");
    setSearchQuery(nextQuery);
    if (!nextQuery.trim()) setSearchResults([]);
    setSearchError(null);
    setIsSearching(Boolean(nextQuery.trim()));
  }, []);

  const toggleMember = useCallback((member) => {
    setSelectedMembers((prev) => {
      const exists = prev.find((m) => m.id === member.id);
      if (exists) return prev.filter((m) => m.id !== member.id);
      return [...prev, member];
    });
    setSearchQuery("");
    setSearchResults([]);
  }, []);

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

      const groupResponse = await departmentApi.createDepartment(
        demoId,
        payload,
      );
      const newGroupId = groupResponse.data?.id || groupResponse.id; // حسب شكل استجابة الباك إند

      if (selectedMembers.length > 0 && newGroupId) {
        await Promise.all(
          selectedMembers.map((member) =>
            departmentMemberApi.addMember({
              demoId,
              departmentId: newGroupId,
              demoMemberId: member.id,
              jobTitle: "INTERN",
            }),
          ),
        );
      }

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
    searchQuery,
    setSearchQuery: updateSearchQuery,
    searchResults,
    isSearching,
    searchError,
    selectedMembers,
    toggleMember,
    isSubmitting,
    error,
    handleSubmit,
  };
};
