import * as React from 'react';
import {
  PolarisVizLightTheme,
  PolarisVizProvider,
  createTheme,
} from '@shopify/polaris-viz';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './pages/index/page';
import Map from './pages/map/page';
import 'the-new-css-reset/css/reset.css';
import '@shopify/polaris-viz/build/esm/styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
  },
  {
    path: '/map',
    element: <Map />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PolarisVizProvider
      defaultTheme="default"
      themes={{
        default: createTheme(
          {
            seriesColors: {
              upToEight: ['#65a30d', '#16a34a', '#059669', '#0d9488'],
            },
          },
          PolarisVizLightTheme
        ),
      }}
    >
      <RouterProvider router={router} />
    </PolarisVizProvider>
  </React.StrictMode>
);
