import { DonutChart } from '@shopify/polaris-viz';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import geoUrl from '../../assets/germany.geo.json?url';
import styles from './style.module.css';

export default function Map() {
  const { city } = useParams();
  const [hovered, setHovered] = useState<string | null>(null);
  console.log(city);

  if (!city) {
    return <div>City not found</div>;
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.headline}>
        {city[0].toUpperCase() + city.slice(1)}
      </h1>
      <div className={styles.grid}>
        <div>
          <DonutChart
            legendPosition="bottom"
            data={[
              {
                data: [
                  {
                    key: 'april - march',
                    value: 50000,
                  },
                ],
                name: 'Shopify Payments',
              },
              {
                data: [
                  {
                    key: 'april - march',
                    value: 25000,
                  },
                ],
                name: 'Paypal',
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

        <div className={styles.mapContainer}>
          <p>{hovered}</p>
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
                    onMouseEnter={(e) => setHovered(geo.properties.NAME_3)}
                    onClick={() => console.log(geo)}
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
