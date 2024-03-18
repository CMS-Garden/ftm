import { Content } from '../../components/Content';
import styles from './styles.module.css';

export const AboutPage = () => {
  return (
    <div className={styles.container}>
      <Content slug="about" />
      <Content slug="thanks" />
    </div>
  );
};
