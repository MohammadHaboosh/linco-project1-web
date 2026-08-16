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
  IoFolderOpenOutline,
} from "react-icons/io5";

import { PATHS } from "../routes/paths";

export const DASHBOARD_NAV = {
  global: {
    navLinks: [
      { name: "Home", translationKey: "home", path: PATHS.HOME },
      {
        name: "Inbox",
        translationKey: "pending-invitations",
        path: PATHS.PENDING_INVITATIONS,
      },
      {
        name: "Joined Workspaces",
        translationKey: "joined-workspaces",
        path: PATHS.JOINED_ROOMS,
      },
      {
        name: "My Workspaces",
        translationKey: "owned-workspaces",
        path: PATHS.OWN_ROOMS,
      },
      {
        name: "My Certificates",
        translationKey: "my-certificates",
        path: PATHS.CERTIFICATES,
      },
    ],
  },
};

export const DEMO_NAV = {
  member: {
    navLinks: [
      {
        name: "Departments",
        translationKey: "departments",
        icon: <IoBusinessOutline />,
        path: "",
      },
      {
        name: "Groups",
        translationKey: "groups",
        icon: <IoHardwareChipOutline />,
        path: PATHS.GROUP_WORKSPACE,
      },
      {
        name: "Inquiries",
        translationKey: "inquiries",
        icon: <IoHelpCircleOutline />,
        path: PATHS.INQUIRIES,
      },
    ],
  },
  owner: {
    navLinks: [
      {
        name: "Home",
        translationKey: "home",
        icon: <IoHomeOutline />,
        path: PATHS.OWNER_HOME,
      },
      {
        name: "Demo Courses",
        translationKey: "demo-courses",
        icon: <IoFolderOpenOutline />,
        path: PATHS.OWNER_COURSES,
      },
      {
        name: "Departments",
        translationKey: "departments",
        icon: <IoBusinessOutline />,
        path: PATHS.DEPARTMENTS,
      },
      {
        name: "Groups",
        translationKey: "groups",
        icon: <IoHardwareChipOutline />,
        path: PATHS.GROUP_WORKSPACE,
      },
      {
        name: "Demo Members",
        translationKey: "demo-members",
        icon: <IoPeopleOutline />,
        path: PATHS.OWNER_MEMBERS,
      },
      {
        name: "Inquiries",
        translationKey: "inquiries",
        icon: <IoHelpCircleOutline />,
        path: PATHS.INQUIRIES,
      },
      {
        name: "Public Library",
        translationKey: "public-library",
        icon: <IoLibraryOutline />,
        path: PATHS.OWNER_LIBRARY,
      },
    ],
  },
  sectionManager: {
    navLinks: [
      {
        name: "Departments",
        translationKey: "departments",
        icon: <IoBusinessOutline />,
        path: "",
      },
      {
        name: "Groups",
        translationKey: "groups",
        icon: <IoHardwareChipOutline />,
        path: PATHS.GROUP_WORKSPACE,
      },
      {
        name: "Inquiries",
        translationKey: "inquiries",
        icon: <IoHelpCircleOutline />,
        path: PATHS.INQUIRIES,
      },
    ],
  },
};

export const DEPARTMENT_NAV = {
  member: {
    navLinks: [
      { name: "Home", translationKey: "home", icon: <IoHomeOutline />, path: "" },
      {
        name: "Courses",
        translationKey: "courses",
        icon: <IoBookOutline />,
        path: PATHS.COURSES,
      },
      {
        name: "Road Maps",
        translationKey: "learning-roadmaps",
        icon: <IoMapOutline />,
        path: PATHS.ROADMAPS,
      },
      {
        name: "Leaderboard",
        translationKey: "company-leaderboard",
        icon: <IoPersonOutline />,
        path: PATHS.LEADERBOARD,
      },
      {
        name: "Chat",
        translationKey: "department-chat",
        icon: <IoChatbubblesOutline />,
        path: PATHS.CHAT_GROUPS,
      },
      {
        name: "Lives",
        translationKey: "lives",
        icon: <IoVideocamOutline />,
        path: PATHS.LIVES,
      },
      {
        name: "Workspace Tools",
        translationKey: "workspace-tools",
        icon: <IoHardwareChipOutline />,
        path: PATHS.TOOLS,
      },
    ],
  },
  admin: {
    navLinks: [
      { name: "Home", translationKey: "home", icon: <IoHomeOutline />, path: "" },
      {
        name: "Members",
        translationKey: "members",
        icon: <IoPeopleOutline />,
        path: PATHS.MEMBERS,
      },
      {
        name: "Demo Library",
        translationKey: "workspace-library",
        icon: <IoLibraryOutline />,
        path: PATHS.SM_ASSETS,
      },
      {
        name: "Courses",
        translationKey: "courses",
        icon: <IoBookOutline />,
        path: PATHS.COURSES,
      },
      {
        name: "Lives",
        translationKey: "lives",
        icon: <IoVideocamOutline />,
        path: PATHS.LIVES,
      },
      {
        name: "Workspace Tools",
        translationKey: "workspace-tools",
        icon: <IoSettingsOutline />,
        path: PATHS.SM_TOOLS,
      },
      {
        name: "Leaderboard",
        translationKey: "company-leaderboard",
        icon: <IoPersonOutline />,
        path: PATHS.LEADERBOARD,
      },
      {
        name: "Chat",
        translationKey: "department-chat",
        icon: <IoChatbubblesOutline />,
        path: PATHS.CHAT_GROUPS,
      },
      {
        name: "Road Maps",
        translationKey: "learning-roadmaps",
        icon: <IoMapOutline />,
        path: PATHS.ROADMAPS,
      },
    ],
  },
  owner: {
    navLinks: [
      { name: "Home", translationKey: "home", icon: <IoHomeOutline />, path: "" },
      {
        name: "Demo Library",
        translationKey: "workspace-library",
        icon: <IoLibraryOutline />,
        path: PATHS.SM_ASSETS,
      },
      {
        name: "Courses",
        translationKey: "courses",
        icon: <IoBookOutline />,
        path: PATHS.COURSES,
      },
      {
        name: "Members",
        translationKey: "members",
        icon: <IoPeopleOutline />,
        path: PATHS.MEMBERS,
      },
      {
        name: "Lives",
        translationKey: "lives",
        icon: <IoVideocamOutline />,
        path: PATHS.LIVES,
      },
      {
        name: "Workspace Tools",
        translationKey: "workspace-tools",
        icon: <IoSettingsOutline />,
        path: PATHS.SM_TOOLS,
      },
      {
        name: "Leaderboard",
        translationKey: "company-leaderboard",
        icon: <IoPersonOutline />,
        path: PATHS.LEADERBOARD,
      },
      {
        name: "Chat",
        translationKey: "department-chat",
        icon: <IoChatbubblesOutline />,
        path: PATHS.CHAT_GROUPS,
      },
      {
        name: "Road Maps",
        translationKey: "learning-roadmaps",
        icon: <IoMapOutline />,
        path: PATHS.ROADMAPS,
      },
    ],
  },
};
