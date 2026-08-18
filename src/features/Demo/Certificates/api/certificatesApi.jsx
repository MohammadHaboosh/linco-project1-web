import { apiFetch } from "../../../../api/apiFetch";

export const certificatesApi = {
  getMyCertificates: async () => {
    const response = await apiFetch(`/certifications/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch certificates");
    }

    return data.data || [];
  },
};
