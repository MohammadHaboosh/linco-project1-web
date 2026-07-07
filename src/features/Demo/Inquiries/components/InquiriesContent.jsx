import { useDemo } from "../../../../hooks/useDemo";
import TraineeInquiries from "./TraineeView/TraineeInquiries";
import ManagerInbox from "./ManagerView/ManagerInbox";

const InquiriesContent = () => {
  const { currentRoleView } = useDemo();

  if (currentRoleView === "trainee") {
    return <TraineeInquiries />;
  }

  if (currentRoleView === "owner" || currentRoleView === "sectionManager") {
    return <ManagerInbox role={currentRoleView} />;
  }

  return null;
};

export default InquiriesContent;
