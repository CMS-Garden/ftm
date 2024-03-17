import { DonutChart } from '@shopify/polaris-viz';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import geoUrl from '../../assets/germany.geo.json?url';
import styles from './style.module.css';

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
                {
                  data: [
                    {
                      key: 'april - march',
                      value: 10000,
                    },
                  ],
                  name: 'Other',
                },
                {
                  data: [
                    {
                      key: 'april - march',
                      value: 4000,
                    },
                  ],
                  name: 'Amazon Pay',
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
                      default: { fill: setOpacity(color, Math.random()) },
                    }}
                  />
                ))
              }
            </Geographies>
          </ComposableMap>
        </div>
      </div>
    </div>
  );
}
