import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import GraphLandingPage from './components/GraphLandingPage';
import Table from './components/Table';
import Graph from './components/Graph';
import Pie from './components/Pie';
import './components/global.css';

function App() {
  return (
    <div className="app-container">
      <nav className="app-nav" aria-label="Main navigation">
        <ul>
          <li><Link to="/table" aria-label="View Table">View Table</Link></li>
          <li><Link to="/graphs" aria-label="View Graphs">View Graphs</Link></li>
        </ul>
      </nav>
      <div className="content">
        <Routes>
          <Route path="/table" element={<Table />} />
          <Route path="/graphs" element={<GraphLandingPage />} />
          <Route path="/graphs/bar" element={<Graph />} />
          <Route path="/graphs/pie" element={<Pie />} />
          <Route path="*" element={<p className='welcome-message'> Welcome to the Intel Coding Assesment</p>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
