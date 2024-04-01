import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GraphLandingPage = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const isActive = (graphType) => location.pathname.includes(`/graphs/${graphType}`);
  const handleNavigate = (graphType) => {
    navigate(`/graphs/${graphType}`);
  };
  return (
    <div className="graph-toggle-container">
      <div className="toggle-buttons-container">
        <button
          className={`toggle-button ${isActive('pie') ? 'active' : ''}`}
          onClick={() => handleNavigate('pie')}>
          View Pie Chart
        </button>
        <button
          className={`toggle-button ${isActive('bar') ? 'active' : ''}`}
          onClick={() => handleNavigate('bar')}
        >
          View Bar Graph
        </button>
      </div>
    </div>
  );
};

export default GraphLandingPage;
