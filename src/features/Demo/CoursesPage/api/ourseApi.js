const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const courseApi = {
  getAllCourses: async (departmentId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/departments/${departmentId}/courses`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-client-type": "web",
          },
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }
      return data;
    } catch (error) {
      console.error("API Error during fetching all courses:", error);
      throw error;
    }
  },

  // جلب تفاصيل كورس واحد (بما في ذلك الأقسام والدروس)
  getCourseById: async (courseId) => {
    try {
      const response = await fetch(`${BASE_URL}/courses/${courseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }
      return data;
    } catch (error) {
      console.error(`API Error during fetching course ${courseId}:`, error);
      throw error;
    }
  },

  // إنشاء كورس جديد مع المنهج (Curriculum)
  createCourse: async (coursePayload) => {
    try {
      const response = await fetch(`${BASE_URL}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
        },
        credentials: "include",
        body: JSON.stringify(coursePayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }
      return data;
    } catch (error) {
      console.error("API Error during course creation:", error);
      throw error;
    }
  },

  // تحديث كورس موجود
  updateCourse: async (courseId, coursePayload) => {
    try {
      const response = await fetch(`${BASE_URL}/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
        },
        credentials: "include",
        body: JSON.stringify(coursePayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }
      return data;
    } catch (error) {
      console.error(`API Error during updating course ${courseId}:`, error);
      throw error;
    }
  },

  // حذف كورس
  deleteCourse: async (courseId) => {
    try {
      const response = await fetch(`${BASE_URL}/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }
      return data;
    } catch (error) {
      console.error(`API Error during deleting course ${courseId}:`, error);
      throw error;
    }
  },
};
