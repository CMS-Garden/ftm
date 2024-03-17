import { DonutChart } from '@shopify/polaris-viz';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import geoUrl from '../../assets/germany.geo.json?url';
import styles from './style.module.css';
import { AgGridReact } from 'ag-grid-react';

const color = '#17A34A';
const setOpacity = (color: string, opacity: number) => {
  const opacityHex = Math.round(255 * opacity).toString(16);
  return `${color}${opacityHex}`;
};

export default function Map() {
  const { city } = useParams();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  if (!city) {
    navigate('/');
    return null;
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.headline}>
        {city[0].toUpperCase() + city.slice(1)}
      </h1>
      <div className={styles.grid}>
        <div className={styles.piechartContainer}>
          <span>Relative CMS Usage</span>
          <div>
            <DonutChart
              data={[
                {
                  data: [
                    {
                      key: 'april - march',
                      value: 50000,
                    },
                  ],
                  name: 'Drupal',
                },
                {
                  data: [
                    {
                      key: 'april - march',
                      value: 25000,
                    },
                  ],
                  name: 'Wordpress',
                },
              ]}
            />
          </div>
        </div>

        <div className={styles.piechartContainer}>
          <span>Open- vs. Closed Source Systems</span>
          <div>
            <DonutChart
              renderInnerValueContent={({ activeValue, totalValue }) => {
                if (!activeValue) return '';
                return new Intl.NumberFormat('de-DE', {
                  style: 'percent',
                  maximumFractionDigits: 0,
                }).format(activeValue / totalValue);
              }}
              data={[
                {
                  data: [
                    {
                      key: 'april - march',
                      value: 50000,
                    },
                  ],
                  name: 'Open',
                  color: '#17A34A',
                },
                {
                  data: [
                    {
                      key: 'april - march',
                      value: 25000,
                    },
                  ],
                  name: 'Closed',
                  color: '#DC2625',
                },
              ]}
            />
          </div>
        </div>

        <div className={styles.mapContainer}>
          <span>CMS Usage by Region: {hovered}</span>

          <ComposableMap
            className={styles.map}
            projectionConfig={{
              scale: 6500,
              center: [10.5, 51.06],
            }}
            onMouseLeave={() => setHovered(null)}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(e) => setHovered(geo.properties.cityName)}
                    onClick={() => console.log(geo)}
                    style={{
                      default: {
                        fill: setOpacity(color, Math.random()),
                        ...(geo.properties.cityName.toLowerCase() ===
                        city.toLowerCase()
                          ? {
                              strokeWidth: 2,
                              stroke: 'red',
                              zIndex: 10,
                            }
                          : {}),
                      },
                    }}
                  />
                ))
              }
            </Geographies>
          </ComposableMap>
        </div>
        <ul className={styles.links}>
          <span>Websites found in that region</span>
          <li>
            <a href="https://www.drupal.org/">Drupal</a>
          </li>
          <li>
            <a href="https://wordpress.org/">Wordpress</a>
          </li>
          <li>
            <a href="https://www.shopify.com/">Shopify</a>
          </li>
          <li>
            <a href="https://github.com/CMS-Garden/ftm">GitHub</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
