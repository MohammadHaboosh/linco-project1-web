import LiveRoom from "../features/Demo/Lives/components/LiveRoom/LiveRoom";
import { DemoProvider } from "../hooks/useDemo";
import AuthSessionBoundary from "../components/common/AuthSessionBoundary";

const LiveRoomPage = () => {
  return (
    <AuthSessionBoundary>
      <DemoProvider>
        <LiveRoom />
      </DemoProvider>
    </AuthSessionBoundary>
  );
};

export default LiveRoomPage;
