import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { clearUser } from "../../../../features/User/store/userSlice";
import { logoutUser } from "../../../../features/User/api/userApi.js";

export const useHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { profile } = useSelector((state) => state.user);

  const firstName = profile?.firstName || t("guest");
  const lastName = profile?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = profile?.firstName
    ? `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ""}`.toUpperCase()
    : t("guest").charAt(0).toUpperCase();

  const imagePath = profile?.imagePath || null;

  const handleLogout = async () => {
    try {
      await logoutUser();

      dispatch(clearUser());
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(clearUser());
      navigate("/signin");
    }
  };

  return {
    fullName,
    initials,
    imagePath,
    handleLogout,
  };
};
