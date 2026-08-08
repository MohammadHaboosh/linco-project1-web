import { apiFetch } from "../../../../api/apiFetch";

export const libraryApi = {
  getCourses: async (demoId) => {
    if (!demoId) throw new Error("Demo ID is required");

    const response = await apiFetch(`/courses/cursor`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch public courses");
    }

    console.log("Fetched public Courses:", data.data);
    return data.data;
  },

  getAllTags: async () => {
    const response = await apiFetch(`/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch tags");
    }

    console.log("Fetched Tags:", data.data);
    return data.data;
  },

  buyCourse: async (demoId, courseId) => {
    try {
      const response = await apiFetch(`/payments/checkout/course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
          "x-demo-id": demoId,
        },
        body: JSON.stringify({ courseId: courseId }),
      });

      const data = await response.json();
      console.log("Buy Course Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to buy course");
      }
      return data;
    } catch (error) {
      console.error("API Error during course purchase:", error);
      throw error;
    }
  },

  getPaymentStatus: async (sessionId) => {
    try {
      const response = await apiFetch(
        `/payments/checkout/status?session_id=${sessionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-client-type": "web",
          },
        },
      );

      const data = await response.json();
      console.log("Payment Status Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch payment status");
      }

      return data;
    } catch (error) {
      console.error("API Error checking payment status:", error);
      throw error;
    }
  },
};
