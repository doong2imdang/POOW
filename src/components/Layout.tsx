import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";

export default function Layout() {
  const location = useLocation();

  // Navbar를 숨길 경로 설정
  const hideNavbarRoutes = ["/setmood", "/setchecklist", "/setschedule"];

  // 현재 경로가 hideNavbarRoutes에 포함되는지 확인
  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      <Outlet />
      {!shouldHideNavbar && <NavBar />}
    </>
  );
}
