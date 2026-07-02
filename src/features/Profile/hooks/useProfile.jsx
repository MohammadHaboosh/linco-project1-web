import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../../features/User/store/userSlice.js";
import {
  fetchCurrentUser,
  changePassword,
  generate2FA,
  turnOn2FA,
} from "../api/profileApi.js";

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

  // Password States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState({
    type: "",
    message: "",
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // 2FA States
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [twoFactorMessage, setTwoFactorMessage] = useState({
    type: "",
    message: "",
  });
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);

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

  const handleGenerate2FA = async () => {
    setTwoFactorMessage({ type: "", message: "" });
    setIsSettingUp2FA(true);
    try {
      const response = await generate2FA();
      if (response.success && response.data?.qrCode) {
        setQrCodeData(response.data.qrCode);
      }
    } catch (err) {
      setTwoFactorMessage({ type: "error", message: err.message });
      setIsSettingUp2FA(false);
    }
  };

  const handleTurnOn2FA = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      setTwoFactorMessage({
        type: "error",
        message: "Please enter a valid 6-digit code.",
      });
      return;
    }

    setIsVerifying2FA(true);
    setTwoFactorMessage({ type: "", message: "" });

    try {
      await turnOn2FA(verificationCode);
      setIs2FAEnabled(true);
      setIsSettingUp2FA(false);
      setQrCodeData(null);
      setVerificationCode("");
      setTwoFactorMessage({
        type: "success",
        message: "Two-factor authentication successfully enabled!",
      });
    } catch (err) {
      setTwoFactorMessage({ type: "error", message: err.message });
    } finally {
      setIsVerifying2FA(false);
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
    // Password
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordStatus,
    isUpdatingPassword,
    handleUpdatePassword,
    // 2FA
    is2FAEnabled,
    isSettingUp2FA,
    setIsSettingUp2FA,
    qrCodeData,
    verificationCode,
    setVerificationCode,
    twoFactorMessage,
    isVerifying2FA,
    handleGenerate2FA,
    handleTurnOn2FA,
  };
};
