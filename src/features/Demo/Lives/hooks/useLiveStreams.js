import { useCallback, useEffect, useState } from "react";
import { liveStreamsApi } from "../api/liveStreamsApi";

const EMPTY_META = {
  hasNextPage: false,
  endCursor: null,
};

const mergeUniqueStreams = (currentStreams, nextStreams) => {
  const streamsById = new Map(
    currentStreams.map((stream) => [stream.id, stream]),
  );

  nextStreams.forEach((stream) => {
    streamsById.set(stream.id, stream);
  });

  return Array.from(streamsById.values());
};

export const useLiveStreams = ({ demoId, departmentId }) => {
  const hasContext = Boolean(demoId && departmentId);
  const [streams, setStreams] = useState([]);
  const [meta, setMeta] = useState(EMPTY_META);
  const [isLoading, setIsLoading] = useState(hasContext);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    if (!hasContext) {
      return () => controller.abort();
    }

    const loadInitialStreams = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await liveStreamsApi.getAll({
          demoId,
          departmentId,
          signal: controller.signal,
        });
        setStreams(result.streams);
        setMeta(result.meta);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError("live-streams-load-error-message");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialStreams();

    return () => controller.abort();
  }, [demoId, departmentId, hasContext]);

  const refetch = useCallback(async ({ silent = false } = {}) => {
    if (!hasContext) return;

    if (!silent) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const result = await liveStreamsApi.getAll({ demoId, departmentId });
      setStreams(result.streams);
      setMeta(result.meta);
    } catch (requestError) {
      setError("live-streams-load-error-message");
      throw requestError;
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, [demoId, departmentId, hasContext]);

  const loadMore = useCallback(async () => {
    if (
      !hasContext ||
      !meta.hasNextPage ||
      !meta.endCursor ||
      isLoadingMore
    ) {
      return;
    }

    setIsLoadingMore(true);
    setError(null);

    try {
      const result = await liveStreamsApi.getAll({
        demoId,
        departmentId,
        cursor: meta.endCursor,
      });
      setStreams((current) =>
        mergeUniqueStreams(current, result.streams),
      );
      setMeta(result.meta);
    } catch {
      setError("live-streams-load-more-error-message");
    } finally {
      setIsLoadingMore(false);
    }
  }, [demoId, departmentId, hasContext, isLoadingMore, meta]);

  const replaceStream = useCallback((updatedStream) => {
    setStreams((current) => {
      const streamExists = current.some(
        (stream) => stream.id === updatedStream.id,
      );

      if (!streamExists) {
        return [updatedStream, ...current];
      }

      return current.map((stream) =>
        stream.id === updatedStream.id ? updatedStream : stream,
      );
    });
  }, []);

  const createLiveStream = useCallback(
    async (streamData) => {
      const createdStream = await liveStreamsApi.create({
        demoId,
        departmentId,
        ...streamData,
      });
      replaceStream(createdStream);
      return createdStream;
    },
    [demoId, departmentId, replaceStream],
  );

  const startLiveStream = useCallback(
    async (streamId) => {
      const startedStream = await liveStreamsApi.start({
        demoId,
        departmentId,
        streamId,
      });
      replaceStream(startedStream);
      return startedStream;
    },
    [demoId, departmentId, replaceStream],
  );

  const endLiveStream = useCallback(
    async (streamId) => {
      const endedStream = await liveStreamsApi.end({
        demoId,
        departmentId,
        streamId,
      });
      replaceStream(endedStream);
      return endedStream;
    },
    [demoId, departmentId, replaceStream],
  );

  const getLiveStream = useCallback(
    (streamId) =>
      liveStreamsApi.getById({ demoId, departmentId, streamId }),
    [demoId, departmentId],
  );

  const generateLiveStreamToken = useCallback(
    (streamId) =>
      liveStreamsApi.generateToken({ demoId, departmentId, streamId }),
    [demoId, departmentId],
  );

  return {
    streams,
    isLoading,
    isLoadingMore,
    error: hasContext ? error : "live-stream-context-missing",
    hasNextPage: meta.hasNextPage,
    refetch,
    loadMore,
    createLiveStream,
    startLiveStream,
    endLiveStream,
    getLiveStream,
    generateLiveStreamToken,
  };
};
