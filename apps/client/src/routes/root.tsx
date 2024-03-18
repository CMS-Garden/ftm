import { createBrowserRouter } from 'react-router-dom';
import Root from '../../src/layout/index';
import ErrorPage from '../../src/pages/error-page/page';
import Map from '../pages/regional/page';
import Home from '../pages/home/page';
import { ContentPage } from '../pages/content/page';
import { AboutPage } from '../pages/about/page';
import { ImprintPage } from '../pages/imprint/page';
import { PrivacyPage } from '../pages/privacy/page';
import DomainView from '../pages/website/page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/regional/:region', element: <Map /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/imprint', element: <ImprintPage /> },
      { path: '/privacy-policy', element: <PrivacyPage /> },
      { path: '/website/:domain', element: <DomainView /> },
      { path: '/:slug', element: <ContentPage /> },
    ],
    errorElement: <ErrorPage />,
  },
]);

export default router;
