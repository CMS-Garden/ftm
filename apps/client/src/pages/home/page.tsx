import { AgGridReact } from 'ag-grid-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content } from '../../components/Content';
import styles from './style.module.css';
import { useCities } from '../../lib/data/useCities';

export default function Homepage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const cities = useCities();
  console.log(cities);
  const [colDefs, setColDefs] = useState([
    { field: 'Name' },
    { field: 'state_id' },
    { field: 'country_id' },
  ]);

  return (
    <>
      <div className={styles.content}>
        <div className={styles.hero}>
          <h1>
            <span>💸</span> Follow The Money
          </h1>
          <Content id="hero_description" />
        </div>
        <input
          className={styles.search}
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.table}>
          <AgGridReact
            rowData={cities}
            columnDefs={colDefs}
            className="ag-theme-quartz"
            quickFilterText={search}
            onRowDoubleClicked={(e) => {
              if (!e.data) return;
              navigate(`/regional/${e.data.Name.toLowerCase()}`);
            }}
          />
        </div>
        <Content id="about-us" className={styles.about} />{' '}
        <Content id="thanks" className={styles.about} />
      </div>
    </>
  );
}
