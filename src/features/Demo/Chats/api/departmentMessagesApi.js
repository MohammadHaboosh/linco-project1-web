import { apiFetch } from "../../../../api/apiFetch";

const DEFAULT_PAGE_SIZE = 15;

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload.message || "Unable to load the department conversation.",
    );
  }

  return payload;
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
};

