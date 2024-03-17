import { AgGridReact } from 'ag-grid-react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content } from '../../components/Content';
import { useCategories } from '../../lib/data/useCategories';
import { useWebsites } from '../../lib/data/useWebsites';
import styles from './style.module.css';
import { DonutChart } from '@shopify/polaris-viz';

export default function Homepage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const websites = useWebsites();
  const chartdata = useMemo(() => {
    const data = websites.filter((w) => !!w.versionmanager?.system_type);
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
  const opensourceData = useMemo(() => {
    return websites.reduce(
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
            { ...open, data: [{ value: open.data[0].value + 1, key: 'now' }] },
            closed,
          ];
        }
      },
      [
        {
          name: 'Open Source',
          data: [{ value: 0, key: 'now' }],
          color: 'green',
        },
        {
          name: 'Closed Source',
          data: [{ value: 0, key: 'now' }],
          color: 'red',
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
      <div className={styles.content}>
        <div className={styles.hero}>
          <h1>
            <span>💸</span> Follow The Money
          </h1>
          <Content slug="front" />
        </div>

        <div
          style={{
            height: 300,
            marginBottom: 50,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          <div>
            <DonutChart data={chartdata} legendPosition="left" />
          </div>
          <div>
            <DonutChart data={opensourceData} legendPosition="right" />
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
        </div>

        <div className={styles.table}>
          <AgGridReact
            rowData={
              selectedCategory
                ? websites.filter((p) => p.category_id?.id === selectedCategory)
                : websites
            }
            columnDefs={[
              {
                field: 'url',
                cellRenderer: (params: any) => {
                  return (
                    <a
                      href={params.value}
                      style={{ color: '#2b6cb0' }}
                      target="_blank"
                      rel="noopener"
                    >
                      {params.value}
                    </a>
                  );
                },
              },
              { field: 'city_id.Name' },
              { field: 'state_id.name' },
              { field: 'versionmanager.system_type.name' },
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
    </>
  );
}
