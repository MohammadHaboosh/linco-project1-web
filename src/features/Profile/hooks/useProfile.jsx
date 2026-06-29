import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../../features/User/store/userSlice.js";
import { fetchCurrentUser } from "../api/profileApi.js";

export const useProfile = () => {
  const dispatch = useDispatch();
  const { profile, isAuthenticated } = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(!profile);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!profile) {
        try {
          setIsLoading(true);
          const data = await fetchCurrentUser();
          dispatch(setUser(data));
        } catch (err) {
          console.error("Failed to load user profile:", err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserProfile();
  }, [profile, dispatch]);

  const firstName = profile?.firstName || "Guest";
  const lastName = profile?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = profile?.firstName
    ? `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ""}`.toUpperCase()
    : "G";

  return {
    profile,
    isAuthenticated,
    isLoading,
    error,
    firstName,
    lastName,
    fullName,
    initials,
  };
};
