import { useCallback, useEffect, useState } from "react";
import { departmentMemberApi } from "../api/departmentMemberApi";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";

const SEARCH_DEBOUNCE_MS = 300;
const ALLOWED_JOB_TITLES = ["INTERN", "JUNIOR", "SENIOR"];

export const useAddDepartmentMember = ({
  demoId,
  departmentId,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery || selectedMember) {
      return undefined;
    }

    const controller = new AbortController();
    const debounceTimer = setTimeout(async () => {
      try {
        const responseData = await departmentMemberApi.searchDemoMembers(
          demoId,
          normalizedQuery,
          { signal: controller.signal },
        );

        if (!controller.signal.aborted) {
          setSearchResults(responseData.data);
          setSearchError(null);
        }
      } catch (requestError) {
        if (requestError.name === "AbortError") return;

        if (!controller.signal.aborted) {
          setSearchResults([]);
          setSearchError(
            getApiErrorMessage(
              requestError,
              t("workspace-member-search-failed"),
            ),
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [demoId, searchQuery, selectedMember, t]);

  const updateSearchQuery = useCallback((value) => {
    const nextQuery = String(value ?? "");

    setSearchQuery(nextQuery);
    setSearchResults([]);
    setSearchError(null);
    setSubmitError(null);
    setIsSearching(Boolean(nextQuery.trim()));
  }, []);

  const selectMember = useCallback((member) => {
    setSelectedMember(member);
    setSearchQuery("");
    setSearchResults([]);
    setSearchError(null);
    setIsSearching(false);
    setSubmitError(null);
  }, []);

  const clearSelectedMember = useCallback(() => {
    setSelectedMember(null);
    setSearchQuery("");
    setSearchResults([]);
    setSearchError(null);
    setIsSearching(false);
    setSubmitError(null);
  }, []);

  const submitMember = useCallback(
    async (event) => {
      event.preventDefault();
      setSubmitError(null);

      if (!selectedMember) {
        setSubmitError("workspace-member-required");
        return;
      }

      if (!ALLOWED_JOB_TITLES.includes(jobTitle)) {
        setSubmitError("job-title-required");
        return;
      }

      setIsSubmitting(true);

      try {
        const responseData = await departmentMemberApi.addMember({
          demoId,
          departmentId,
          demoMemberId: selectedMember.id,
          jobTitle,
        });

        await onSuccess?.(responseData);
      } catch (requestError) {
        setSubmitError(
          getApiErrorMessage(
            requestError,
            t("department-member-add-failed"),
          ),
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [demoId, departmentId, jobTitle, onSuccess, selectedMember, t],
  );

  return {
    searchQuery,
    setSearchQuery: updateSearchQuery,
    searchResults,
    selectedMember,
    selectMember,
    clearSelectedMember,
    jobTitle,
    setJobTitle,
    isSearching,
    searchError,
    isSubmitting,
    submitError,
    submitMember,
  };
};
