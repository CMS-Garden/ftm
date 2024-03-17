import { Content } from '../../components/Content';
import styles from './styles.module.css';

export const AboutPage = () => {
  return (
    <div className={styles.container}>
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
