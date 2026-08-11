import { createBrowserRouter } from "react-router-dom";
import LandingRedirector from "../components/common/LandingRedirector.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import { PATHS } from "./paths";

const lazyComponent = (importer) => async () => {
  const module = await importer();
  return { Component: module.default };
};

export const router = createBrowserRouter([
  { path: PATHS.LANDING, element: <LandingRedirector locale="en" /> },
  { path: "/ar", element: <LandingRedirector locale="ar" /> },
  {
    path: PATHS.SIGNIN,
    lazy: lazyComponent(() => import("../pages/SigninPage.jsx")),
  },
  {
    path: PATHS.SIGNUP,
    lazy: lazyComponent(() => import("../pages/SignupPage.jsx")),
  },
  {
    path: PATHS.CHECK_EMAIL,
    lazy: lazyComponent(() => import("../pages/VerifyEmailPage.jsx")),
  },
  {
    path: PATHS.VERIFY_EMAIL,
    lazy: lazyComponent(() => import("../pages/VerifyAccountPage.jsx")),
  },
  {
    path: PATHS.FORGOT_PASSWORD,
    lazy: lazyComponent(() => import("../pages/ForgotPasswordPage.jsx")),
  },
  {
    path: PATHS.RESET_PASSWORD,
    lazy: lazyComponent(() => import("../pages/ResetPasswordPage.jsx")),
  },
  {
    path: PATHS.PAYMENT_SUCCESS,
    lazy: lazyComponent(() => import("../pages/PaymentSuccessPage.jsx")),
  },
  {
    path: PATHS.REQUEST_ROOM,
    lazy: lazyComponent(() => import("../pages/RequestRoomPage.jsx")),
  },
  {
    lazy: lazyComponent(
      () => import("../layouts/DashboardLayout/DashboardLayout.jsx"),
    ),
    children: [
      {
        path: PATHS.HOME,
        lazy: lazyComponent(() => import("../pages/HomePage.jsx")),
      },
      {
        path: PATHS.PROFILE,
        lazy: lazyComponent(() => import("../pages/ProfilePage.jsx")),
      },
      {
        path: PATHS.JOINED_ROOMS,
        lazy: lazyComponent(() => import("../pages/JoinedRooms.jsx")),
      },
      {
        path: PATHS.OWN_ROOMS,
        lazy: lazyComponent(() => import("../pages/MyOwnRoomsPage.jsx")),
      },
      {
        path: PATHS.PENDING_INVITATIONS,
        lazy: lazyComponent(
          () => import("../pages/PendingInvitationsPage.jsx"),
        ),
      },
    ],
  },
  {
    path: PATHS.DEMO,
    lazy: lazyComponent(() => import("../layouts/DemoLayout/DemoLayout.jsx")),
    children: [
      {
        index: true,
        lazy: lazyComponent(
          () => import("../components/common/DemoRedirector.jsx"),
        ),
      },
      {
        path: PATHS.DEPARTMENTS,
        lazy: lazyComponent(() => import("../pages/HomeDemoPage.jsx")),
      },
      {
        path: PATHS.OWNER_HOME,
        lazy: lazyComponent(() => import("../pages/OwnerHomePage.jsx")),
      },
      {
        path: PATHS.OWNER_MEMBERS,
        lazy: lazyComponent(() => import("../pages/DemoMembersPage.jsx")),
      },
      {
        path: PATHS.OWNER_LIBRARY,
        lazy: lazyComponent(() => import("../pages/PublicLibraryPage.jsx")),
      },
      {
        path: PATHS.COURSE_STUDIO,
        lazy: lazyComponent(
          () =>
            import(
              "../features/Demo/PublishCourse/components/CourseStudio/CourseStudio.jsx"
            ),
        ),
      },
      {
        path: PATHS.MANAGE_COURSE,
        lazy: lazyComponent(
          () =>
            import(
              "../features/Demo/OwnerCourses/components/ManageCourse/components/CourseManagerLayout.jsx"
            ),
        ),
      },
      {
        path: PATHS.SM_ASSETS,
        lazy: lazyComponent(() => import("../pages/DemoAssetsPage.jsx")),
      },
      {
        path: PATHS.OWNER_COURSES,
        lazy: lazyComponent(() => import("../pages/OwnerCoursesPage.jsx")),
      },
      {
        path: PATHS.INQUIRIES,
        lazy: lazyComponent(() => import("../pages/InquiriesPage.jsx")),
      },
      {
        path: PATHS.CERTIFICATES,
        lazy: lazyComponent(() => import("../pages/CertificatesPage.jsx")),
      },
    ],
  },
  {
    path: PATHS.DEMO_SECTION,
    lazy: lazyComponent(
      () => import("../layouts/DepartmentLayout/DepartmentLayout.jsx"),
    ),
    children: [
      {
        index: true,
        lazy: lazyComponent(() => import("../pages/DepartmentPage.jsx")),
      },
      {
        path: PATHS.MEMBERS,
        lazy: lazyComponent(
          () => import("../pages/DepartmentMembersPage.jsx"),
        ),
      },
      {
        path: PATHS.LEARNING_PATH,
        lazy: lazyComponent(() => import("../pages/LearningPathPage.jsx")),
      },
      {
        path: PATHS.SM_ASSETS,
        lazy: lazyComponent(() => import("../pages/DemoAssetsPage.jsx")),
      },
      {
        path: PATHS.LIVES,
        lazy: lazyComponent(() => import("../pages/LivesPage.jsx")),
      },
      {
        path: PATHS.COURSE_PLAYER,
        lazy: lazyComponent(() => import("../pages/CoursePlayerPage.jsx")),
      },
      {
        path: PATHS.COURSES,
        lazy: lazyComponent(() => import("../pages/CoursesPage.jsx")),
      },
      {
        path: PATHS.LEADERBOARD,
        lazy: lazyComponent(() => import("../pages/LeaderboardPage.jsx")),
      },
      {
        path: PATHS.ROADMAPS,
        lazy: lazyComponent(() => import("../pages/RoadmapsPage.jsx")),
      },
      {
        path: PATHS.TOOLS,
        lazy: lazyComponent(() => import("../pages/WorkspaceToolsPage.jsx")),
      },
      {
        path: PATHS.CHAT_GROUPS,
        lazy: lazyComponent(() => import("../pages/ChatsPage.jsx")),
      },
    ],
  },
  {
    path: PATHS.LIVE_ROOM,
    lazy: lazyComponent(() => import("../pages/LiveRoomPage.jsx")),
  },
  { path: "*", element: <NotFoundPage /> },
]);
