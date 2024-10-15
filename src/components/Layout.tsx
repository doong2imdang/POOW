import { Outlet } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <NavBar />
    </>
  );
}
