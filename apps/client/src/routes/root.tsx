import { createBrowserRouter } from "react-router-dom";
// pages
import Root from "../../src/layout/index";
import Home from "../../src/pages/index/page";
import Map from "../../src/pages/map/page";
import ErrorPage from "../../src/pages/error-page/page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Home /> },
      { path: "map", element: <Map /> },
    ],
    errorElement: <ErrorPage />,
  },
]);

export default router;
