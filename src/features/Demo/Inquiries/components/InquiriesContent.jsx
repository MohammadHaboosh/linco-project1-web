import { useDemo } from "../../../../hooks/useDemo";
import TraineeInquiries from "./TraineeView/TraineeInquiries";
import ManagerInbox from "./ManagerView/ManagerInbox";

const InquiriesContent = () => {
  const { currentRoleView } = useDemo();

  if (currentRoleView === "member") {
    return <TraineeInquiries />;
  }

  if (currentRoleView === "owner" || currentRoleView === "admin") {
    return <ManagerInbox role={currentRoleView} />;
  }

  return null;
};

export default InquiriesContent;
