import {
  IoBusinessOutline,
  IoRibbonOutline,
  IoVideocamOutline,
  IoChatbubblesOutline,
  IoHelpCircleOutline,
  IoSettings,
  IoNotifications,
  IoPerson,
} from "react-icons/io5";
import { PATHS } from "../../../routes/paths";

export const SIDEBAR_ROLES = {
  trainee: [
    {
      name: "Departments",
      icon: <IoBusinessOutline />,
      path: PATHS.DEPARTMENTS,
    },
    {
      name: "Certificates",
      icon: <IoRibbonOutline />,
      path: PATHS.CERTIFICATES,
    },
    { name: "Lives", icon: <IoVideocamOutline />, path: PATHS.LIVES },
    {
      name: "Chat Channel",
      icon: <IoChatbubblesOutline />,
      path: PATHS.CHAT_CHANNEL,
    },
    { name: "Inquiries", icon: <IoHelpCircleOutline />, path: PATHS.INQUIRIES },
  ],
  "section manger": [
    //
  ],
  owner: [
    //
  ],
  global: [
    { name: "Settings", icon: <IoSettings />, path: PATHS.SETTINGS },
    {
      name: "Notifications",
      icon: <IoNotifications />,
      path: PATHS.NOTIFICATIONS,
    },
    { name: "My Profile", icon: <IoPerson />, path: PATHS.PROFILE },
  ],
};
