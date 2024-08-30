import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";
import Layout from "./pages/Layout.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import GroupsPage from "./pages/GroupsPage.tsx";
import UsersPage from "./pages/UsersPage.tsx";
import EventsPage from "./pages/EventsPage.tsx";
import RequestPage from "./pages/RequestPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: <Layout />,
    children: [
      {
        index: true, // This is the default route for "/home"
        element: <Dashboard />,
      },
      {
        path: "groups",
        element: <GroupsPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "events",
        element: <EventsPage />,
      },
      {
        path: "requests",
        element: <RequestPage />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
