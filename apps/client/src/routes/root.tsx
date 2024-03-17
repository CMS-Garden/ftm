import { createBrowserRouter } from 'react-router-dom';
import Root from '../../src/layout/index';
import ErrorPage from '../../src/pages/error-page/page';
import Map from '../pages/regional/page';
import Home from '../pages/home/page';
import { Content } from '../pages/content/page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <Home /> },
      { path: 'regional/:city', element: <Map /> },
      { path: '/:slug', element: <Content /> },
    ],
    errorElement: <ErrorPage />,
  },
]);

export default router;
