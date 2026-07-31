import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const SCROLL_BOTTOM_THRESHOLD = 120;

const getProgrammaticScrollBehavior = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

export const useChatScroll = ({
  messages,
  isLoadingHistory,
  isLoadingOlder,
  hasNextPage,
  loadOlderMessages,
}) => {
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [pendingNavigationMessageId, setPendingNavigationMessageId] =
    useState(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const scrollAreaRef = useRef(null);
  const shouldStickToBottomRef = useRef(true);
  const hasCompletedInitialScrollRef = useRef(false);
  const pendingScrollPreservationRef = useRef(null);
  const isRestoringScrollRef = useRef(false);
  const restoreScrollFrameRef = useRef(null);
  const highlightTimeoutRef = useRef(null);

  useEffect(
    () => () => {
      if (restoreScrollFrameRef.current) {
        cancelAnimationFrame(restoreScrollFrameRef.current);
      }

      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    },
    [],
  );

  useLayoutEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea || isLoadingHistory) {
      return;
    }

    const pendingPreservation = pendingScrollPreservationRef.current;
    if (pendingPreservation) {
      if (isLoadingOlder) {
        return;
      }

      if (messages.length > pendingPreservation.messageCount) {
        const addedHeight =
          scrollArea.scrollHeight - pendingPreservation.scrollHeight;
        isRestoringScrollRef.current = true;
        scrollArea.scrollTop = pendingPreservation.scrollTop + addedHeight;

        restoreScrollFrameRef.current = requestAnimationFrame(() => {
          restoreScrollFrameRef.current = requestAnimationFrame(() => {
            isRestoringScrollRef.current = false;
            restoreScrollFrameRef.current = null;
          });
        });
      }
      pendingScrollPreservationRef.current = null;
      return;
    }

    if (!hasCompletedInitialScrollRef.current) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
      hasCompletedInitialScrollRef.current = true;
      return;
    }

    if (shouldStickToBottomRef.current) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [isLoadingHistory, isLoadingOlder, messages]);

  const handleLoadOlder = useCallback(async () => {
    const scrollArea = scrollAreaRef.current;
    if (
      !scrollArea ||
      isRestoringScrollRef.current ||
      !hasNextPage ||
      isLoadingOlder ||
      pendingScrollPreservationRef.current
    ) {
      return false;
    }

    pendingScrollPreservationRef.current = {
      scrollHeight: scrollArea.scrollHeight,
      scrollTop: scrollArea.scrollTop,
      messageCount: messages.length,
    };

    const loaded = await loadOlderMessages();
    if (!loaded) {
      pendingScrollPreservationRef.current = null;
    }
    return loaded;
  }, [hasNextPage, isLoadingOlder, loadOlderMessages, messages.length]);

  const handleScroll = useCallback(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea || isRestoringScrollRef.current) {
      return;
    }

    const distanceFromBottom =
      scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight;
    const isNearBottom = distanceFromBottom < SCROLL_BOTTOM_THRESHOLD;
    shouldStickToBottomRef.current = isNearBottom;
    setShowScrollToBottom(!isNearBottom);

    if (scrollArea.scrollTop < 80 && hasNextPage && !isLoadingOlder) {
      void handleLoadOlder();
    }
  }, [handleLoadOlder, hasNextPage, isLoadingOlder]);

  const handleNavigateToReply = useCallback((messageId) => {
    if (messageId === null || messageId === undefined || messageId === "") {
      return;
    }

    setPendingNavigationMessageId(String(messageId));
  }, []);

  const handleScrollToBottom = useCallback(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) {
      return;
    }

    setPendingNavigationMessageId(null);
    shouldStickToBottomRef.current = true;
    scrollArea.scrollTo({
      top: scrollArea.scrollHeight,
      behavior: getProgrammaticScrollBehavior(),
    });
  }, []);

  useEffect(() => {
    if (
      pendingNavigationMessageId === null ||
      isLoadingHistory ||
      isLoadingOlder ||
      pendingScrollPreservationRef.current
    ) {
      return undefined;
    }

    const navigationFrame = requestAnimationFrame(() => {
      const scrollArea = scrollAreaRef.current;
      if (!scrollArea) {
        return;
      }

      const targetMessage = Array.from(
        scrollArea.querySelectorAll("[data-message-id]"),
      ).find(
        (element) =>
          element.dataset.messageId === pendingNavigationMessageId,
      );

      if (!targetMessage) {
        if (hasNextPage) {
          void handleLoadOlder().then((loaded) => {
            if (!loaded) {
              setPendingNavigationMessageId((currentId) =>
                currentId === pendingNavigationMessageId ? null : currentId,
              );
            }
          });
        } else {
          setPendingNavigationMessageId(null);
        }
        return;
      }

      const scrollAreaRect = scrollArea.getBoundingClientRect();
      const targetRect = targetMessage.getBoundingClientRect();
      const maximumScrollTop =
        scrollArea.scrollHeight - scrollArea.clientHeight;
      const targetScrollTop = Math.max(
        0,
        Math.min(
          maximumScrollTop,
          scrollArea.scrollTop +
            targetRect.top -
            scrollAreaRect.top -
            (scrollArea.clientHeight - targetRect.height) / 2,
        ),
      );
      const willBeAwayFromBottom =
        maximumScrollTop - targetScrollTop >= SCROLL_BOTTOM_THRESHOLD;

      shouldStickToBottomRef.current = !willBeAwayFromBottom;
      setShowScrollToBottom(willBeAwayFromBottom);
      scrollArea.scrollTo({
        top: targetScrollTop,
        behavior: getProgrammaticScrollBehavior(),
      });
      targetMessage.focus({ preventScroll: true });

      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
      setHighlightedMessageId(pendingNavigationMessageId);
      highlightTimeoutRef.current = setTimeout(() => {
        setHighlightedMessageId((currentId) =>
          currentId === pendingNavigationMessageId ? null : currentId,
        );
        highlightTimeoutRef.current = null;
      }, 1800);
      setPendingNavigationMessageId(null);
    });

    return () => cancelAnimationFrame(navigationFrame);
  }, [
    handleLoadOlder,
    hasNextPage,
    isLoadingHistory,
    isLoadingOlder,
    messages,
    pendingNavigationMessageId,
  ]);

  return {
    scrollAreaRef,
    showScrollToBottom,
    highlightedMessageId,
    handleLoadOlder,
    handleScroll,
    handleNavigateToReply,
    handleScrollToBottom,
  };
};
