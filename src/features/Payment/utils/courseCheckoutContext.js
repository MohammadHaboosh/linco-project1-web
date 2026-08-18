const COURSE_CHECKOUT_CONTEXT_KEY = "linco-course-checkout-context";

const normalizeId = (value) => String(value || "").trim();

export const saveCourseCheckoutContext = ({ courseId, demoId }) => {
  const normalizedCourseId = normalizeId(courseId);
  const normalizedDemoId = normalizeId(demoId);

  if (
    typeof window === "undefined" ||
    !normalizedCourseId ||
    !normalizedDemoId
  ) {
    return;
  }

  try {
    window.sessionStorage.setItem(
      COURSE_CHECKOUT_CONTEXT_KEY,
      JSON.stringify({
        courseId: normalizedCourseId,
        demoId: normalizedDemoId,
      }),
    );
  } catch {
    // The payment flow still works when session storage is unavailable.
  }
};

export const getCourseCheckoutContext = (courseId) => {
  const normalizedCourseId = normalizeId(courseId);
  if (typeof window === "undefined" || !normalizedCourseId) return null;

  try {
    const context = JSON.parse(
      window.sessionStorage.getItem(COURSE_CHECKOUT_CONTEXT_KEY) || "null",
    );
    const storedCourseId = normalizeId(context?.courseId);
    const storedDemoId = normalizeId(context?.demoId);

    if (storedCourseId !== normalizedCourseId || !storedDemoId) return null;

    return {
      courseId: storedCourseId,
      demoId: storedDemoId,
    };
  } catch {
    return null;
  }
};

export const clearCourseCheckoutContext = (courseId) => {
  const normalizedCourseId = normalizeId(courseId);
  if (typeof window === "undefined" || !normalizedCourseId) return;

  try {
    const context = JSON.parse(
      window.sessionStorage.getItem(COURSE_CHECKOUT_CONTEXT_KEY) || "null",
    );

    if (normalizeId(context?.courseId) === normalizedCourseId) {
      window.sessionStorage.removeItem(COURSE_CHECKOUT_CONTEXT_KEY);
    }
  } catch {
    // Ignore unavailable or malformed session storage values.
  }
};
