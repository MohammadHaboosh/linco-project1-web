const asTimestamp = (value) => {
  const timestamp = new Date(value || 0).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const normalizeMessage = (message) => ({
  ...message,
  content: message?.content ?? "",
  sender: {
    id: message?.sender?.id || "",
    firstName: message?.sender?.firstName || "",
    lastName: message?.sender?.lastName || "",
    imagePath: message?.sender?.imagePath || "",
  },
  attachment: message?.attachment || null,
  replyTo: message?.replyTo || null,
});

export const mergeMessagesById = (currentMessages, incomingMessages) => {
  const messageMap = new Map(
    currentMessages.map((message) => [message.id, message]),
  );

  incomingMessages.forEach((message) => {
    if (message?.id) {
      messageMap.set(message.id, normalizeMessage(message));
    }
  });

  return Array.from(messageMap.values()).sort((first, second) => {
    const timeDifference =
      asTimestamp(first.createdAt) - asTimestamp(second.createdAt);

    if (timeDifference !== 0) {
      return timeDifference;
    }

    return String(first.id).localeCompare(String(second.id));
  });
};

export const getSenderName = (message) => {
  const fullName = [
    message?.sender?.firstName,
    message?.sender?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || "Unknown member";
};

export const getSenderInitials = (message) => {
  const initials = [
    message?.sender?.firstName?.charAt(0),
    message?.sender?.lastName?.charAt(0),
  ]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return initials || "?";
};

