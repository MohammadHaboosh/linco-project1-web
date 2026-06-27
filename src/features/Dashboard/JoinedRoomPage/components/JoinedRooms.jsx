import { useNavigate } from "react-router-dom";
import RoomsListLayout from "../../../../components/layouts/RoomList/RoomListLayout.jsx";

const JoinedRoomsPage = () => {
  const navigate = useNavigate();

  const joinedRooms = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    companyName: `Company Demo Name ${index + 1}`,
    role: "Trainee",
    dateJoined: "12/12/2025",
    members: 120,
  }));

  return (
    <RoomsListLayout
      title="Joined Training Rooms"
      statsTitle="Number of training companies"
      rooms={joinedRooms}
      bannerImage="/images/joined-rooms.png"
      onBackClick={() => navigate(-1)}
    />
  );
};

export default JoinedRoomsPage;
