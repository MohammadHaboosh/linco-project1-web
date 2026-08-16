import { useState, useCallback, useEffect } from "react";
import { departmentApi } from "../../HomeDemoPage/api/departmentApi";
import { useDemo } from "../../../../hooks/useDemo";

export const useGroups = () => {
  const { demoId } = useDemo();

  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchGroupsData = useCallback(async () => {
    if (!demoId) return [];
    const allDepartments = await departmentApi.getDepartments(demoId);

    const onlyGroups = allDepartments.filter((dept) => dept.isGroup === true);

    return onlyGroups.map((group) => ({
      id: group.id,
      name: group.name,
      initials: group.name?.substring(0, 2).toUpperCase() || "GR",
      description: group.description,
      membersCount: group.membersCount || 0,
      isLocked: !group.isJoind,
      privacy: group.isJoind ? "PUBLIC" : "PRIVATE",
      managerId: group.managerId,
    }));
  }, [demoId]);

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      if (!demoId) return;

      try {
        const data = await fetchGroupsData();

        if (isMounted) {
          setGroups(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load groups.");
        }
        console.error("Error fetching groups:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [fetchGroupsData, demoId]);

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchGroupsData();
      setGroups(data);
    } catch (err) {
      setError(err.message || "Failed to load groups.");
      console.error("Error fetching groups:", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchGroupsData]);

  const createGroup = async (groupData) => {
    if (!demoId) throw new Error("Demo ID is required");

    setIsCreating(true);
    try {
      const payload = {
        name: groupData.name,
        description: groupData.description,
        isGroup: true,
        ...(groupData.managerId && { managerId: groupData.managerId }),
      };

      await departmentApi.createDepartment(demoId, payload);

      await fetchGroups();
      return true;
    } catch (err) {
      console.error("Error creating group:", err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const searchMembers = async (query, options) => {
    if (!demoId) return [];
    return await departmentApi.searchMembers(demoId, query, options);
  };

  return {
    groups,
    isLoading,
    error,
    isCreating,
    fetchGroups,
    createGroup,
    searchMembers,
  };
};
