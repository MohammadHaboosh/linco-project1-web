import LiveRoom from "../features/Demo/Lives/components/LiveRoom/LiveRoom";
import { DemoProvider } from "../hooks/useDemo";

const LiveRoomPage = () => {
  return (
    <DemoProvider>
      <LiveRoom />
    </DemoProvider>
  );
};

export default LiveRoomPage;
