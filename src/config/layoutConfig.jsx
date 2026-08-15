import {
  IoHomeOutline,
  IoMapOutline,
  IoBookOutline,
  IoPersonOutline,
  IoChatbubblesOutline,
  IoHardwareChipOutline,
  IoPeopleOutline,
  IoVideocamOutline,
  IoHelpCircleOutline,
  IoSettingsOutline,
  IoBusinessOutline,
  IoLibraryOutline,
  IoDocumentTextOutline,
  IoFolderOpenOutline,
} from "react-icons/io5";

import { PATHS } from "../routes/paths";

export const DASHBOARD_NAV = {
  global: {
    navLinks: [
      { name: "Home", path: PATHS.HOME },
      { name: "Inbox", path: PATHS.PENDING_INVITATIONS },
      { name: "Joined Rooms", path: PATHS.JOINED_ROOMS },
      { name: "My Rooms", path: PATHS.OWN_ROOMS },
      { name: "My Certificates", path: PATHS.CERTIFICATES },
    ],
  },
};

export const DEMO_NAV = {
  member: {
    navLinks: [
      { name: "Departments", icon: <IoBusinessOutline />, path: "" },
      {
        name: "Groups",
        icon: <IoHardwareChipOutline />,
        path: PATHS.GROUP_WORKSPACE,
      },
      {
        name: "Inquiries",
        icon: <IoHelpCircleOutline />,
        path: PATHS.INQUIRIES,
      },
    ],
  },
  owner: {
    navLinks: [
      {
        name: "Home",
        icon: <IoHomeOutline />,
        path: PATHS.OWNER_HOME,
      },
      {
        name: "Demo Courses",
        icon: <IoFolderOpenOutline />,
        path: PATHS.OWNER_COURSES,
      },
      {
        name: "Departments",
        icon: <IoBusinessOutline />,
        path: PATHS.DEPARTMENTS,
      },
      {
        name: "Groups",
        icon: <IoHardwareChipOutline />,
        path: PATHS.GROUP_WORKSPACE,
      },
      {
        name: "Demo Members",
        icon: <IoPeopleOutline />,
        path: PATHS.OWNER_MEMBERS,
      },
      {
        name: "Inquiries",
        icon: <IoHelpCircleOutline />,
        path: PATHS.INQUIRIES,
      },
      {
        name: "Public Library",
        icon: <IoLibraryOutline />,
        path: PATHS.OWNER_LIBRARY,
      },
    ],
  },
  sectionManager: {
    navLinks: [
      { name: "Departments", icon: <IoBusinessOutline />, path: "" },
      {
        name: "Groups",
        icon: <IoHardwareChipOutline />,
        path: PATHS.GROUP_WORKSPACE,
      },
      {
        name: "Inquiries",
        icon: <IoHelpCircleOutline />,
        path: PATHS.INQUIRIES,
      },
    ],
  },
};

export const DEPARTMENT_NAV = {
  member: {
    navLinks: [
      { name: "Home", icon: <IoHomeOutline />, path: "" },
      { name: "Courses", icon: <IoBookOutline />, path: PATHS.COURSES },
      { name: "Road Maps", icon: <IoMapOutline />, path: PATHS.ROADMAPS },
      {
        name: "Leaderboard",
        icon: <IoPersonOutline />,
        path: PATHS.LEADERBOARD,
      },
      {
        name: "Chat",
        icon: <IoChatbubblesOutline />,
        path: PATHS.CHAT_GROUPS,
      },
      { name: "Lives", icon: <IoVideocamOutline />, path: PATHS.LIVES },
      {
        name: "Workspace Tools",
        icon: <IoHardwareChipOutline />,
        path: PATHS.TOOLS,
      },
    ],
  },
  admin: {
    navLinks: [
      { name: "Home", icon: <IoHomeOutline />, path: "" },
      { name: "Members", icon: <IoPeopleOutline />, path: PATHS.MEMBERS },
      {
        name: "Demo Library",
        icon: <IoLibraryOutline />,
        path: PATHS.SM_ASSETS,
      },
      { name: "Courses", icon: <IoBookOutline />, path: PATHS.COURSES },
      { name: "Lives", icon: <IoVideocamOutline />, path: PATHS.LIVES },
      {
        name: "Workspace Tools",
        icon: <IoSettingsOutline />,
        path: PATHS.SM_TOOLS,
      },
      {
        name: "Leaderboard",
        icon: <IoPersonOutline />,
        path: PATHS.LEADERBOARD,
      },
      {
        name: "Chat",
        icon: <IoChatbubblesOutline />,
        path: PATHS.CHAT_GROUPS,
      },
      { name: "Road Maps", icon: <IoMapOutline />, path: PATHS.ROADMAPS },
    ],
  },
  owner: {
    navLinks: [
      { name: "Home", icon: <IoHomeOutline />, path: "" },
      {
        name: "Demo Library",
        icon: <IoLibraryOutline />,
        path: PATHS.SM_ASSETS,
      },
      { name: "Courses", icon: <IoBookOutline />, path: PATHS.COURSES },
      { name: "Members", icon: <IoPeopleOutline />, path: PATHS.MEMBERS },
      { name: "Lives", icon: <IoVideocamOutline />, path: PATHS.LIVES }, // 👈 تم التصحيح
      {
        name: "Workspace Tools",
        icon: <IoSettingsOutline />,
        path: PATHS.SM_TOOLS,
      },
      {
        name: "Leaderboard",
        icon: <IoPersonOutline />,
        path: PATHS.LEADERBOARD,
      },
      {
        name: "Chat",
        icon: <IoChatbubblesOutline />,
        path: PATHS.CHAT_GROUPS,
      },
      { name: "Road Maps", icon: <IoMapOutline />, path: PATHS.ROADMAPS },
    ],
  },
};
