import { AgGridReact } from 'ag-grid-react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content } from '../../components/Content';
import styles from './style.module.css';
import { useCities } from '../../lib/data/useCities';
import { useCategories } from '../../lib/data/useCategories';

export default function Homepage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const cities = useCities();
  const categories = useCategories();
  const [colDefs, setColDefs] = useState([
    { field: 'Name' },
    { field: 'state_id' },
    { field: 'country_id' },
    {
      field: 'website',
      cellRenderer: (params: any) => {
        return (
          <a
            href={params.value}
            style={{ color: '#2b6cb0' }}
            target="_blank"
            rel="noopener"
          >
            {' '}
            {params.value}{' '}
          </a>
        );
      },
    },
  ]);
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
          <Content id="welcome" />
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
            rowData={cities}
            columnDefs={colDefs}
            className="ag-theme-quartz"
            onGridReady={onGridReady}
            quickFilterText={search}
            suppressExcelExport={true}
            onRowDoubleClicked={(e) => {
              if (!e.data) return;
              navigate(`/regional/${e.data.Name.toLowerCase()}`);
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
