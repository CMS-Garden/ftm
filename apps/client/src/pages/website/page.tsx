import { useNavigate, useParams } from 'react-router-dom';
import { useWebsite } from '../../lib/data/useWebsite';
import styles from './styles.module.css';
import { Link } from 'react-router-dom';

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
    <>
    <div className={styles.main}>
      <h1>
        {website.versionmanager?.system.favicon && (
          <img
            src={website.versionmanager?.system.favicon}
            style={{ height: 24, width: 24, marginRight: 8 }}
          />
        )}
        {domain}
      </h1>

      <div className={styles.container}>
        <div>
          <p>
            {website.description} <i>(AI Generated)</i>
          </p>

          <a target="_blank" href={website.url}>
            Visit website
          </a>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {hasSystemType && (
              <div
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  placeItems: 'center',
                }}
              >
                <img
                  src={website.versionmanager?.system_type_group?.icon}
                  style={{
                    height: 100,
                    width: 100,
                    marginBottom: 16,
                    marginTop: 16,
                  }}
                />
                <span>
                  {website.versionmanager?.system_type_group?.group_name}
                </span>
              </div>
            )}

            {hasLighthouse && (
              <>
                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    placeItems: 'center',
                  }}
                >
                  <Score
                    score={parseFloat(
                      website.versionmanager!.lighthouse!.accessibility
                    )}
                  />
                  <span>Accessibility</span>
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    placeItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Score
                    score={parseFloat(
                      website.versionmanager!.lighthouse!.best_practices
                    )}
                  />
                  <span>
                    Best
                    <br />
                    Practices
                  </span>
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    placeItems: 'center',
                  }}
                >
                  <Score
                    score={parseFloat(
                      website.versionmanager!.lighthouse!.performance
                    )}
                  />
                  <span>Performance</span>
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    placeItems: 'center',
                  }}
                >
                  <Score
                    score={parseFloat(website.versionmanager!.lighthouse!.seo)}
                  />
                  <span>SEO</span>
                </div>
              </>
            )}
          </div>
        </div>
        {website.versionmanager?.system.id && (
          <img
            src={`https://be.versionmanager.io/systems/load_screenshot/${website.versionmanager?.system.id}`}
            style={{
              marginBottom: 16,
              borderRadius: 12,
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            }}
          />
        )}
      </div>
    </div>
    <Link className={styles.back} to="/">Back</Link>
    </>
  );
};

const Score = ({ score }: { score: number }) => {
  return (
    <svg width="100" height="100" style={{ marginTop: 16, marginBottom: 16 }}>
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="#e6e6e6"
        strokeWidth="10"
      />
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke={score < 0.5 ? '#DC2625' : score < 0.8 ? '#D97708' : '#17A34A'}
        strokeWidth="10"
        strokeDasharray="251.2"
        strokeDashoffset="251.2"
        style={{
          strokeDashoffset: 251.2 - 251.2 * score,
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
          transition: 'stroke-dashoffset 0.5s',
        }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        style={{ fontSize: '20px' }}
      >
        {percentageFormatter.format(score)}
      </text>
    </svg>
  );
};
