import { createBrowserRouter } from "react-router-dom";
import LandingRedirector from "../components/common/LandingRedirector.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import AppHydrationFallback from "../components/common/AppHydrationFallback.jsx";
import RouteErrorPage from "../components/common/RouteErrorPage.jsx";
import { tryRecoverFromChunkLoadError } from "../utils/chunkLoadRecovery.js";
import { PATHS } from "./paths";
import { routeModules } from "./routeModules.js";

const lazyComponent = (importer) => async () => {
  try {
    const module = await importer();
    return { Component: module.default };
  } catch (error) {
    tryRecoverFromChunkLoadError(error);
    throw error;
  }
};

const routes = [
  { path: PATHS.LANDING, element: <LandingRedirector locale="en" /> },
  { path: "/ar", element: <LandingRedirector locale="ar" /> },
  {
    path: PATHS.SIGNIN,
    lazy: lazyComponent(routeModules.signin),
  },
  {
    path: PATHS.SIGNUP,
    lazy: lazyComponent(routeModules.signup),
  },
  {
    path: PATHS.CHECK_EMAIL,
    lazy: lazyComponent(routeModules.verifyEmail),
  },
  {
    path: PATHS.VERIFY_EMAIL,
    lazy: lazyComponent(routeModules.verifyAccount),
  },
  {
    path: PATHS.FORGOT_PASSWORD,
    lazy: lazyComponent(routeModules.forgotPassword),
  },
  {
    path: PATHS.RESET_PASSWORD,
    lazy: lazyComponent(routeModules.resetPassword),
  },
  {
    path: PATHS.PAYMENT_SUCCESS,
    lazy: lazyComponent(routeModules.paymentSuccess),
  },
  {
    path: PATHS.REQUEST_ROOM,
    lazy: lazyComponent(routeModules.requestRoom),
  },
  {
    lazy: lazyComponent(routeModules.dashboardLayout),
    children: [
      {
        path: PATHS.HOME,
        lazy: lazyComponent(routeModules.home),
      },
      {
        path: PATHS.PROFILE,
        lazy: lazyComponent(routeModules.profile),
      },
      {
        path: PATHS.JOINED_ROOMS,
        lazy: lazyComponent(routeModules.joinedRooms),
      },
      {
        path: PATHS.OWN_ROOMS,
        lazy: lazyComponent(routeModules.ownedRooms),
      },
      {
        path: PATHS.PENDING_INVITATIONS,
        lazy: lazyComponent(routeModules.pendingInvitations),
      },
      {
        path: PATHS.CERTIFICATES,
        lazy: lazyComponent(routeModules.certificates),
      },
    ],
  },
  {
    path: PATHS.DEMO,
    lazy: lazyComponent(routeModules.demoProviderLayout),
    children: [
      {
        lazy: lazyComponent(routeModules.demoLayout),
        children: [
          {
            index: true,
            lazy: lazyComponent(routeModules.demoRedirector),
          },
          {
            path: PATHS.DEPARTMENTS,
            lazy: lazyComponent(routeModules.homeDemo),
          },
          {
            path: PATHS.OWNER_HOME,
            lazy: lazyComponent(routeModules.ownerHome),
          },
          {
            path: PATHS.OWNER_MEMBERS,
            lazy: lazyComponent(routeModules.demoMembers),
          },
          {
            path: PATHS.OWNER_LIBRARY,
            lazy: lazyComponent(routeModules.publicLibrary),
          },
          {
            path: PATHS.GROUP_WORKSPACE,
            lazy: lazyComponent(routeModules.groupWorkspace),
          },
          {
            path: PATHS.COURSE_STUDIO,
            lazy: lazyComponent(routeModules.courseStudio),
          },
          {
            path: PATHS.MANAGE_COURSE,
            lazy: lazyComponent(routeModules.manageCourse),
          },
          {
            path: PATHS.VIEW_COURSE,
            lazy: lazyComponent(routeModules.viewCourse),
          },
          {
            path: PATHS.SM_ASSETS,
            lazy: lazyComponent(routeModules.demoAssets),
          },
          {
            path: PATHS.OWNER_COURSES,
            lazy: lazyComponent(routeModules.ownerCourses),
          },
          {
            path: PATHS.INQUIRIES,
            lazy: lazyComponent(routeModules.inquiries),
          },
        ],
      },
      {
        path: "departments/:departmentId",
        lazy: lazyComponent(routeModules.departmentLayout),
        children: [
          {
            index: true,
            lazy: lazyComponent(routeModules.departmentHome),
          },
          {
            path: PATHS.MEMBERS,
            lazy: lazyComponent(routeModules.departmentMembers),
          },
          {
            path: PATHS.LEARNING_PATH,
            lazy: lazyComponent(routeModules.learningPath),
          },
          {
            path: PATHS.SM_ASSETS,
            lazy: lazyComponent(routeModules.demoAssets),
          },
          {
            path: PATHS.LIVES,
            lazy: lazyComponent(routeModules.lives),
          },
          {
            path: PATHS.COURSE_PLAYER,
            lazy: lazyComponent(routeModules.coursePlayer),
          },
          {
            path: PATHS.COURSES,
            lazy: lazyComponent(routeModules.courses),
          },
          {
            path: PATHS.LEADERBOARD,
            lazy: lazyComponent(routeModules.leaderboard),
          },
          {
            path: PATHS.ROADMAPS,
            lazy: lazyComponent(routeModules.roadmaps),
          },
          {
            path: PATHS.TOOLS,
            lazy: lazyComponent(routeModules.tools),
          },
          {
            path: PATHS.CHAT_GROUPS,
            lazy: lazyComponent(routeModules.chats),
          },
        ],
      },
      {
        path: "departments/:departmentId/lives/:streamId/room",
        lazy: lazyComponent(routeModules.liveRoom),
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];

export const router = createBrowserRouter(
  routes.map((route) => ({
    HydrateFallback: AppHydrationFallback,
    errorElement: <RouteErrorPage />,
    ...route,
  })),
);
