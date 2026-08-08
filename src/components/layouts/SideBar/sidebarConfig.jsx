import {
  IoNotificationsOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { PATHS } from "../../../routes/paths";

export const SIDEBAR_CONFIG = [
  {
    name: "Profile & Settings",
    translationKey: "profile-and-settings",
    icon: <IoPersonOutline />,
    path: PATHS.PROFILE,
  },
  {
    name: "Notifications",
    translationKey: "notifications",
    icon: <IoNotificationsOutline />,
    path: PATHS.NOTIFICATIONS,
  },
];
