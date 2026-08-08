import { apiFetch } from "../../../../api/apiFetch";

const parseInquiriesResponse = async (response) => {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Failed to fetch inquiries.");
  }

  return {
    data: Array.isArray(payload.data) ? payload.data : [],
    meta: {
      hasNextPage: Boolean(payload.meta?.hasNextPage),
      endCursor: payload.meta?.endCursor || null,
    },
  };
};

const getInquiries = async (path, demoId, options = {}) => {
  if (!demoId) {
    throw new Error("Demo ID is required to fetch inquiries.");
  }

  const query = new URLSearchParams();
  if (options.cursor) {
    query.set("cursor", options.cursor);
  }

  const queryString = query.toString();
  const requestPath = queryString ? `${path}?${queryString}` : path;
  const response = await apiFetch(requestPath, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-demo-id": demoId,
    },
    signal: options.signal,
  });

  return parseInquiriesResponse(response);
};

export const inquiriesApi = {
  getManagerInquiries: (demoId, options) =>
    getInquiries("/inquiries/cursor", demoId, options),

  getMemberInquiries: (demoId, options) =>
    getInquiries("/inquiries/cursor/me", demoId, options),
};
