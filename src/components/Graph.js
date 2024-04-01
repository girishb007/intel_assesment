import React, { useEffect, useState, useMemo } from 'react';
import jsonData from '../components/API_DATA.json';
import GraphToggle from '../components/GraphLandingPage';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';

const processData = (data) => {
  return Object.keys(data).map(key => {
    const item = data[key];
    const originalFrequency = parseFloat(item?.Performance?.["Processor Base Frequency"]) ?? 0;
    const originalTDP = parseInt(item?.Performance?.["TDP"]) ?? 0;
    const shortName = item.name.split(',')[0]; // Extracting short name for better label display
    return {
      name: shortName,
      frequency: originalFrequency > 125 ? 125 : originalFrequency,
      tdp: originalTDP > 125 ? 125 : originalTDP,
      originalFrequency,
      originalTDP,
    };
  });
};

const GraphLandingPage = () => {
  let navigate = useNavigate();
  let location = useLocation();
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

const renderCustomLabel = (props) => {
  const { x, y, width, value, dataKey, payload } = props;
  if (!payload) return null;
  const originalValue = dataKey === 'frequency' ? payload.originalFrequency : payload.originalTDP;
  if (originalValue <= 100) return null;
  return (
    <text x={x + width / 2} y={y - 6} fill="#666" textAnchor="middle" dy={-10} style={{fontSize: '0.85em'}}>
      {originalValue}
    </text>
  );
};
const MyScrollableChart = () => {
  const chartData = useMemo(() => processData(jsonData), []);
  const [isScrollable, setIsScrollable] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const chartWidth = isScrollable ? Math.max((chartData?.length || 0) * 120, window.innerWidth - 100) : window.innerWidth - 100;
  const chartHeight = 700;
  const bottomMargin = isScrollable ? 120 : 200;

  //Additional Feature- Part 2:  Integration with backend functionality 
  const API_BASE_URL = "https://dummybackend.com/api";
  useEffect(() => {
    // Fetch data from the backend when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/data`);
        const jsonData = await response.json();
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);
  const handleUpdateData = async (updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        console.log("Data updated successfully");
      } else {
        console.error("Failed to update data");
      }
    } catch (error) {
      console.error("Failed to send update:", error);
    }
  };   

  const handleLegendClick = (metric) => {
    if (selectedMetric === metric) {
      setSelectedMetric(null); 
    } else {
      setSelectedMetric(metric);
    }
  };
  return (
    <div>
      <GraphToggle />
      <button onClick={() => setIsScrollable(false)} className={isScrollable ? "active" : ""}>View Graph</button>
      <button onClick={() => setIsScrollable(true)} className={!isScrollable ? "active" : ""}>Expand Graph </button>
      <div className="scrollable-container" style={{overflowX: 'scroll', maxWidth: '100%'}}>
        <BarChart
          width={chartWidth}
          height={chartHeight}
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: isScrollable ? bottomMargin : 5  }} // Adjusted bottom margin
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={150} tick={isScrollable} />
          <YAxis domain={[0, 125]} allowDataOverflow={true} ticks={[0, 25, 50, 75, 100, 125]} />
          <Tooltip />
          <Legend onClick={(e) => handleLegendClick(e.dataKey)} verticalAlign="top" wrapperStyle={{ position: 'relative' }} />
          {selectedMetric !== 'tdp' && (
            <Bar dataKey="frequency" fill="#4287f5" name="Base Frequency (GHz)">
              <LabelList dataKey="frequency" content={renderCustomLabel} />
            </Bar>
          )}
          {selectedMetric !== 'frequency' && (
            <Bar dataKey="tdp" fill="#f54242" name="TDP (W)">
              <LabelList dataKey="tdp" content={renderCustomLabel} />
            </Bar>
          )}
        </BarChart>
      </div>
    </div>
  );
};

export default MyScrollableChart;