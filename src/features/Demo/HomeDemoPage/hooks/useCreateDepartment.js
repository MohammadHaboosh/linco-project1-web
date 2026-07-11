import { useState, useEffect } from 'react';
import { departmentApi } from '../api/departmentApi';

export const useCreateDepartment = (demoId, onSuccess) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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
    // 1. ننشئ وحدة إلغاء للطلب
    const controller = new AbortController();
    const { signal } = controller;

    const delayDebounceFn = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await departmentApi.searchMembers(demoId, searchQuery, {
          signal,
        });

        if (!signal.aborted) {
          setSearchResults(results);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
          console.error('Search failed', err);
        }
      } finally {
        if (!signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [searchQuery, demoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    console.log(`${formData.name} Department title is required.`);
    if (!formData.name.trim()) {
      console.log(`${formData.name} Department title is required.`);
      setError('Department title is required.');
      return;
    }
    console.log(`${selectedUser} selectedUser is required.`);
    if (!selectedUser) {
      console.log(`${selectedUser} selectedUser is required.`);
      setError('Please select a manager/member from the search.');
      return;
    }
    console.log(`${demoId} demoId is required.`);
    if (!demoId) {
      console.log(`${demoId} demoId is required.`);
      setError('Demo ID is missing.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        managerId: selectedUser.id,
      };
      console.log(`${payload.managerId} payload`);
      await departmentApi.createDepartment(demoId, payload);

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(
        err.message || 'An error occurred while creating the department.',
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
