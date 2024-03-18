import { DonutChart } from '@shopify/polaris-viz';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import geoUrl from '../../assets/germany.geo.json?url';
import styles from './style.module.css';
import { useWebsites } from '../../lib/data/useWebsites';
import { AgGridReact } from 'ag-grid-react';
import { Link } from 'react-router-dom';

const percentageFormatter = new Intl.NumberFormat('de-DE', {
  style: 'percent',
});

export default function Map() {
  const { region } = useParams();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);
  const websites = useWebsites();
  const stateWebsites = useMemo(
    () => websites.filter((website) => website.state_id.name === region),
    [websites, region]
  );
  const chartdata = useMemo(() => {
    const data = stateWebsites.filter(
      (w) => !!w.versionmanager?.system_type_group
    );
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
  }, [stateWebsites]);

  const opensourceData = useMemo(() => {
    return stateWebsites
      .filter((w) => !!w.versionmanager?.system_type_group)
      .reduce(
        ([open, closed], pre) => {
          if (!pre.versionmanager?.system_type_group?.is_open_source) {
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
  }, [stateWebsites]);

  if (!region || !stateWebsites.length) {
    navigate('/');
    return null;
  }

  return (
    <>
    <div className={styles.root}>
      <h1 className={styles.headline}>
        {region[0].toUpperCase() + region.slice(1)}
      </h1>
      <div className={styles.grid}>
        <div className={styles.piechartContainer}>
          <span>Relative CMS Usage</span>
          <div>
            <DonutChart
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
              data={chartdata}
            />
          </div>
        </div>

        <div className={styles.piechartContainer}>
          <span>Open- vs. Closed Source Systems</span>
          <div>
            <DonutChart
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
              data={opensourceData}
            />
          </div>
        </div>

        <div className={styles.mapContainer}>
          <span>CMS Usage by Region: {hovered}</span>

          <ComposableMap
            className={styles.map}
            projectionConfig={{
              scale: 6500,
              center: [10.5, 51.06],
            }}
            onMouseLeave={() => setHovered(null)}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const site = websites.find((w) =>
                    geo.properties.cityName.includes(w.city_id?.Name)
                  );
                  const hasData = !!site?.versionmanager?.system_type_group;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(e) => setHovered(geo.properties.cityName)}
                      onClick={() => console.log(geo)}
                      style={{
                        default: {
                          fill:
                            geo.properties.stateNameEng === region
                              ? hasData
                                ? site?.versionmanager?.system_type_group
                                    ?.is_open_source
                                  ? '#119F56'
                                  : '#DC2625'
                                : '#D6D6DA'
                              : '#D6D6DA20',
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
        <div className={styles.table}>
          <AgGridReact
            rowData={stateWebsites}
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
                      {params.data.versionmanager.system_type_group.icon && (
                        <img
                          src={
                            params.data.versionmanager.system_type_group.icon
                          }
                          alt={params.value}
                          style={{
                            width: '20px',
                            height: '20px',
                          }}
                        />
                      )}
                      {params.value}
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
            suppressExcelExport={true}
            onRowClicked={(e) => {
              if (!e.data) return;
              const domain = new URL(e.data.url).hostname;
              navigate(`/website/${domain}`);
            }}
          />
        </div>
      </div>
    </div>
    <Link className={styles.back} to="/">Back</Link>
    </>
  );
}
