const cachedImport = (importer) => {
  let modulePromise;

  return () => {
    if (!modulePromise) {
      modulePromise = importer().catch((error) => {
        modulePromise = undefined;
        throw error;
      });
    }

    return modulePromise;
  };
};

export const routeModules = {
  signin: cachedImport(() => import("../pages/SigninPage.jsx")),
  signup: cachedImport(() => import("../pages/SignupPage.jsx")),
  verifyEmail: cachedImport(() => import("../pages/VerifyEmailPage.jsx")),
  verifyAccount: cachedImport(
    () => import("../pages/VerifyAccountPage.jsx"),
  ),
  forgotPassword: cachedImport(
    () => import("../pages/ForgotPasswordPage.jsx"),
  ),
  resetPassword: cachedImport(
    () => import("../pages/ResetPasswordPage.jsx"),
  ),
  paymentSuccess: cachedImport(
    () => import("../pages/PaymentSuccessPage.jsx"),
  ),
  requestRoom: cachedImport(() => import("../pages/RequestRoomPage.jsx")),

  dashboardLayout: cachedImport(
    () => import("../layouts/DashboardLayout/DashboardLayout.jsx"),
  ),
  home: cachedImport(() => import("../pages/HomePage.jsx")),
  profile: cachedImport(() => import("../pages/ProfilePage.jsx")),
  joinedRooms: cachedImport(() => import("../pages/JoinedRooms.jsx")),
  ownedRooms: cachedImport(() => import("../pages/MyOwnRoomsPage.jsx")),
  pendingInvitations: cachedImport(
    () => import("../pages/PendingInvitationsPage.jsx"),
  ),

  demoProviderLayout: cachedImport(
    () => import("../layouts/DemoProviderLayout/DemoProviderLayout.jsx"),
  ),
  demoLayout: cachedImport(
    () => import("../layouts/DemoLayout/DemoLayout.jsx"),
  ),
  demoRedirector: cachedImport(
    () => import("../components/common/DemoRedirector.jsx"),
  ),
  homeDemo: cachedImport(() => import("../pages/HomeDemoPage.jsx")),
  ownerHome: cachedImport(() => import("../pages/OwnerHomePage.jsx")),
  demoMembers: cachedImport(() => import("../pages/DemoMembersPage.jsx")),
  publicLibrary: cachedImport(
    () => import("../pages/PublicLibraryPage.jsx"),
  ),
  groupWorkspace: cachedImport(
    () => import("../pages/GroupWorkspacePage.jsx"),
  ),
  demoAssets: cachedImport(() => import("../pages/DemoAssetsPage.jsx")),
  ownerCourses: cachedImport(
    () => import("../pages/OwnerCoursesPage.jsx"),
  ),
  inquiries: cachedImport(() => import("../pages/InquiriesPage.jsx")),

  departmentLayout: cachedImport(
    () => import("../layouts/DepartmentLayout/DepartmentLayout.jsx"),
  ),
  departmentHome: cachedImport(() => import("../pages/DepartmentPage.jsx")),
  departmentMembers: cachedImport(
    () => import("../pages/DepartmentMembersPage.jsx"),
  ),
  learningPath: cachedImport(
    () => import("../pages/LearningPathPage.jsx"),
  ),
  lives: cachedImport(() => import("../pages/LivesPage.jsx")),
  courses: cachedImport(() => import("../pages/CoursesPage.jsx")),
  leaderboard: cachedImport(
    () => import("../pages/LeaderboardPage.jsx"),
  ),
  roadmaps: cachedImport(() => import("../pages/RoadmapsPage.jsx")),
  tools: cachedImport(() => import("../pages/WorkspaceToolsPage.jsx")),

  // Large or infrequently visited modules stay out of idle preloading.
  certificates: cachedImport(
    () => import("../pages/CertificatesPage.jsx"),
  ),
  courseStudio: cachedImport(
    () =>
      import(
        "../features/Demo/PublishCourse/components/CourseStudio/CourseStudio.jsx"
      ),
  ),
  manageCourse: cachedImport(
    () =>
      import(
        "../features/Demo/OwnerCourses/components/ManageCourse/components/CourseManagerLayout.jsx"
      ),
  ),
  viewCourse: cachedImport(
    () =>
      import(
        "../features/Demo/OwnerCourses/components/ViewCourse/CourseDetailsLayout.jsx"
      ),
  ),
  coursePlayer: cachedImport(
    () => import("../pages/CoursePlayerPage.jsx"),
  ),
  chats: cachedImport(() => import("../pages/ChatsPage.jsx")),
  liveRoom: cachedImport(() => import("../pages/LiveRoomPage.jsx")),
};

const preloadModules = (modules) =>
  Promise.allSettled(modules.map((loadModule) => loadModule()));

