import HeaderBanner from "../../components/layouts/HeaderBanner/HeaderBanner";
import PendingInvitations from "../../features/dashboard/components/PendingInvitations/PendingInvitations";
import ActiveRooms from "../../features/dashboard/components/ActiveRooms/ActiveRooms";

const Home = () => {
  return (
    <>
      <HeaderBanner
        title="Ready to dive into your learning, Abrar ?"
        text="Manage your company invites, track your active training rooms, and level up your career from   one single dashboard."
      />
      <PendingInvitations />
      <ActiveRooms />
    </>
  );
};

export default Home;
