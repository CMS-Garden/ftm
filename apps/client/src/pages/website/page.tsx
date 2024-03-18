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

const percentageFormatter = new Intl.NumberFormat('de', {
  style: 'percent',
});

const View = ({ domain }: { domain: string }) => {
  const website = useWebsite(domain);
  const hasSystemType = !!website.versionmanager?.system_type;
  const hasLighthouse = !!website.versionmanager?.lighthouse;
  return (
    <div className={styles.main}>
      <h1>{domain}</h1>

      {!hasSystemType && !hasLighthouse && <p>No Data available.</p>}

      <ul>
        {hasSystemType && (
          <li>
            Detected CMS:
            <img
              src={website.versionmanager?.system_type_group?.icon}
              style={{ height: 48, width: 48 }}
            />{' '}
            <b>{website.versionmanager?.system_type?.name}</b>
          </li>
        )}
        {hasLighthouse && (
          <>
            <li>
              Accessibility Score:{' '}
              {percentageFormatter.format(
                parseFloat(website.versionmanager!.lighthouse!.accessibility)
              )}
            </li>
            <li>
              Best Practices Score:{' '}
              {percentageFormatter.format(
                parseFloat(website.versionmanager!.lighthouse!.best_practices)
              )}
            </li>{' '}
            <li>
              Performance Score:{' '}
              {percentageFormatter.format(
                parseFloat(website.versionmanager!.lighthouse!.performance)
              )}
            </li>{' '}
            <li>
              SEO Score:{' '}
              {percentageFormatter.format(
                parseFloat(website.versionmanager!.lighthouse!.seo)
              )}
            </li>
          </>
        )}
      </ul>

      <p>{website.description}</p>
    </div>
  );
};
