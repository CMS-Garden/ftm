import * as React from 'react';
import {
  PolarisVizLightTheme,
  PolarisVizProvider,
  createTheme,
} from '@shopify/polaris-viz';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routes/root';
// import 'the-new-css-reset/css/reset.css';
import '@shopify/polaris-viz/build/esm/styles.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { DirectusProvider } from './lib/directus';
import { TanstackQueryProvider } from './lib/queryProvider';

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
      <DirectusProvider>
        <TanstackQueryProvider>
          <RouterProvider router={router} />
        </TanstackQueryProvider>
      </DirectusProvider>
    </PolarisVizProvider>
  </React.StrictMode>
);
