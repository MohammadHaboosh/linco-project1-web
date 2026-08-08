import { useDemo } from "../../../../hooks/useDemo";
import TraineeInquiries from "./TraineeView/TraineeInquiries";
import ManagerInbox from "./ManagerView/ManagerInbox";

const InquiriesContent = () => {
  const { demoId, currentRoleView } = useDemo();

  if (currentRoleView === "member") {
    return <TraineeInquiries demoId={demoId} />;
  }

  if (currentRoleView === "owner" || currentRoleView === "admin") {
    return <ManagerInbox demoId={demoId} />;
  }

  return null;
};

export default InquiriesContent;
