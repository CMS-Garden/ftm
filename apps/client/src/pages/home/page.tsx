import { AgGridReact } from 'ag-grid-react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content } from '../../components/Content';
import { useCategories } from '../../lib/data/useCategories';
import { useWebsites } from '../../lib/data/useWebsites';
import styles from './style.module.css';
import { DonutChart } from '@shopify/polaris-viz';
import { useIsMobile } from '../../lib/useIsMobile';

const percentageFormatter = new Intl.NumberFormat('de-DE', {
  style: 'percent',
  maximumFractionDigits: 0,
});

export default function Homepage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const websites = useWebsites();
  const [hideUndetected, setHideUndetected] = useState(true);
  const chartdata = useMemo(() => {
    const data = websites.filter((w) => !!w.versionmanager?.system_type_group);
    return data.reduce(
      (acc, pre) => {
        const name =
          pre.versionmanager?.system_type_group?.group_name ?? 'unknown';
        const obj = acc.find((p) => p.name === name) ?? {
          name,
          data: [{ key: 'now', value: 0 }],
        };
        obj.data[0].value++;
        return [...acc.filter((p) => p.name !== name), obj];
      },
      [] as {
        name: string;
        data: [
          {
            key: 'now';
            value: number;
          }
        ];
      }[]
    );
  }, [websites]);
  const vulnerableWebsitecount = useMemo(
    () => websites.filter((w) => !!w.versionmanager?.cve?.count).length,
    [websites]
  );
  const opensourceData = useMemo(() => {
    return websites
      .filter((w) => !!w.versionmanager?.system_type_group)
      .reduce(
        ([open, closed], pre) => {
          if (pre.versionmanager?.system_type_group?.is_open_source) {
            return [
              open,
              {
                ...closed,
                data: [{ value: closed.data[0].value + 1, key: 'now' }],
              },
            ];
          } else {
            return [
              {
                ...open,
                data: [{ value: open.data[0].value + 1, key: 'now' }],
              },
              closed,
            ];
          }
        },
        [
          {
            name: 'Open Source',
            data: [{ value: 0, key: 'now' }],
            color: '#119F56',
          },
          {
            name: 'Closed Source',
            data: [{ value: 0, key: 'now' }],
            color: '#DC2625',
          },
        ]
      );
  }, [websites]);
  const categories = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  let gridApi: any = null;

  const onGridReady = useCallback((event: any) => {
    gridApi = event.api;
  }, []);

  function exportToFile(event: any) {
    if (gridApi) {
      gridApi.exportDataAsCsv();
    }
  }

  return (
    <>
      <div className={styles.hero}>
        <div className={styles.hero_text}>
          <h1>
            How is taxpayer's money being spent on public sector websites?
          </h1>
          <h2>Public Money? Public Code!</h2>
          {/* <p>We follow the money, analyzing a growing list of websites for open source usage and other meaningful criteria to promote transparency.</p> */}
          <a href="/about">Learn more about the project.</a>
          {/* <Content slug="front" /> */}
        </div>
        <div className={styles.hero_graph}>
          Map Visualization here
        </div>
      </div>
      <div className={styles.content}>

        <span
          style={{
            display: 'block',
            textAlign: 'center',
            marginBottom: '20px',
            fontSize: '1.5rem',
            fontWeight: 500,
          }}
        >
          Distribution of CMS Types
          {/* <span>💸</span> {vulnerableWebsitecount} vulnerable website
          {vulnerableWebsitecount === 1 ? '' : 's'} */}
        </span>

        <div className={styles.chartContainer}>
          <div>
            <DonutChart
              data={chartdata}
              legendPosition={isMobile ? 'bottom' : 'left'}
              renderInnerValueContent={({ activeValue, totalValue }) => {
                if (!activeValue) return '';
                return (
                  <>
                    <span>
                      {new Intl.NumberFormat('de-DE', {
                        style: 'percent',
                        maximumFractionDigits: 0,
                      }).format(activeValue / totalValue)}
                    </span>
                    <span style={{ fontSize: '0.8rem' }}>{activeValue}</span>
                  </>
                );
              }}
            />
          </div>
          <div>
            <DonutChart
              data={opensourceData}
              legendPosition={isMobile ? 'bottom' : 'right'}
              renderInnerValueContent={({ activeValue, totalValue }) => {
                if (!activeValue) return '';
                return (
                  <>
                    <span>
                      {new Intl.NumberFormat('de-DE', {
                        style: 'percent',
                        maximumFractionDigits: 0,
                      }).format(activeValue / totalValue)}
                    </span>
                    <span style={{ fontSize: '0.8rem' }}>{activeValue}</span>
                  </>
                );
              }}
            />
          </div>
        </div>

        <input
          className={styles.search}
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className={styles.categories}>
          {categories.map((category) => (
            <span
              key={category.id}
              data-selected={selectedCategory === category.id}
              onClick={() => {
                if (selectedCategory === category.id) {
                  setSelectedCategory(null);
                } else {
                  setSelectedCategory(category.id);
                }
              }}
            >
              {category.name}
            </span>
          ))}

          <span
            data-selected={!hideUndetected || !!search.trim()}
            onClick={() => setHideUndetected((p) => !p)}
          >
            Show unknown
          </span>
        </div>

        <div className={styles.table}>
          <AgGridReact
            rowData={
              !!search.trim()
                ? websites
                : websites
                    .filter((p) =>
                      !!selectedCategory
                        ? p.category_id?.id === selectedCategory
                        : true
                    )
                    .filter((p) =>
                      hideUndetected
                        ? p.versionmanager?.system_type_group
                        : true
                    )
            }
            columnDefs={[
              {
                field: 'url',
                cellRenderer: (params: any) => {
                  return (
                    <a
                      href={params.value}
                      style={{
                        color: '#2b6cb0',
                        display: 'flex',
                        gap: '4px',
                        alignItems: 'center',
                      }}
                      target="_blank"
                      rel="noopener"
                    >
                      {params.data?.versionmanager?.system?.favicon && (
                        <img
                          src={params.data.versionmanager.system.favicon}
                          alt="favicon"
                        />
                      )}
                      {params.value}
                    </a>
                  );
                },
                headerName: 'Website',
              },
              { field: 'city_id.Name', headerName: 'City' },
              { field: 'state_id.name', headerName: 'State' },
              {
                field: 'versionmanager.system_type_group.group_name',
                headerName: 'System',
                cellRenderer: (params: any) => {
                  if (!params.data.versionmanager?.system_type_group) {
                    return 'Unknown';
                  }

                  return (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <img
                        src={params.data.versionmanager.system_type_group.icon}
                        alt={params.value}
                        style={{
                          width: '20px',
                          height: '20px',
                          marginRight: '5px',
                        }}
                      />
                      {params.value}
                    </span>
                  );
                },
              },
              {
                field: 'versionmanager.lighthouse.performance',
                headerName: 'Performance',
                cellRenderer: (params: any) => {
                  if (!params.value) return 'Unknown';
                  return (
                    <span
                      style={{
                        color:
                          params.value < 0.5
                            ? '#991B1B'
                            : params.value < 0.8
                            ? '#92400D'
                            : '#166434',
                      }}
                    >
                      {percentageFormatter.format(params.value)}
                    </span>
                  );
                },
              },
              {
                field: 'versionmanager.lighthouse.accessibility',
                headerName: 'Accessibility',
                cellRenderer: (params: any) => {
                  if (!params.value) return 'Unknown';
                  return (
                    <span
                      style={{
                        color:
                          params.value < 0.5
                            ? '#991B1B'
                            : params.value < 0.8
                            ? '#92400D'
                            : '#166434',
                      }}
                    >
                      {percentageFormatter.format(params.value)}
                    </span>
                  );
                },
              },
            ]}
            className="ag-theme-quartz"
            onGridReady={onGridReady}
            quickFilterText={search}
            suppressExcelExport={true}
            onRowDoubleClicked={(e) => {
              if (!e.data) return;
              const domain = new URL(e.data.url).hostname;
              navigate(`/website/${domain}`);
            }}
          />
        </div>

        <button className={styles.export} onClick={exportToFile}>
          Export to csv
        </button>
      </div>
      <footer>
        <nav aria-labelledby="footer-navigation">
          <ul>
            <li><a href="/imprint">Imprint</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
          </ul>
        </nav>
      </footer>
    </>
  );
}
