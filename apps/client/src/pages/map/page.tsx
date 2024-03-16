import { DonutChart } from '@shopify/polaris-viz';
import styles from './style.module.css';

export default function Map() {
  return (
    <div className={styles.test}>
      <DonutChart
        legendPosition="right"
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
  );
}
