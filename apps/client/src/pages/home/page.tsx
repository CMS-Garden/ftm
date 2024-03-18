import { AgGridReact } from 'ag-grid-react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content } from '../../components/Content';
import { useCategories } from '../../lib/data/useCategories';
import { useWebsites } from '../../lib/data/useWebsites';
import styles from './style.module.css';

export default function Homepage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const websites = useWebsites();
  const categories = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
              data-selected={selectedCategory === category.name}
              onClick={() => {
                if (selectedCategory === category.name) {
                  setSelectedCategory(null);
                } else {
                  setSelectedCategory(category.name);
                }
              }}
            >
              {category.name}
            </span>
          ))}
        </div>

        <div className={styles.table}>
          <AgGridReact
            rowData={websites}
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
              { field: 'versionmanager.label' },
            ]}
            className="ag-theme-quartz"
            onGridReady={onGridReady}
            quickFilterText={search}
            suppressExcelExport={true}
            onRowDoubleClicked={(e) => {
              if (!e.data) return;
              navigate(`/website/${e.data.url.split('://').at(-1)}`);
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
