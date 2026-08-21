import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setUser } from "../../../features/User/store/userSlice.js";
import {
  fetchCurrentUser,
  changePassword,
  generate2FA,
  turnOn2FA,
} from "../api/profileApi.js";
import {
  getUploadUrl,
  uploadFileToCloud,
  updateUserProfilePhoto,
} from "../../User/api/userApi.js";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

export const useProfile = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { profile, isAuthenticated } = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(!profile);
  const [error, setError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState("");
  const [photoUploadStatus, setPhotoUploadStatus] = useState("");

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
  const [isGenerating2FA, setIsGenerating2FA] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [twoFactorMessage, setTwoFactorMessage] = useState({
    type: "",
    message: "",
  });
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    const loadUserProfile = async () => {
      if (!profile) {
        try {
          setIsLoading(true);
          setError("");
          const data = await fetchCurrentUser();
          if (isCurrent) {
            dispatch(setUser(data));
          }
        } catch (err) {
          console.error("Failed to load user profile:", err);
          if (isCurrent) {
            setError(
              getApiErrorMessage(err, t("profile-load-error-description")),
            );
          }
        } finally {
          if (isCurrent) {
            setIsLoading(false);
          }
        }
      } else {
        setError("");
        setIsLoading(false);
      }
    };

    loadUserProfile();

    return () => {
      isCurrent = false;
    };
  }, [profile, dispatch, loadAttempt, t]);

  const retryLoadProfile = useCallback(() => {
    setLoadAttempt((attempt) => attempt + 1);
  }, []);

  const handleUpdatePassword = async () => {
    setPasswordStatus({ type: "", message: "" });

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({
        type: "error",
        message: "profile-password-fields-required",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        type: "error",
        message: "profile-passwords-do-not-match",
      });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      await changePassword(oldPassword, newPassword);

      setPasswordStatus({
        type: "success",
        message: "profile-password-updated-successfully",
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Failed to update password:", err);
      setPasswordStatus({
        type: "error",
        message: getApiErrorMessage(
          err,
          t("profile-password-update-error"),
        ),
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handlePhotoChange = async (file) => {
    if (!file) return;

    setPhotoUploadError("");
    setPhotoUploadStatus("");

    if (!file.type.startsWith("image/")) {
      setPhotoUploadError("profile-photo-invalid-file");
      return;
    }

    if (!profile?.id) {
      setPhotoUploadError("profile-photo-user-unavailable");
      return;
    }

    setIsUploadingPhoto(true);

    try {
      const { data } = await getUploadUrl(file.name);
      const { uploadUrl, cdnUrl } = data || {};

      if (!uploadUrl || !cdnUrl) {
        throw new Error("PROFILE_PHOTO_UPLOAD_URL_MISSING");
      }

      await uploadFileToCloud(uploadUrl, file);
      await updateUserProfilePhoto(profile.id, cdnUrl);

      dispatch(
        setUser({
          ...profile,
          imagePath: cdnUrl,
        }),
      );
      setPhotoUploadStatus("profile-photo-updated-successfully");
    } catch (err) {
      console.error("Failed to update profile photo:", err);
      setPhotoUploadError(
        getApiErrorMessage(err, t("profile-photo-upload-error")),
      );
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleGenerate2FA = async () => {
    setTwoFactorMessage({ type: "", message: "" });
    setIsGenerating2FA(true);
    try {
      const response = await generate2FA();
      if (response.success && response.data?.qrCode) {
        setQrCodeData(response.data.qrCode);
        setIsSettingUp2FA(true);
      } else {
        throw new Error("TWO_FACTOR_QR_CODE_MISSING");
      }
    } catch (err) {
      console.error("Failed to generate two-factor QR code:", err);
      setTwoFactorMessage({
        type: "error",
        message: getApiErrorMessage(err, t("profile-2fa-generate-error")),
      });
      setIsSettingUp2FA(false);
    } finally {
      setIsGenerating2FA(false);
    }
  };

  const handleCancel2FASetup = () => {
    setIsSettingUp2FA(false);
    setQrCodeData(null);
    setVerificationCode("");
    setTwoFactorMessage({ type: "", message: "" });
  };

  const handleTurnOn2FA = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      setTwoFactorMessage({
        type: "error",
        message: "profile-2fa-invalid-code",
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
        message: "profile-2fa-enabled-successfully",
      });
    } catch (err) {
      console.error("Failed to enable two-factor authentication:", err);
      setTwoFactorMessage({
        type: "error",
        message: getApiErrorMessage(err, t("profile-2fa-enable-error")),
      });
    } finally {
      setIsVerifying2FA(false);
    }
  };

  const firstName = profile?.firstName || t("guest");
  const lastName = profile?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = profile?.firstName
    ? `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ""}`.toUpperCase()
    : t("guest").charAt(0).toUpperCase();

  return {
    profile,
    isAuthenticated,
    isLoading,
    error,
    retryLoadProfile,
    firstName,
    lastName,
    fullName,
    initials,
    isUploadingPhoto,
    photoUploadError,
    photoUploadStatus,
    handlePhotoChange,
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
    isGenerating2FA,
    qrCodeData,
    verificationCode,
    setVerificationCode,
    twoFactorMessage,
    isVerifying2FA,
    handleGenerate2FA,
    handleCancel2FASetup,
    handleTurnOn2FA,
  };
};
