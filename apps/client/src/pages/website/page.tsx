import { DonutChart } from '@shopify/polaris-viz';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWebsite } from '../../lib/data/useWebsite';
import styles from './styles.module.css';

export default function DomainView() {
  const { domain } = useParams();
  const navigate = useNavigate();

  if (!domain) {
    navigate('/');
    return null;
  }

  return <View domain={domain!} />;
}

const View = ({ domain }: { domain: string }) => {
  const website = useWebsite(domain);
  return (
    <div className={styles.main}>
      <h1>{domain}</h1>
    </div>
  );
};