const PUBLIC_COMMON_MODULES = [routeModules.signin, routeModules.signup];

const AUTHENTICATED_COMMON_MODULES = [
  routeModules.dashboardLayout,
  routeModules.home,
  routeModules.profile,
  routeModules.demoProviderLayout,
  routeModules.demoLayout,
  routeModules.demoRedirector,
  routeModules.homeDemo,
  routeModules.ownerHome,
  routeModules.departmentLayout,
  routeModules.departmentHome,
  routeModules.courses,
];

export const preloadPublicCommonRoutes = () =>
  preloadModules(PUBLIC_COMMON_MODULES);

export const preloadAuthenticatedCommonRoutes = () =>
  preloadModules(AUTHENTICATED_COMMON_MODULES);

const DASHBOARD_ROUTES = new Map([
  ["/home", [routeModules.dashboardLayout, routeModules.home]],
  ["/profile", [routeModules.dashboardLayout, routeModules.profile]],
  [
    "/joined-rooms",
    [routeModules.dashboardLayout, routeModules.joinedRooms],
  ],
  [
    "/my-own-rooms",
    [routeModules.dashboardLayout, routeModules.ownedRooms],
  ],
  [
    "/pending-invitations",
    [routeModules.dashboardLayout, routeModules.pendingInvitations],
  ],
  [
    "/certificates",
    [routeModules.dashboardLayout, routeModules.certificates],
  ],
]);

const PUBLIC_ROUTES = new Map([
  ["/signin", [routeModules.signin]],
  ["/signup", [routeModules.signup]],
  ["/check-email", [routeModules.verifyEmail]],
  ["/verify-email", [routeModules.verifyAccount]],
  ["/forgot-password", [routeModules.forgotPassword]],
  ["/reset-password", [routeModules.resetPassword]],
  ["/payment-success", [routeModules.paymentSuccess]],
  ["/request-room", [routeModules.requestRoom]],
]);

const DEMO_ROOT_ROUTES = new Map([
  ["departments", routeModules.homeDemo],
  ["analytics-home", routeModules.ownerHome],
  ["members", routeModules.demoMembers],
  ["library", routeModules.publicLibrary],
  ["groups", routeModules.groupWorkspace],
  ["course-studio", routeModules.courseStudio],
  ["manage-course", routeModules.manageCourse],
  ["view-course", routeModules.viewCourse],
  ["demo-assets", routeModules.demoAssets],
  ["manage-courses", routeModules.ownerCourses],
  ["inquiries", routeModules.inquiries],
]);

const DEPARTMENT_ROUTES = new Map([
  ["members", routeModules.departmentMembers],
  ["learning-path", routeModules.learningPath],
  ["demo-assets", routeModules.demoAssets],
  ["lives", routeModules.lives],
  ["course-player", routeModules.coursePlayer],
  ["courses", routeModules.courses],
  ["leaderboard", routeModules.leaderboard],
  ["roadmaps", routeModules.roadmaps],
  ["tools", routeModules.tools],
  ["chats", routeModules.chats],
]);

const preloadDemoRoute = (segments) => {
  const modules = [routeModules.demoProviderLayout];
  const isDepartmentRoute =
    segments[2] === "departments" && Boolean(segments[3]);

  if (!isDepartmentRoute) {
    modules.push(routeModules.demoLayout);

    if (!segments[2]) {
      modules.push(routeModules.demoRedirector);
    } else {
      const pageModule = DEMO_ROOT_ROUTES.get(segments[2]);
      if (pageModule) modules.push(pageModule);
    }

    return preloadModules(modules);
  }

  const departmentPage = segments[4];
  const isLiveRoom =
    departmentPage === "lives" && segments[6] === "room";

  if (isLiveRoom) {
    modules.push(routeModules.liveRoom);
    return preloadModules(modules);
  }

  modules.push(routeModules.departmentLayout);

  if (!departmentPage) {
    modules.push(routeModules.departmentHome);
  } else {
    const pageModule = DEPARTMENT_ROUTES.get(departmentPage);
    if (pageModule) modules.push(pageModule);
  }

  return preloadModules(modules);
};

export const preloadRoute = (pathname) => {
  const normalizedPath = pathname.length > 1
    ? pathname.replace(/\/$/, "")
    : pathname;
  const publicModules = PUBLIC_ROUTES.get(normalizedPath);
  if (publicModules) return preloadModules(publicModules);

  const dashboardModules = DASHBOARD_ROUTES.get(normalizedPath);
  if (dashboardModules) return preloadModules(dashboardModules);

  const segments = normalizedPath.split("/").filter(Boolean);
  if (segments[0] === "demos" && segments[1]) {
    return preloadDemoRoute(segments);
  }

  return Promise.resolve([]);
};
