import { createBrowserRouter } from 'react-router-dom';
import Root from '../../src/layout/index';
import ErrorPage from '../../src/pages/error-page/page';
import Map from '../../src/pages/map/page';
import Home from '../pages/home/page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <Home /> },
      { path: 'city/:city', element: <Map /> },
    ],
    errorElement: <ErrorPage />,
  },
]);

export default router;
