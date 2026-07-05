import { createBrowserRouter } from "react-router-dom";
import { PATHS } from "./paths";
import { t } from "i18next";

// ==========================================
import LandingPage from "../pages/LandingPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import SinginPage from "../pages/SigninPage.jsx";
import VerifyEmailPage from "../pages/VerifyEmailPage.jsx";
import VerifyAccountPage from "../pages/VerifyAccountPage.jsx";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../pages/ResetPasswordPage.jsx";

// ==========================================
import HomePage from "../pages/HomePage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import RequestRoomPage from "../pages/RequestRoomPage.jsx";
import JoinedRoomsPage from "../pages/JoinedRooms.jsx";
import MyOwnRoomsPage from "../pages/MyOwnRoomsPage.jsx";
import PendingInvitationsPage from "../pages/PendingInvitationsPage.jsx";

// ==========================================
import HomeDemoPage from "../pages/HomeDemoPage.jsx";
import CoursesPage from "../pages/CoursesPage.jsx";
import LeaderboardPage from "../pages/LeaderboardPage.jsx";
import LearningPathPage from "../pages/LearningPathPage.jsx";
import DepartmentPage from "../pages/DepartmentPage.jsx";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout.jsx";
import WorkspaceToolsPage from "../pages/WorkspaceToolsPage.jsx";
// import RoadmapsPage from "../pages/RoadmapsPage.jsx";
import DepartmentLayout from "../layouts/DepartmentLayout/DepartmentLayout.jsx";
import DemoLayout from "../layouts/DemoLayout/DemoLayout.jsx";
import DemoMembersPage from "../pages/DemoMembersPage.jsx";
import PublicLibraryPage from "../pages/PublicLibraryPage.jsx";
import DemoAssetsPage from "../pages/DemoAssetsPage.jsx";
import LivesPage from "../pages/LivesPage.jsx";
import OwnerHomePage from "../pages/OwnerHomePage.jsx";
import DemoRedirector from "../components/common/DemoRedirector.jsx";
// import WeeklyTasksPage from "../pages/WeeklyTasksPage.jsx";

export const router = createBrowserRouter([
  { path: PATHS.LANDING, element: <PublicLibraryPage /> },
  { path: PATHS.SIGNIN, element: <SinginPage /> },
  { path: PATHS.SIGNUP, element: <SignupPage /> },
  { path: PATHS.CHECK_EMAIL, element: <VerifyEmailPage /> },
  { path: PATHS.VERIFY_EMAIL, element: <VerifyAccountPage /> },
  { path: PATHS.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
  { path: PATHS.RESET_PASSWORD, element: <ResetPasswordPage /> },
  { path: PATHS.REQUEST_ROOM, element: <RequestRoomPage /> },

  // ==========================================
  {
    element: <DashboardLayout />,
    children: [
      { path: PATHS.HOME, element: <HomePage /> },
      { path: PATHS.PROFILE, element: <ProfilePage /> },
      { path: PATHS.JOINED_ROOMS, element: <JoinedRoomsPage /> },
      { path: PATHS.OWN_ROOMS, element: <MyOwnRoomsPage /> },
      { path: PATHS.PENDING_INVITATIONS, element: <PendingInvitationsPage /> },
    ],
  },
  // ==========================================
  {
    path: PATHS.DEMO,
    element: <DemoLayout />,
    children: [
      { index: true, element: <DemoRedirector /> },
      { path: PATHS.DEPARTMENTS, element: <HomeDemoPage /> },
      { path: PATHS.OWNER_HOME, element: <OwnerHomePage /> },
      {
        path: PATHS.OWNER_MEMBERS,
        element: <DemoMembersPage />,
      },
      {
        path: PATHS.OWNER_LIBRARY,
        element: <PublicLibraryPage />,
      },
      {
        path: PATHS.SM_ASSETS,
        element: <DemoAssetsPage />,
      },
      {
        path: PATHS.LIVES,
        element: <LivesPage />,
      },
      // { path: "certificates", element: <CertificatesPage /> },
    ],
  },
  {
    path: PATHS.DEMO_SECTION,
    element: <DepartmentLayout />,
    children: [
      { index: true, element: <DepartmentPage /> },
      {
        path: PATHS.LEARNING_PATH,
        element: <LearningPathPage />,
      },
      {
        path: PATHS.SM_ASSETS,
        element: <DemoAssetsPage />,
      },
      {
        path: PATHS.LIVES,
        element: <LivesPage />,
      },
      // {
      //   path: PATHS.WEEKLY_TASKS,
      //   element: <WeeklyTasksPage />,
      // },
      { path: PATHS.COURSES, element: <CoursesPage /> },
      { path: PATHS.LEADERBOARD, element: <LeaderboardPage /> },
      //{ path: PATHS.ROADMAPS, element: <RoadmapsPage /> },
      { path: PATHS.TOOLS, element: <WorkspaceToolsPage /> },
    ],
  },
  {
    path: "*",
    element: (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white text-2xl font-serif">
        {t("404-page-not-found")}
      </div>
    ),
  },
]);
