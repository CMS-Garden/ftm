import { AgGridReact } from 'ag-grid-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content } from '../../components/Content';
import styles from './style.module.css';

export default function Homepage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([
    {
      city: 'Berlin',
      state: 'Berlin',
      country: 'Germany',
      website: 'https://www.berlin.de/',
    },
    {
      city: 'Hamburg',
      state: 'Hamburg',
      country: 'Germany',
      website: 'https://www.hamburg.de/',
    },
    {
      city: 'Munich',
      state: 'Bavaria',
      country: 'Germany',
      website: 'https://www.muenchen.de/',
    },
    {
      city: 'Cologne',
      state: 'North Rhine-Westphalia',
      country: 'Germany',
      website: 'https://www.stadt-koeln.de/',
    },
    {
      city: 'Frankfurt',
      state: 'Hesse',
      country: 'Germany',
      website: 'https://www.frankfurt.de/',
    },
    {
      city: 'Stuttgart',
      state: 'Baden-Württemberg',
      country: 'Germany',
      website: 'https://www.stuttgart.de/',
    },
    {
      city: 'Düsseldorf',
      state: 'North Rhine-Westphalia',
      country: 'Germany',
      website: 'https://www.duesseldorf.de/',
    },
    {
      city: 'Dortmund',
      state: 'North Rhine-Westphalia',
      country: 'Germany',
      website: 'https://www.dortmund.de/',
    },
    {
      city: 'Essen',
      state: 'North Rhine-Westphalia',
      country: 'Germany',
      website: 'https://www.essen.de/',
    },
    {
      city: 'Leipzig',
      state: 'Saxony',
      country: 'Germany',
      website: 'https://www.leipzig.de/',
    },
    {
      city: 'Bremen',
      state: 'Bremen',
      country: 'Germany',
      website: 'https://www.bremen.de/',
    },
  ]);

  const [colDefs, setColDefs] = useState([
    { field: 'city' },
    { field: 'state' },
    { field: 'country' },
    { field: 'website' },
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
            rowData={rowData}
            columnDefs={colDefs}
            className="ag-theme-quartz"
            quickFilterText={search}
            onRowDoubleClicked={(e) => {
              if (!e.data) return;
              navigate(`/regional/${e.data.city.toLowerCase()}`);
            }}
          />
        </div>
        <Content id="about-us" className={styles.about} />{' '}
        <Content id="thanks" className={styles.about} />
      </div>
    </>
  );
}
