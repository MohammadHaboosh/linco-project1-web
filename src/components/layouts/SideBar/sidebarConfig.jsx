import {
  IoColorPaletteOutline,
  IoEarthOutline,
  IoLogOutOutline,
  IoNotificationsOutline,
  IoPersonOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { PATHS } from "../../../routes/paths";

export const SIDEBAR_CONFIG = [
  { name: "My Profile", icon: <IoPersonOutline />, path: PATHS.PROFILE },
  { name: "Settings", icon: <IoSettingsOutline />, path: PATHS.SETTINGS },
  {
    name: "Notifications",
    icon: <IoNotificationsOutline />,
    path: PATHS.NOTIFICATIONS,
  },
  { name: "Language", icon: <IoEarthOutline />, action: "lang" },
  { name: "Theme", icon: <IoColorPaletteOutline />, action: "theme" },
  {
    name: "Logout",
    icon: <IoLogOutOutline />,
    action: "logout",
    isDanger: true,
  },
];
