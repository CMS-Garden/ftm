import { useParams } from 'react-router-dom';
import { Content } from '../../components/Content';
import styles from './content.module.css';

export const ContentPage = () => {
  const { slug } = useParams();
  return (
    <div className={styles.content}>
      <Content id={slug!} />
    </div>
  );
};
