import { DonutChart } from '@shopify/polaris-viz';
import { AnimatePresence, motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import styles from './style.module.css';
import geoUrl from '../../assets/germany.geo.json?url';
import { useState } from 'react';

export default function Map() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className={styles.test}>
      <DonutChart
        legendPosition="right"
        data={[
          {
            data: [
              {
                key: "april - march",
                value: 50000,
              },
            ],
            name: "Shopify Payments",
          },
          {
            data: [
              {
                key: "april - march",
                value: 25000,
              },
            ],
            name: "Paypal",
          },
          {
            data: [
              {
                key: "april - march",
                value: 10000,
              },
            ],
            name: "Other",
          },
          {
            data: [
              {
                key: "april - march",
                value: 4000,
              },
            ],
            name: "Amazon Pay",
          },
        ]}
      />
      <hr />
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
  );
}
