const asTimestamp = (value) => {
  const timestamp = new Date(value || 0).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const MESSAGE_GROUP_WINDOW = 5 * 60 * 1000;

export const shouldGroupMessages = (previousMessage, nextMessage) => {
  const previousSenderId = previousMessage?.sender?.id;
  const nextSenderId = nextMessage?.sender?.id;

  if (!previousSenderId || previousSenderId !== nextSenderId) {
    return false;
  }

  const previousTimestamp = asTimestamp(previousMessage.createdAt);
  const nextTimestamp = asTimestamp(nextMessage?.createdAt);
  if (!previousTimestamp || !nextTimestamp) {
    return false;
  }

  const previousDate = new Date(previousTimestamp);
  const nextDate = new Date(nextTimestamp);
  const isSameDay =
    previousDate.getFullYear() === nextDate.getFullYear() &&
    previousDate.getMonth() === nextDate.getMonth() &&
    previousDate.getDate() === nextDate.getDate();
  const timeDifference = nextTimestamp - previousTimestamp;

  return (
    isSameDay &&
    timeDifference >= 0 &&
    timeDifference <= MESSAGE_GROUP_WINDOW
  );
};

const hasOwn = (value, key) =>
  Object.prototype.hasOwnProperty.call(value || {}, key);

export const normalizeDepartmentMember = (member, currentMember = null) => {
  const departmentMemberId =
    member?.departmentMemberId || member?.id || currentMember?.departmentMemberId;

  if (!departmentMemberId) {
    return null;
  }

  return {
    departmentMemberId,
    firstName: hasOwn(member, "firstName")
      ? member.firstName || ""
      : currentMember?.firstName || "",
    lastName: hasOwn(member, "lastName")
      ? member.lastName || ""
      : currentMember?.lastName || "",
    imagePath: hasOwn(member, "imagePath")
      ? member.imagePath || ""
      : currentMember?.imagePath || "",
  };
};

export const mergeDepartmentMembersById = (
  currentMembers,
  incomingMembers,
) => {
  const memberMap = new Map(
    currentMembers
      .map((member) => normalizeDepartmentMember(member))
      .filter(Boolean)
      .map((member) => [member.departmentMemberId, member]),
  );
  const safeIncomingMembers = Array.isArray(incomingMembers)
    ? incomingMembers
    : [incomingMembers];

  safeIncomingMembers.forEach((member) => {
    const memberId = member?.departmentMemberId || member?.id;
    if (!memberId) {
      return;
    }

    const normalizedMember = normalizeDepartmentMember(
      member,
      memberMap.get(memberId),
    );
    memberMap.set(memberId, normalizedMember);
  });

  return Array.from(memberMap.values()).sort((first, second) => {
    const firstName = `${first.firstName} ${first.lastName}`.trim();
    const secondName = `${second.firstName} ${second.lastName}`.trim();
    return (
      firstName.localeCompare(secondName) ||
      first.departmentMemberId.localeCompare(second.departmentMemberId)
    );
  });
};

export const getDepartmentMemberName = (member, fallback = "Unknown member") => {
  const fullName = [member?.firstName, member?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || fallback;
};

export const getDepartmentMemberInitials = (member) => {
  const initials = [
    member?.firstName?.charAt(0),
    member?.lastName?.charAt(0),
  ]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return initials || "?";
};

export const formatFileSize = (value, language) => {
  const size = Number(value);
  if (!Number.isFinite(size) || size < 0) {
    return "";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  const units = ["KB", "MB", "GB", "TB"];
  let unitIndex = -1;
  let formattedSize = size;

  do {
    formattedSize /= 1024;
    unitIndex += 1;
  } while (formattedSize >= 1024 && unitIndex < units.length - 1);

  return `${new Intl.NumberFormat(language, {
    maximumFractionDigits: 1,
  }).format(formattedSize)} ${units[unitIndex]}`;
};

const normalizeAttachment = (attachment) => {
  if (!attachment) {
    return null;
  }

  return {
    fileUrl: attachment.fileUrl || "",
    fileName: attachment.fileName || "",
    mimeType: attachment.mimeType || "application/octet-stream",
    fileSize:
      typeof attachment.fileSize === "number" ? attachment.fileSize : null,
  };
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
  attachment: normalizeAttachment(message?.attachment),
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
  return getDepartmentMemberName(message?.sender);
};

export const getSenderInitials = (message) => {
  return getDepartmentMemberInitials(message?.sender);
};
