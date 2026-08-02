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
  IoDocumentTextOutline,
  IoFolderOpenOutline,
} from "react-icons/io5";

import { PATHS } from "../routes/paths";

export const DASHBOARD_NAV = {
  global: {
    navLinks: [
      { name: "Home", path: PATHS.HOME },
      { name: "Pending Invitations", path: PATHS.PENDING_INVITATIONS },
      { name: "Joined Rooms", path: PATHS.JOINED_ROOMS },
      { name: "My Own Rooms", path: PATHS.OWN_ROOMS },
    ],
  },
};

export const DEMO_NAV = {
  trainee: {
    navLinks: [
      { name: "Departments", icon: <IoBusinessOutline />, path: "" },
      {
        name: "Certificates",
        icon: <IoDocumentTextOutline />,
        path: PATHS.CERTIFICATES,
      },
      { name: "Lives", icon: <IoVideocamOutline />, path: PATHS.LIVES },
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
        name: "Demo Members",
        icon: <IoPeopleOutline />,
        path: PATHS.OWNER_MEMBERS,
      },
      {
        name: "Inquiries",
        icon: <IoHelpCircleOutline />,
        path: PATHS.INQUIRIES,
      },
      { name: "Lives", icon: <IoVideocamOutline />, path: PATHS.LIVES },
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
        name: "Certificates",
        icon: <IoDocumentTextOutline />,
        path: PATHS.CERTIFICATES,
      },
      { name: "Lives", icon: <IoVideocamOutline />, path: PATHS.LIVES },
      {
        name: "Inquiries",
        icon: <IoHelpCircleOutline />,
        path: PATHS.INQUIRIES,
      },
    ],
  },
};

export const DEPARTMENT_NAV = {
  trainee: {
    navLinks: [
      { name: "Home", icon: <IoHomeOutline />, path: "" },
      {
        name: "Learning Path",
        icon: <IoMapOutline />,
        path: PATHS.LEARNING_PATH,
      },
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
      {
        name: "Workspace Tools",
        icon: <IoHardwareChipOutline />,
        path: PATHS.TOOLS,
      },
    ],
  },
  sectionManager: {
    navLinks: [
      { name: "Home", icon: <IoHomeOutline />, path: "" },
      { name: "Members", icon: <IoPeopleOutline />, path: PATHS.MEMBERS },
      { name: "Courses", icon: <IoBookOutline />, path: PATHS.COURSES },
      { name: "Lives", icon: <IoVideocamOutline />, path: PATHS.LIVES },
      {
        name: "Demo Library",
        icon: <IoLibraryOutline />,
        path: PATHS.SM_ASSETS,
      },
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
      { name: "Members", icon: <IoPeopleOutline />, path: PATHS.MEMBERS },
      { name: "Courses", icon: <IoBookOutline />, path: PATHS.COURSES },
      { name: "Lives", icon: <IoVideocamOutline />, path: PATHS.LIVES }, // 👈 تم التصحيح
      {
        name: "Demo Library",
        icon: <IoLibraryOutline />,
        path: PATHS.SM_ASSETS,
      },
      {
        name: "Tools Settings",
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
      {
        name: "Learning Path",
        icon: <IoMapOutline />,
        path: PATHS.SM_LEARNING_PATH,
      },
      { name: "Road Maps", icon: <IoMapOutline />, path: PATHS.ROADMAPS },
    ],
  },
};
