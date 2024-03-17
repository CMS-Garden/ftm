import { Content } from '../../components/Content';
import styles from './styles.module.css';

export const AboutUsPage = () => {
  return (
    <div className={styles.container}>
      <img src="https://ftm.cms.garden/assets/c933d938-7e9c-47e6-9904-b6bc69abf31b?width=200&height=200" />
      <Content slug="about" />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          placeContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            justifyContent: 'center',
            placeItems: 'center',
          }}
        >
          <span style={{ fontWeight: 500, textAlign: 'center' }}>Moritz</span>
        </div>
      </div>
    </div>
  );
};
