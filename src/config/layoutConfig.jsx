import {
  IoHomeOutline,
  IoMapOutline,
  IoBookOutline,
  IoListOutline,
  IoPersonOutline,
  IoChatbubblesOutline,
  IoHardwareChipOutline,
  IoPeopleOutline,
  IoVideocamOutline,
  IoHelpCircleOutline,
  IoSettingsOutline,
  IoBusinessOutline,
  IoLibraryOutline,
  IoNotificationsOutline,
  IoColorPaletteOutline,
  IoEarthOutline,
  IoLogOutOutline,
} from "react-icons/io5";

import { PATHS } from "../routes/paths";

export const SUBHEADER_CONFIG = {
  global: {
    navLinks: [
      { name: "Home", path: PATHS.HOME },
      { name: "Pending Invitations", path: PATHS.PENDING_INVITATIONS },
      { name: "Joined Rooms", path: PATHS.JOINED_ROOMS },
      { name: "My Own Rooms", path: PATHS.OWN_ROOMS },
    ],
  },
  trainee: [
    { name: "Home", icon: <IoHomeOutline />, path: PATHS.HOME },
    {
      name: "Learning Path",
      icon: <IoMapOutline />,
      path: PATHS.LEARNING_PATH,
    },
    { name: "Courses", icon: <IoBookOutline />, path: PATHS.COURSES },
    { name: "Road Maps", icon: <IoMapOutline />, path: PATHS.ROAD_MAP },
    { name: "Weekly Tasks", icon: <IoListOutline />, path: PATHS.WEEKLY_TASKS },
    { name: "Leaderboard", icon: <IoPersonOutline />, path: PATHS.LEADERBOARD },
    {
      name: "Workspace Tools",
      icon: <IoHardwareChipOutline />,
      path: PATHS.TOOLS,
    },
    { name: "Group Chat", icon: <IoChatbubblesOutline />, path: PATHS.CHAT },
  ],
  sectionManager: [
    { name: "Members", icon: <IoPeopleOutline />, path: PATHS.SM_MEMBERS },
    { name: "Courses", icon: <IoBookOutline />, path: PATHS.SM_COURSES },
    { name: "Live Streams", icon: <IoVideocamOutline />, path: PATHS.SM_LIVES },
    {
      name: "Inquiries",
      icon: <IoHelpCircleOutline />,
      path: PATHS.SM_INQUIRIES,
    },
    { name: "Chat Channel", icon: <IoChatbubblesOutline />, path: PATHS.CHAT },
    {
      name: "Tools Settings",
      icon: <IoSettingsOutline />,
      path: PATHS.SM_TOOLS,
    },
    {
      name: "Learning Path",
      icon: <IoMapOutline />,
      path: PATHS.SM_LEARNING_PATH,
    },
    { name: "Road Maps", icon: <IoMapOutline />, path: PATHS.SM_ROADMAPS },
    { name: "Weekly Tasks", icon: <IoListOutline />, path: PATHS.SM_TASKS },
    { name: "Leaderboard", icon: <IoPersonOutline />, path: PATHS.LEADERBOARD },
  ],
  owner: [
    { name: "Analytics Home", icon: <IoHomeOutline />, path: PATHS.OWNER_HOME },
    {
      name: "Departments",
      icon: <IoBusinessOutline />,
      path: PATHS.OWNER_DEPTS,
    },
    {
      name: "Demo Members",
      icon: <IoPeopleOutline />,
      path: PATHS.OWNER_MEMBERS,
    },
    {
      name: "Inquiries",
      icon: <IoHelpCircleOutline />,
      path: PATHS.OWNER_INQUIRIES,
    },
    { name: "Chat Channel", icon: <IoChatbubblesOutline />, path: PATHS.CHAT },
    {
      name: "Live Streams",
      icon: <IoVideocamOutline />,
      path: PATHS.OWNER_LIVES,
    },
    {
      name: "Public Library",
      icon: <IoLibraryOutline />,
      path: PATHS.OWNER_LIBRARY,
    },
  ],
};

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
