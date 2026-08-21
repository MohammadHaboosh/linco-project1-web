const normalizeMessage = (value) => {
  const messages = Array.isArray(value) ? value : [value];

  return messages
    .filter((message) => typeof message === "string")
    .map((message) => message.trim())
    .filter(Boolean)
    .join(" ");
};

export const getApiErrorMessage = (error, fallback = "") => {
  const candidates = [
    error?.backendMessage,
    error?.response?.data?.message,
    error?.data?.message,
    error?.payload?.message,
    error?.cause?.backendMessage,
    error?.cause?.response?.data?.message,
    error?.cause?.data?.message,
    error?.cause?.message,
    error?.message,
    typeof error === "string" ? error : "",
  ];

  for (const candidate of candidates) {
    const message = normalizeMessage(candidate);
    if (message) return message;
  }

  return normalizeMessage(fallback);
};
