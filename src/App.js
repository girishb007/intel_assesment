import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Graph from './components/Graph';
import Table from './components/Table';

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/graph">Graph</Link>
          </li>
          <li>
            <Link to="/table">Table</Link>
          </li>
        </ul>
      </nav>

      {/* A <Routes> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
      <Routes>
        <Route path="/graph" element={<Graph />} />
        <Route path="/table" element={<Table />} />
      </Routes>
    </div>
  );
}

export default App;
