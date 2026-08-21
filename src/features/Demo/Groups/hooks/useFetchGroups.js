import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { departmentApi } from "../../HomeDemoPage/api/departmentApi";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";

export const useFetchGroups = (demoId) => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(!!demoId);
  const [error, setError] = useState(null);

  const fetchGroups = useCallback(async () => {
    if (!demoId) return;

    await Promise.resolve();
    setIsLoading(true);
    setError(null);

    try {
      const allDepartmentsAndGroups =
        await departmentApi.getDepartments(demoId);

      const filteredGroups = allDepartmentsAndGroups
        .filter((item) => item.isGroup === true && item.isJoind === true)
        .map((group) => ({
          ...group,
          initials: group.title
            ? group.title.substring(0, 2).toUpperCase()
            : "GR",
        }));

      setGroups(filteredGroups);
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError(
        getApiErrorMessage(
          err,
          t("groups-load-failed", "Couldn't load groups"),
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [demoId, t]);

  useEffect(() => {
    let isMounted = true;
    const initFetch = async () => {
      if (isMounted) await fetchGroups();
    };
    initFetch();
    return () => {
      isMounted = false;
    };
  }, [fetchGroups]);

  return { groups, isLoading, error, refetch: fetchGroups };
};
