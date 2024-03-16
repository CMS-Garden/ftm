import { createBrowserRouter } from "react-router-dom";
// pages
import Root from "../../src/pages/index/page";
import Map from "../../src/pages/map/page";
import ErrorPage from "../../src/pages/error-page/page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/map",
    element: <Map />,
  },
]);

export default router;
