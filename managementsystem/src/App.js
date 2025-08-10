import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace the URL with your backend API URL & port if different
    fetch('http://localhost:5145/entries')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setEntries(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <h2>Entries from API</h2>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {!loading && !error && (
          <ul>
            {entries.length === 0 ? (
              <li>No entries found.</li>
            ) : (
              entries.map(entry => (
                <li key={entry.id}>{entry.name}</li>
              ))
            )}
          </ul>
        )}

      </header>
    </div>
  );
}

export default App;
