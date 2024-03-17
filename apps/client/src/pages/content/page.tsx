import { useParams } from 'react-router-dom';

export const Content = () => {
  const { slug } = useParams();
  return { slug };
};
