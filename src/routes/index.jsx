import { createBrowserRouter } from "react-router-dom";
import LandingRedirector from "../components/common/LandingRedirector.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import AppHydrationFallback from "../components/common/AppHydrationFallback.jsx";
import RouteErrorPage from "../components/common/RouteErrorPage.jsx";
import DemoRedirector from "../components/common/DemoRedirector.jsx";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout.jsx";
import DemoProviderLayout from "../layouts/DemoProviderLayout/DemoProviderLayout.jsx";
import DemoLayout from "../layouts/DemoLayout/DemoLayout.jsx";
import DepartmentLayout from "../layouts/DepartmentLayout/DepartmentLayout.jsx";
import SigninPage from "../pages/SigninPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import VerifyEmailPage from "../pages/VerifyEmailPage.jsx";
import VerifyAccountPage from "../pages/VerifyAccountPage.jsx";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../pages/ResetPasswordPage.jsx";
import PaymentSuccessPage from "../pages/PaymentSuccessPage.jsx";
import RequestRoomPage from "../pages/RequestRoomPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import JoinedRooms from "../pages/JoinedRooms.jsx";
import MyOwnRoomsPage from "../pages/MyOwnRoomsPage.jsx";
import PendingInvitationsPage from "../pages/PendingInvitationsPage.jsx";
import CertificatesPage from "../pages/CertificatesPage.jsx";
import HomeDemoPage from "../pages/HomeDemoPage.jsx";
import OwnerHomePage from "../pages/OwnerHomePage.jsx";
import DemoMembersPage from "../pages/DemoMembersPage.jsx";
import PublicLibraryPage from "../pages/PublicLibraryPage.jsx";
import GroupWorkspacePage from "../pages/GroupWorkspacePage.jsx";
import DemoAssetsPage from "../pages/DemoAssetsPage.jsx";
import OwnerCoursesPage from "../pages/OwnerCoursesPage.jsx";
import InquiriesPage from "../pages/InquiriesPage.jsx";
import DepartmentPage from "../pages/DepartmentPage.jsx";
import DepartmentMembersPage from "../pages/DepartmentMembersPage.jsx";
import LearningPathPage from "../pages/LearningPathPage.jsx";
import LivesPage from "../pages/LivesPage.jsx";
import CoursePlayerPage from "../pages/CoursePlayerPage.jsx";
import CoursesPage from "../pages/CoursesPage.jsx";
import LeaderboardPage from "../pages/LeaderboardPage.jsx";
import RoadmapsPage from "../pages/RoadmapsPage.jsx";
import WorkspaceToolsPage from "../pages/WorkspaceToolsPage.jsx";
import ChatsPage from "../pages/ChatsPage.jsx";
import LiveRoomPage from "../pages/LiveRoomPage.jsx";
import CourseStudio from "../features/Demo/PublishCourse/components/CourseStudio/CourseStudio.jsx";
import CourseManagerLayout from "../features/Demo/OwnerCourses/components/ManageCourse/components/CourseManagerLayout.jsx";
import CourseDetailsLayout from "../features/Demo/OwnerCourses/components/ViewCourse/CourseDetailsLayout.jsx";
import { PATHS } from "./paths";

const routes = [
  { path: PATHS.LANDING, element: <LandingRedirector locale="en" /> },
  { path: "/ar", element: <LandingRedirector locale="ar" /> },
  {
    path: PATHS.SIGNIN,
    Component: SigninPage,
  },
  {
    path: PATHS.SIGNUP,
    Component: SignupPage,
  },
  {
    path: PATHS.CHECK_EMAIL,
    Component: VerifyEmailPage,
  },
  {
    path: PATHS.VERIFY_EMAIL,
    Component: VerifyAccountPage,
  },
  {
    path: PATHS.FORGOT_PASSWORD,
    Component: ForgotPasswordPage,
  },
  {
    path: PATHS.RESET_PASSWORD,
    Component: ResetPasswordPage,
  },
  {
    path: PATHS.PAYMENT_SUCCESS,
    Component: PaymentSuccessPage,
  },
  {
    path: PATHS.REQUEST_ROOM,
    Component: RequestRoomPage,
  },
  {
    Component: DashboardLayout,
    children: [
      {
        path: PATHS.HOME,
        Component: HomePage,
      },
      {
        path: PATHS.PROFILE,
        Component: ProfilePage,
      },
      {
        path: PATHS.JOINED_ROOMS,
        Component: JoinedRooms,
      },
      {
        path: PATHS.OWN_ROOMS,
        Component: MyOwnRoomsPage,
      },
      {
        path: PATHS.PENDING_INVITATIONS,
        Component: PendingInvitationsPage,
      },
      {
        path: PATHS.CERTIFICATES,
        Component: CertificatesPage,
      },
    ],
  },
  {
    path: PATHS.DEMO,
    Component: DemoProviderLayout,
    children: [
      {
        Component: DemoLayout,
        children: [
          {
            index: true,
            Component: DemoRedirector,
          },
          {
            path: PATHS.DEPARTMENTS,
            Component: HomeDemoPage,
          },
          {
            path: PATHS.OWNER_HOME,
            Component: OwnerHomePage,
          },
          {
            path: PATHS.OWNER_MEMBERS,
            Component: DemoMembersPage,
          },
          {
            path: PATHS.OWNER_LIBRARY,
            Component: PublicLibraryPage,
          },
          {
            path: PATHS.GROUP_WORKSPACE,
            Component: GroupWorkspacePage,
          },
          {
            path: PATHS.COURSE_STUDIO,
            Component: CourseStudio,
          },
          {
            path: PATHS.MANAGE_COURSE,
            Component: CourseManagerLayout,
          },
          {
            path: PATHS.VIEW_COURSE,
            Component: CourseDetailsLayout,
          },
          {
            path: PATHS.SM_ASSETS,
            Component: DemoAssetsPage,
          },
          {
            path: PATHS.OWNER_COURSES,
            Component: OwnerCoursesPage,
          },
          {
            path: PATHS.INQUIRIES,
            Component: InquiriesPage,
          },
        ],
      },
      {
        path: "departments/:departmentId",
        Component: DepartmentLayout,
        children: [
          {
            index: true,
            Component: DepartmentPage,
          },
          {
            path: PATHS.MEMBERS,
            Component: DepartmentMembersPage,
          },
          {
            path: PATHS.LEARNING_PATH,
            Component: LearningPathPage,
          },
          {
            path: PATHS.SM_ASSETS,
            Component: DemoAssetsPage,
          },
          {
            path: PATHS.LIVES,
            Component: LivesPage,
          },
          {
            path: PATHS.COURSE_PLAYER,
            Component: CoursePlayerPage,
          },
          {
            path: PATHS.COURSES,
            Component: CoursesPage,
          },
          {
            path: PATHS.LEADERBOARD,
            Component: LeaderboardPage,
          },
          {
            path: PATHS.ROADMAPS,
            Component: RoadmapsPage,
          },
          {
            path: PATHS.TOOLS,
            Component: WorkspaceToolsPage,
          },
          {
            path: PATHS.CHAT_GROUPS,
            Component: ChatsPage,
          },
        ],
      },
      {
        path: "departments/:departmentId/lives/:streamId/room",
        Component: LiveRoomPage,
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
