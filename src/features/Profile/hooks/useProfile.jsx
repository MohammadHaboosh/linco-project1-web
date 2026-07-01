import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../../features/User/store/userSlice.js";
import { fetchCurrentUser, changePassword } from "../api/profileApi.js";

export const useProfile = () => {
  const dispatch = useDispatch();
  const { profile, isAuthenticated } = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(!profile);
  const [error, setError] = useState(null);

  const [is2FAEnabled, setIs2FAEnabled] = useState(
    profile?.isTwoFactorEnabled || false,
  );
  const [prevProfile, setPrevProfile] = useState(profile);

  if (profile !== prevProfile) {
    setPrevProfile(profile);
    setIs2FAEnabled(profile?.isTwoFactorEnabled || false);
  }

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState({
    type: "",
    message: "",
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

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

  const handleUpdatePassword = async () => {
    setPasswordStatus({ type: "", message: "" });

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({
        type: "error",
        message: "Please fill in all password fields.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        type: "error",
        message: "New passwords do not match.",
      });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      await changePassword(oldPassword, newPassword);

      setPasswordStatus({
        type: "success",
        message: "Password updated successfully!",
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordStatus({ type: "error", message: err.message });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

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
    // Exported Security Data & Functions
    is2FAEnabled,
    setIs2FAEnabled,
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordStatus,
    isUpdatingPassword,
    handleUpdatePassword,
  };
};
