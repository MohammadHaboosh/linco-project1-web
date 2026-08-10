import { apiFetch } from "../../../../api/apiFetch";

const LIVE_STREAMS_PATH = "/liveStreams";
const LIVE_STREAMS_CURSOR_PATH = `${LIVE_STREAMS_PATH}/curosr`;

const requireContext = (demoId, departmentId) => {
  if (!demoId || !departmentId) {
    throw new Error("Demo and department IDs are required.");
  }
};

const requireStreamId = (streamId) => {
  if (!streamId) {
    throw new Error("A live stream ID is required.");
  }
};

const getHeaders = (demoId, departmentId, withJson = false) => ({
  ...(withJson ? { "Content-Type": "application/json" } : {}),
  "x-demo-id": demoId,
  "x-department-id": departmentId,
});

const parseResponse = async (response, fallbackMessage) => {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || fallbackMessage);
  }

  return payload;
};

const requestStreamAction = async ({
  demoId,
  departmentId,
  streamId,
  action,
  fallbackMessage,
  signal,
}) => {
  requireContext(demoId, departmentId);
  requireStreamId(streamId);

  const response = await apiFetch(
    `${LIVE_STREAMS_PATH}/${encodeURIComponent(streamId)}/${action}`,
    {
      method: "POST",
      headers: getHeaders(demoId, departmentId),
      signal,
    },
  );
  const payload = await parseResponse(response, fallbackMessage);

  if (!payload.data || typeof payload.data !== "object") {
    throw new Error("The live stream response is incomplete.");
  }

  return payload.data;
};

export const liveStreamsApi = {
  create: async ({
    demoId,
    departmentId,
    title,
    description,
    scheduledAt,
    signal,
  }) => {
    requireContext(demoId, departmentId);

    const normalizedTitle = String(title ?? "").trim();
    const normalizedDescription = String(description ?? "").trim();

    if (!normalizedTitle || !normalizedDescription || !scheduledAt) {
      throw new Error("Title, description, and schedule are required.");
    }

    const response = await apiFetch(LIVE_STREAMS_PATH, {
      method: "POST",
      headers: getHeaders(demoId, departmentId, true),
      body: JSON.stringify({
        title: normalizedTitle,
        description: normalizedDescription,
        scheduledAt,
      }),
      signal,
    });
    const payload = await parseResponse(
      response,
      "Unable to create the live stream.",
    );

    if (!payload.data || typeof payload.data !== "object") {
      throw new Error("The created live stream response is incomplete.");
    }

    return payload.data;
  },

  getAll: async ({ demoId, departmentId, cursor, signal }) => {
    requireContext(demoId, departmentId);

    const query = new URLSearchParams();
    if (cursor) {
      query.set("cursor", cursor);
    }

    const queryString = query.toString();
    const response = await apiFetch(
      `${LIVE_STREAMS_CURSOR_PATH}${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: getHeaders(demoId, departmentId),
        signal,
      },
    );
    const payload = await parseResponse(
      response,
      "Unable to load live streams.",
    );

    return {
      streams: Array.isArray(payload.data) ? payload.data : [],
      meta: {
        hasNextPage: Boolean(payload.meta?.hasNextPage),
        endCursor: payload.meta?.endCursor || null,
      },
    };
  },

  getById: async ({ demoId, departmentId, streamId, signal }) => {
    requireContext(demoId, departmentId);
    requireStreamId(streamId);

    const response = await apiFetch(
      `${LIVE_STREAMS_PATH}/${encodeURIComponent(streamId)}`,
      {
        method: "GET",
        headers: getHeaders(demoId, departmentId),
        signal,
      },
    );
    const payload = await parseResponse(
      response,
      "Unable to load the live stream.",
    );

    if (!payload.data || typeof payload.data !== "object") {
      throw new Error("The live stream response is incomplete.");
    }

    return payload.data;
  },

  start: (options) =>
    requestStreamAction({
      ...options,
      action: "start",
      fallbackMessage: "Unable to start the live stream.",
    }),

  end: (options) =>
    requestStreamAction({
      ...options,
      action: "end",
      fallbackMessage: "Unable to end the live stream.",
    }),

  generateToken: async ({ demoId, departmentId, streamId, signal }) => {
    const tokenData = await requestStreamAction({
      demoId,
      departmentId,
      streamId,
      action: "token",
      fallbackMessage: "Unable to join the live stream.",
      signal,
    });

    if (!tokenData.token || !tokenData.roomName || !tokenData.appId) {
      throw new Error("The live stream token response is incomplete.");
    }

    return tokenData;
  },
};
