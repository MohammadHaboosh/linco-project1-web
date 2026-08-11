import RequestRoom from "../features/RequestRoom/components/RequestRoom.jsx";
import AuthSessionBoundary from "../components/common/AuthSessionBoundary.jsx";

const requestRoom = () => {
  return (
    <AuthSessionBoundary>
      <div>
        <RequestRoom />
      </div>
    </AuthSessionBoundary>
  );
};

export default requestRoom;
