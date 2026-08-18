export const isDemoSubscriptionExpired = (demoData) =>
  String(
    demoData?.subscriptionStatus || demoData?.subscription?.status || "",
  )
    .trim()
    .toLowerCase() === "expired";
