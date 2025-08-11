import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Rooms from "../pages/Rooms";
import NotFound from "../pages/NotFound";

const routes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/profile", element: <Profile /> },
  { path: "/rooms", element: <Rooms /> },
  { path: "*", element: <NotFound /> }
];

export default routes;
