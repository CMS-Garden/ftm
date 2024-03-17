import { createBrowserRouter } from 'react-router-dom';
import Root from '../../src/layout/index';
import ErrorPage from '../../src/pages/error-page/page';
import Map from '../pages/regional/page';
import Home from '../pages/home/page';
import { ContentPage } from '../pages/content/page';
import { AboutPage } from '../pages/about/page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/regional/:city', element: <Map /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/:slug', element: <ContentPage /> },
    ],
    errorElement: <ErrorPage />,
  },
]);

export default router;
