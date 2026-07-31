import { apiFetch } from "../../../../api/apiFetch";

const DEFAULT_PAGE_SIZE = 15;

const parseResponse = async (
  response,
  fallback = "Unable to load the department conversation.",
) => {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || fallback);
  }

  return payload;
};

const createUploadError = (message, code, cause) => {
  const error = new Error(message, cause ? { cause } : undefined);
  error.code = code;
  return error;
};

export const departmentMessagesApi = {
  getMessages: async ({
    demoId,
    departmentId,
    cursor,
    take = DEFAULT_PAGE_SIZE,
    signal,
  }) => {
    if (!demoId || !departmentId) {
      throw new Error("Demo and department IDs are required.");
    }

    const query = new URLSearchParams({ take: String(take) });
    if (cursor) {
      query.set("cursor", cursor);
    }

    const response = await apiFetch(
      `/departmentMessages/cursor?${query.toString()}`,
      {
        method: "GET",
        headers: {
          "x-demo-id": demoId,
          "x-department-id": departmentId,
        },
        signal,
      },
    );

    const payload = await parseResponse(response);

    return {
      messages: Array.isArray(payload.data) ? payload.data : [],
      meta: {
        hasNextPage: Boolean(payload.meta?.hasNextPage),
        endCursor: payload.meta?.endCursor || null,
      },
    };
  },

  requestUploadUrl: async ({
    demoId,
    departmentId,
    fileName,
    signal,
  }) => {
    if (!demoId || !departmentId) {
      throw new Error("Demo and department IDs are required.");
    }

    if (!fileName) {
      throw new Error("A file name is required.");
    }

    try {
      const response = await apiFetch("/departmentMessages/upload-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-demo-id": demoId,
          "x-department-id": departmentId,
        },
        body: JSON.stringify({ fileName }),
        signal,
      });

      const payload = await parseResponse(
        response,
        "Unable to prepare the attachment upload.",
      );
      const upload = payload.data;

      if (
        !upload?.uploadUrl ||
        !upload?.fileKey ||
        !upload?.fileName ||
        !upload?.cdnUrl
      ) {
        throw new Error("The attachment upload response is incomplete.");
      }

      return upload;
    } catch (error) {
      if (error.name === "AbortError") {
        throw error;
      }

      throw createUploadError(
        error.message || "Unable to prepare the attachment upload.",
        "CHAT_UPLOAD_URL_FAILED",
        error,
      );
    }
  },

  uploadFile: async ({ uploadUrl, file, signal }) => {
    if (!uploadUrl || !file) {
      throw new Error("An upload URL and file are required.");
    }

    try {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        credentials: "omit",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
        signal,
      });

      if (!response.ok) {
        throw new Error(`Attachment upload failed (${response.status}).`);
      }

      return true;
    } catch (error) {
      if (error.name === "AbortError") {
        throw error;
      }

      throw createUploadError(
        error.message || "Unable to upload the attachment.",
        "CHAT_FILE_UPLOAD_FAILED",
        error,
      );
    }
  },
};
