import { Outlet } from "react-router-dom";
import Navigation from "../components/UI/Navigation";
import Notifications from "../components/UI/Notifications";

const Layout = () => {
  return (
    <>
      <Navigation />
      <Notifications />
      <Outlet />
    </>
  );
};

export default Layout;
