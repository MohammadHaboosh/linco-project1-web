import { apiFetch } from "../../../../api/apiFetch";

const parseResponse = async (response, fallbackMessage) => {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || fallbackMessage);
  }

  return payload;
};

const parseInquiriesResponse = async (response) => {
  const payload = await parseResponse(response, "Failed to fetch inquiries.");

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

const createInquiry = async (demoId, inquiry) => {
  if (!demoId) {
    throw new Error("Demo ID is required to create an inquiry.");
  }

  const subject = String(inquiry?.subject || "").trim();
  const message = String(inquiry?.message || "").trim();

  if (!subject || !message) {
    throw new Error("An inquiry subject and message are required.");
  }

  const response = await apiFetch("/inquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-demo-id": demoId,
    },
    body: JSON.stringify({ subject, message }),
  });
  const payload = await parseResponse(response, "Failed to create inquiry.");

  if (!payload.data || typeof payload.data !== "object") {
    throw new Error("The created inquiry response is invalid.");
  }

  return payload.data;
};

const createInquiryReply = async (demoId, inquiryId, replyMessage) => {
  if (!demoId) {
    throw new Error("Demo ID is required to reply to an inquiry.");
  }

  if (!inquiryId) {
    throw new Error("Inquiry ID is required to create a reply.");
  }

  const message = String(replyMessage || "").trim();
  if (!message) {
    throw new Error("A reply message is required.");
  }

  const response = await apiFetch(
    `/inquiries/${encodeURIComponent(inquiryId)}/inquiryReplies`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-demo-id": demoId,
      },
      body: JSON.stringify({ message }),
    },
  );
  const payload = await parseResponse(
    response,
    "Failed to respond to inquiry.",
  );

  if (
    !payload.data ||
    typeof payload.data !== "object" ||
    !String(payload.data.message || "").trim()
  ) {
    throw new Error("The inquiry reply response is invalid.");
  }

  return payload.data;
};

export const inquiriesApi = {
  getManagerInquiries: (demoId, options) =>
    getInquiries("/inquiries/cursor", demoId, options),

  getMemberInquiries: (demoId, options) =>
    getInquiries("/inquiries/cursor/me", demoId, options),

  createInquiry,
  createInquiryReply,
};
