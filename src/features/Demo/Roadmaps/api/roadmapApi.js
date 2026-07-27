import { apiFetch } from "../../../../api/apiFetch";

const GENERATE_ROADMAP_PATH = "/departments/generate-roadmap";

export const roadmapApi = {
  generate: async (title, demoId, departmentId, options = {}) => {
    const normalizedTitle = String(title ?? "").trim();

    if (!normalizedTitle) {
      throw new Error("A roadmap title is required.");
    }

    const response = await apiFetch(GENERATE_ROADMAP_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-type": "web",
        "x-demo-id": demoId,
        "x-department-id": departmentId,
      },
      body: JSON.stringify({ title: normalizedTitle }),
      signal: options.signal,
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok || responseData.success === false) {
      throw new Error(responseData.message || "Failed to generate roadmap.");
    }

    if (!responseData.data || typeof responseData.data !== "object") {
      throw new Error("The generated roadmap response is invalid.");
    }

    return responseData.data;
  },
};
