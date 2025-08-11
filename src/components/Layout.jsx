import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";

function Layout() {
  const location = useLocation();
  const hideHeader = location.pathname === "/login";

  return (
    <div>
      {!hideHeader && <Header />}
      <Outlet />
    </div>
  );
}

export default Layout;
