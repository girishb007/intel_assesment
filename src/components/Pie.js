import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import GraphToggle from '../components/GraphLandingPage';
import { useNavigate, useLocation } from 'react-router-dom';
import jsonData from '../components/API_DATA.json'; // Ensure the correct path
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);
const GraphLandingPage = () => {
  let navigate = useNavigate();
  let location = useLocation();

  // Function to determine if a graph type is active based on the current location
  const isActive = (graphType) => {
    return location.pathname.includes(`/graphs/${graphType}`);
  };

  const handleNavigate = (graphType) => {
    navigate(`/graphs/${graphType}`);
  };

  return (
    <div className="toggle-buttons-container">
      <button
        className={`toggle-button ${isActive('bar') ? 'active' : ''}`}
        onClick={() => handleNavigate('bar')}
      >
        View Bar Graph
      </button>
      <button
        className={`toggle-button ${isActive('pie') ? 'active' : ''}`}
        onClick={() => handleNavigate('pie')}
      >
        View Pie Charts
      </button>
    </div>
  );
};
const PieCharts = () => {
  const [staticChartData, setStaticChartData] = useState([]);

  useEffect(() => {
    const verticalSegments = {};
    const statusCounts = {};
    const coresCounts = {};

    Object.values(jsonData).forEach((data) => {
      const verticalSegment = data?.Essentials?.["Vertical Segment"];
      const status = data?.Essentials?.Status;
      const numOfCores = data?.Performance?.["# of Cores"];

      if (verticalSegment) verticalSegments[verticalSegment] = (verticalSegments[verticalSegment] || 0) + 1;
      if (status) statusCounts[status] = (statusCounts[status] || 0) + 1;
      if (numOfCores) coresCounts[numOfCores] = (coresCounts[numOfCores] || 0) + 1;
    });

    setStaticChartData([
      { label: "Vertical Segment", data: verticalSegments },
      { label: "Status", data: statusCounts },
      { label: "# of Cores", data: coresCounts },
    ]);
  }, []);

  return (
    <div className="graph-container">
    <GraphToggle />
    <div className="charts-container">
      {staticChartData.map((chart, index) => (
        <div key={index} className="chart">
          <h2>{chart.label}</h2>
          <Pie
            data={{
              labels: Object.keys(chart.data),
              datasets: [
                { data: Object.values(chart.data), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] }
              ],
            }}
            options={{ maintainAspectRatio: true }}
          />
        </div>
      ))}
    </div>
  </div>
  );
};

export default PieCharts;
