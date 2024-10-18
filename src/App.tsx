import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import Splash from "./routes/Splash";
import SetProfile from "./routes/SetProfile";
import CheckList from "./routes/CheckList";
import EditProfile from "./routes/EditProfile";
import Mood from "./routes/Mood";
import Schedule from "./routes/Schedule";
import SetCheckList from "./routes/SetCheckList";
import Search from "./routes/Search";
import SetMood from "./routes/SetMood";
import SetSchedule from "./routes/SetSchedule";
import Error from "./routes/Error";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import styled from "styled-components";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "setprofile",
        element: <SetProfile />,
      },
      {
        path: "checklist",
        element: <CheckList />,
      },
      {
        path: "setchecklist",
        element: <SetCheckList />,
      },
      {
        path: "editprofile",
        element: <EditProfile />,
      },
      {
        path: "mood",
        element: <Mood />,
      },
      {
        path: "setmood",
        element: <SetMood />,
      },
      {
        path: "schedule",
        element: <Schedule />,
      },
      {
        path: "setschedule",
        element: <SetSchedule />,
      },
      {
        path: "search",
        element: <Search />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/splash",
    element: <Splash />,
  },
  {
    path: "/error",
    element: <Error />,
  },
]);

const GlobalStyles = createGlobalStyle`
${reset};

  :root {
    --color-dark :#4E434E;
    --color-main :#DD93E5;
    --color-disabled:#B3A7B4;
    --color-bg:#FFDDFF;
  }

  body {
background: white;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  * {
    box-sizing : border-box;
  }

  button {
    border: 0;
    background: transparent;
    cursor: pointer;
    padding: 0;
    margin: 0;
  }

  input {
    border: 0;
    background: transparent;
    margin: 0;
    padding: 0;
  }

`;

const Container = styled.div`
  width: 390px;
  height: 100vh;
  margin: 0 auto;
  background: white;
`;

function App() {
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <GlobalStyles />
      <Container>
        {splashVisible ? <Splash /> : ""}
        <RouterProvider router={router} />
      </Container>
    </>
  );
}

export default App;
