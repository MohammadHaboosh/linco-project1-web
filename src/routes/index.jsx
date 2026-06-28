import { createBrowserRouter } from "react-router-dom";
import { PATHS } from "./paths";

import HomePage from "../pages/HomePage.jsx";
import HomeDemoPage from "../pages/HomeDemoPage.jsx";
import PendingInvitationsPage from "../pages/PendingInvitationsPage.jsx";
import JoinedRoomsPage from "../pages/JoinedRooms.jsx";
import MyOwnRoomsPage from "../pages/MyOwnRoomsPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import DemoPage from "../pages/HomeDemoPage";
import VerifyEmailPage from "../pages/VerifyEmailPage.jsx";
import SinginPage from "../pages/SigninPage.jsx";
import CoursesPage from "../pages/CoursesPage";
import LearningPathPage from "../pages/LearningPathPage";
import DepartmentPage from "../pages/DepartmentPage.jsx";
import LandingPage from "../pages/LandingPage.jsx";
import VerifyAccountPage from "../pages/VerifyAccountPage.jsx";
import ResetPasswordPage from "../pages/ResetPasswordPage.jsx";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.jsx";

export const router = createBrowserRouter([
  {
    path: PATHS.HOME,
    element: <HomePage />,
  },
  {
    path: PATHS.LANDING,
    element: <HomeDemoPage />,
  },
  {
    path: PATHS.PENDING_INVITATIONS,
    element: <PendingInvitationsPage />,
  },
  {
    path: PATHS.JOINED_ROOMS,
    element: <JoinedRoomsPage />,
  },
  {
    path: PATHS.OWN_ROOMS,
    element: <MyOwnRoomsPage />,
  },
  {
    path: PATHS.DEMO,
    element: <DemoPage />,
  },
  {
    path: PATHS.SIGNUP,
    element: <SignupPage />,
  },
  {
    path: PATHS.CHECK_EMAIL,
    element: <VerifyEmailPage />,
  },
  {
    path: PATHS.VERIFY_EMAIL,
    element: <VerifyAccountPage />,
  },
  {
    path: PATHS.RESET_PASSWORD,
    element: <ResetPasswordPage />,
  },
  {
    path: PATHS.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
  },
  {
    path: PATHS.SIGNIN,
    element: <SinginPage />,
  },
  {
    path: PATHS.COURSES,
    element: <CoursesPage />,
  },
  {
    path: PATHS.LEARNING_PATH,
    element: <LearningPathPage />,
  },
  {
    path: PATHS.DEPARTMENT_DETAILS,
    element: <DepartmentPage />,
  },
  {
    path: "*",
    element: (
      <div className="text-center p-20 text-white text-2xl font-serif">
        404 - Page Not Found
      </div>
    ),
  },
]);
