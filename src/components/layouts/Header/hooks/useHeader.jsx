import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../../../features/User/store/userSlice";
import { logoutUser } from "../../../../features/User/api/userApi.js";

export const useHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { profile, isAuthenticated } = useSelector((state) => state.user);

  const firstName = profile?.firstName || "Guest";
  const lastName = profile?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = profile?.firstName
    ? `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ""}`.toUpperCase()
    : "G";

  const imagePath = profile?.imagePath || null;
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleLogout = async () => {
    try {
      await logoutUser();

      dispatch(clearUser());

      setIsDropdownOpen(false);
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(clearUser());
      setIsDropdownOpen(false);
      navigate("/signin");
    }
  };

  return {
    dropdownRef,
    isDropdownOpen,
    isAuthenticated,
    fullName,
    initials,
    imagePath,
    toggleDropdown,
    closeDropdown,
    handleLogout,
  };
};
