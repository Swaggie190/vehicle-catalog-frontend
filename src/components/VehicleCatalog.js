import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import styles from './CatalogFrontend.css';

export default function VehicleCatalog() {
  const [vehicles, setVehicles] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState('type');
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8084/api/catalog/vehicles');
      if (!response.ok) throw new Error('Failed to fetch vehicles');
      const data = await response.json();
      setVehicles(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8084/api/catalog/vehicles/search?criteria=${searchCriteria}&value=${searchValue}`
      );
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setVehicles(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Vehicle Catalog</h1>

      {error && (
        <div className={styles.error}>
          <AlertCircle className={styles.icon} />
          <span>{error}</span>
        </div>
      )}

      <div className={styles.searchBar}>
        <select 
          className={styles.select} 
          value={searchCriteria}
          onChange={(e) => setSearchCriteria(e.target.value)}
        >
          <option value="type">Type</option>
          <option value="brand">Brand</option>
          <option value="fuelType">Fuel Type</option>
        </select>
        
        <input
          type="text"
          className={styles.input}
          placeholder="Search value..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        
        <button
          className={styles.searchButton}
          onClick={searchVehicles}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
        
        <button
          className={styles.resetButton}
          onClick={fetchVehicles}
          disabled={loading}
        >
          Reset
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Model</th>
              <th>Brand</th>
              <th>Type</th>
              <th>Fuel Type</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.model}</td>
                <td>{vehicle.brand}</td>
                <td>{vehicle.type}</td>
                <td>{vehicle.fuelType}</td>
                <td>${vehicle.basePrice.toLocaleString()}</td>
                <td>
                  <span className={`${vehicle.isOnSale ? styles.onSale : styles.regularPrice}`}>
                    {vehicle.isOnSale ? 'On Sale' : 'Regular Price'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
