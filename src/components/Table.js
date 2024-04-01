import React, { useState, useEffect } from 'react';
import jsonData from '../components/API_DATA.json'; 
import '../components/global.css';
import ProductComparison from './ProductComparison';

const Table = () => {
const [data, setData] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
const [filterQuery, setFilterQuery] = useState("");
const [expandedRow, setExpandedRow] = useState(null);
const [nameFilter, setNameFilter] = useState("");
const [codeNameFilter, setCodeNameFilter] = useState("");
const [productCollectionFilter, setProductCollectionFilter] = useState("");
const [statusFilter, setStatusFilter] = useState("");
const [verticalSegmentFilter, setVerticalSegmentFilter] = useState("");
const [embeddedOptionsFilter, setEmbeddedOptionsFilter] = useState("");
const [hyperThreadingFilter, setHyperThreadingFilter] = useState(false);
const [virtualizationTechFilter, setVirtualizationTechFilter] = useState(false);  
const [showFilters, setShowFilters] = useState(false); 
const [searchQuery, setSearchQuery] = useState("");
const maxPageNumberLimit = 10;
const minPageNumberLimit = 0;
const [pageNumberLimit, setPageNumberLimit] = useState(maxPageNumberLimit); 
const [maxPageLimit, setMaxPageLimit] = useState(10); 
const [minPageLimit, setMinPageLimit] = useState(0);
const [selectedRows, setSelectedRows] = useState([]);
const [showToast, setShowToast] = useState(false);
const [showComparison, setShowComparison] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const [editingRowId, setEditingRowId] = useState(null);
const [tempData, setTempData] = useState({}); 

const Modal = ({ show, children, onClose }) => {
  if (!show) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
};

const editRow = (key, product) => {
  setIsEditing(true);
  setEditingRowId(key);
  setTempData({ ...tempData, [key]: product });
};

const handleEditChange = (key, field, value) => {
  setTempData(prev => ({ ...prev, [key]: { ...prev[key], [field]: value }}));
};

const saveEdits = (key) => {
  const updatedData = data.map(([id, product]) =>
    id === key ? [key, { ...product, ...tempData[key] }] : [id, product]
  );
  setData(updatedData);
  setIsEditing(false);
  setEditingRowId(null);
  setTempData({});
  localStorage.setItem('tableData', JSON.stringify(Object.fromEntries(updatedData)));
};

const convertToCSV = (data) => {
  let csvString = '';
  const headers = Object.keys(data[0]).join(',');
  csvString += headers + '\r\n';
  for (const row of data) {
    const values = Object.values(row).join(',');
    csvString += values + '\r\n';
  }
  return csvString;
};

const downloadCSV = (csvString, fileName = 'export.csv') => {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  
const exportData = () => {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }
  const csvString = convertToCSV(data.map(([_, product]) => product)); // Adjust based on your data structure
  downloadCSV(csvString, 'exportedData.csv');
};

//Additional Feature- Part 2:  Integration with backend functionality
/*Example for fetching a specific page of data from backend with Error handling
useEffect(() => {
  const fetchData = async () => {
     try {
       const response = await fetch(`http://your-backend-server/api/products?page=${currentPage}&itemsPerPage=${itemsPerPage}`);
       const jsonData = await response.json();
       // Handling the data
     } catch (error) {
       // Handle the error
     }
   };
   fetchData();
 }, [currentPage, itemsPerPage]);*/

useEffect(() => {
const dataToSave = JSON.stringify(Object.fromEntries(data));
localStorage.setItem('tableData', dataToSave);
}, [data]); // Saving updates to local storage

useEffect(() => {
const savedData = localStorage.getItem('tableData');
if (savedData) {
  setData(Object.entries(JSON.parse(savedData)));
} else {
  console.log(jsonData); // Fallback to jsonData if no local storage data
  const formattedData = Object.entries(jsonData);
  setData(formattedData);
}
}, []);

useEffect(() => {
  console.log(jsonData); 
  const formattedData = Object.entries(jsonData);
  setData(formattedData);
}, []);

useEffect(() => {
  const productCollections = new Set(data.map(([_, product]) => product.Essentials?.['Product Collection']).filter(Boolean));
}, [data]); 
  
const ProductComparison = ({ product1, product2 }) => {
  const combinedKeys = Array.from(new Set([...Object.keys(product1), ...Object.keys(product2)]));
  const renderComparisonRows = (key) => {
    const product1Value = product1[key];
    const product2Value = product2[key];
    if (typeof product1Value === 'object' && product1Value !== null && typeof product2Value === 'object' && product2Value !== null) {
      const subKeys = Array.from(new Set([...Object.keys(product1Value), ...Object.keys(product2Value)]));
      return (
        <>
          <tr>
            <th colSpan="3">{key}</th>
          </tr>
          {subKeys.map((subKey) => (
            <tr key={subKey}>
              <td>{subKey}</td>
              <td>{product1Value[subKey] ?? 'N/A'}</td>
              <td>{product2Value[subKey] ?? 'N/A'}</td>
            </tr>
          ))}
        </>
      );
    } else {
      return (
        <tr>
          <td>{key}</td>
          <td>{product1Value ?? 'N/A'}</td>
          <td>{product2Value ?? 'N/A'}</td>
        </tr>
      );
    }
  };
  
  return (
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Product 1</th>
          <th>Product 2</th>
        </tr>
      </thead>
      <tbody>
        {combinedKeys.map((key) => renderComparisonRows(key))}
      </tbody>
    </table>
  );
};

const handleNextBtn = () => {
setCurrentPage(currentPage + 1);
if (currentPage + 1 > maxPageLimit) {
  setMaxPageLimit(maxPageLimit + pageNumberLimit);
  setMinPageLimit(minPageLimit + pageNumberLimit);
}
};

const handlePrevBtn = () => {
setCurrentPage(currentPage - 1);
if ((currentPage - 1) % pageNumberLimit === 0) {
  setMaxPageLimit(maxPageLimit - pageNumberLimit);
  setMinPageLimit(minPageLimit - pageNumberLimit);
}
};

const handleJumpForward = () => {
setCurrentPage(currentPage + 10);
setMaxPageLimit(maxPageLimit + pageNumberLimit);
setMinPageLimit(minPageLimit + pageNumberLimit);
};

const handleJumpBack = () => {
setCurrentPage(currentPage - 10);
setMaxPageLimit(maxPageLimit - pageNumberLimit);
setMinPageLimit(minPageLimit - pageNumberLimit);
};

const resetFilters = () => {
  setNameFilter("");
  setCodeNameFilter("");
  setProductCollectionFilter("");
  setStatusFilter("");
  setVerticalSegmentFilter("");
  setEmbeddedOptionsFilter("");
  setHyperThreadingFilter(false);
  setVirtualizationTechFilter(false);
};

const handleRowSelection = (key) => {
  const currentIndex = selectedRows.indexOf(key);
  const newSelectedRows = [...selectedRows];

  if (currentIndex === -1) {
    if (newSelectedRows.length < 2) {
      newSelectedRows.push(key);
    }
  } else {
    newSelectedRows.splice(currentIndex, 1);
  }

  setSelectedRows(newSelectedRows);
};

const handleCompareClick = () => {
  if (selectedRows.length !== 2) {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); 
    return;
  }
  setShowComparison(true); 
};

const Toast = ({ show, message }) => {
if (!show) return null;
return (
  <div className="toast">{message}</div>
);
};

const filteredData = data
.filter(([_, product]) => product.name.toLowerCase().includes(nameFilter.toLowerCase()))
.filter(([_, product]) => product.Essentials?.['Code Name']?.toLowerCase().includes(codeNameFilter.toLowerCase()))
.filter(([_, product]) => !productCollectionFilter || product.Essentials?.['Product Collection'] === productCollectionFilter)
.filter(([_, product]) => !statusFilter || product.Essentials?.Status === statusFilter)
.filter(([_, product]) => !verticalSegmentFilter || product.Essentials?.['Vertical Segment'] === verticalSegmentFilter)
.filter(([_, product]) => !embeddedOptionsFilter || product['Supplemental Information']?.['Embedded Options Available'] === embeddedOptionsFilter)
.filter(([_, product]) => !hyperThreadingFilter || product['Advanced Technologies']?.['Intel Hyper-Threading Technology'] === 'Yes')
.filter(([_, product]) => !virtualizationTechFilter || product['Advanced Technologies']?.['Intel Virtualization Technology (VT-x)'] === 'Yes');

const pageCount = Math.ceil(filteredData.length / itemsPerPage);
const lastItemIndex = currentPage * itemsPerPage;
const firstItemIndex = lastItemIndex - itemsPerPage;
const currentItems = filteredData.slice(firstItemIndex, lastItemIndex);
const paginate = (pageNumber) => setCurrentPage(pageNumber);

const toggleRowExpansion = (id) => {
  if (expandedRow === id) {
    setExpandedRow(null); 
  } else {
    setExpandedRow(id); 
  }
};

const resetComparison = () => {
  setSelectedRows([]);
  setShowComparison(false);
};


const handleSearchByName = () => {
  const result = data.filter(([_, product]) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

const renderDetails = (product) => {
  return (
    <div className="detail-view">
      {Object.entries(product).map(([category, details]) => (
        <div key={category} className="detail-section">
          <h3>{category}</h3>
          {typeof details === 'object' ? (
            <ul>
              {Object.entries(details).map(([key, value]) => (
                <li key={key}>{`${key}: ${value}`}</li>
              ))}
            </ul>
          ) : (
            <p>{details}</p>
          )}
        </div>
      ))}
    </div>
  );
};

return (
  <div className="table-container">
  <div className="controls-container">
    <button className="toggle-filters-btn" onClick={() => setShowFilters(!showFilters)}>
      {showFilters ? "Hide Filters" : "Show Filters"}
    </button>
    <button className="btn compare-selected-btn" onClick={handleCompareClick} disabled={selectedRows.length !== 2} className="compare-selected-btn">
      Compare Selected
    </button>
    <button   className="btn export-csv-btn"onClick={exportData} className="export-csv-btn">
      Export to CSV
    </button>
  </div>
    <div className="filter-search">
      <input
        className="search-input"
        type="text"
        placeholder="Search by Product Name..."
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
      />
      <button onClick={handleSearchByName}>Search</button>
    </div>
{showComparison && (
<Modal show={showComparison} onClose={() => setShowComparison(false)}>
  <ProductComparison 
    product1={data.find(([key]) => key === selectedRows[0])[1]}
    product2={data.find(([key]) => key === selectedRows[1])[1]}
  />
</Modal>
)}
  {showComparison && (
<button onClick={resetComparison}>Reset Comparison</button>
)}
{showFilters && (
<div className="filter-panel">
  <input
    type="text"
    placeholder="Name..."
    value={nameFilter}
    onChange={(e) => setNameFilter(e.target.value)}
    className="filter-input"
  />
  <input
    type="text"
    placeholder="Code Name..."
    value={codeNameFilter}
    onChange={(e) => setCodeNameFilter(e.target.value)}
    className="filter-input"
  />
  <select value={productCollectionFilter} onChange={(e) => setProductCollectionFilter(e.target.value)} className="filter-select">
    <option value="">Collection</option>
    <option value="Legacy Intel Xeon Processors">Legacy Intel Xeon Processors</option>
    {/* Add other options dynamically or statically */}
  </select>
  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
    <option value="">Status</option>
    <option value="Launched">Launched</option>
    <option value="Discontinued">Discontinued</option>
    {/* Add other options dynamically or statically */}
  </select>
  <div className="filter-checkbox">
    <input
      type="checkbox"
      checked={hyperThreadingFilter}
      onChange={(e) => setHyperThreadingFilter(e.target.checked)}
    /> Hyper-Threading
  </div>
  <div className="filter-checkbox">
    <input
      type="checkbox"
      checked={virtualizationTechFilter}
      onChange={(e) => setVirtualizationTechFilter(e.target.checked)}
    /> VT-x
  </div>
  <button onClick={resetFilters} className="filter-reset-btn">Reset</button>
</div>
)}

<div className="comparison-controls">
  </div>
    <h2>Product Data</h2>
    <table>
      <thead>
        <tr>
          <th> </th>
          <th>Name</th>
          <th>Product Collection</th>
          <th>Status</th>
          <th>Lithography</th>
          <th> Frequency</th>
          <th>Cache</th>
          <th> </th> {/* New column for expand/collapse button */}
          <th> </th>
        </tr>
      </thead>
      <tbody>
        {currentItems.map(([key, product]) => (
          <>
            <tr key={key} 
      className={selectedRows.includes(key) ? "selected" : ""} >
        <td>
      <input
        type="checkbox"
        checked={selectedRows.includes(key)}
        onChange={() => handleRowSelection(key)}
      />
    </td>
        <td>{isEditing && editingRowId === key ? (
        <input
          type="text"
          className="edit-input-full-width"
          value={tempData[key]?.name || product.name}
          onChange={(e) => handleEditChange(key, 'name', e.target.value)}
        />
      ) : (
        product.name
      )}</td>
              <td>{product.Essentials?.['Product Collection'] ?? 'N/A'}</td>
              <td>{product.Essentials?.Status ?? 'N/A'}</td>
              <td>{product.Essentials?.Lithography ?? 'N/A'}</td>
              <td>{product.Performance?.['Processor Base Frequency'] ?? 'N/A'}</td>
              <td>{product.Performance?.Cache ?? 'N/A'}</td>
              <td>
              {isEditing && editingRowId === key ? (
        <button className="save-btn" onClick={() => saveEdits(key)}>Save</button>
      ) : (
        <button className="edit-btn" onClick={() => editRow(key, product)}>Edit</button>
      )}
            </td>  
              <td>
              <button onClick={() => toggleRowExpansion(key)} className="expand-btn">
              {expandedRow === key ? 'Collapse' : 'Expand'}
            </button> 
              </td>
            </tr>
            {expandedRow === key && (
              <tr>
                <td colSpan="9">
                  {renderDetails(product)}
                </td>
              </tr>
            )}
          </>
        ))}
      </tbody>
    </table>
<div className="pagination-controls">
<button className="pagination-btn"  onClick={handlePrevBtn} disabled={currentPage === 1}>
  Prev
</button>
{currentPage > 1 && (
  <button className="pagination-jump-btn" onClick={handleJumpBack}>{"<<"}</button>
)}
{[...Array(pageCount).keys()].map((number) => {
  if (number + 1 < maxPageLimit + 1 && number + 1 > minPageLimit) {
    return (
      <button
        key={number + 1}
        onClick={() => paginate(number + 1)}
        className={currentPage === number + 1 ? "active" : null}
      >
        {number + 1}
      </button>
    );
  } else {
    return null;
  }
})}
{pageCount > maxPageLimit && (
  <button className="pagination-jump-btn" onClick={handleJumpForward}>{">>"}</button>
)}
<button
  className="pagination-btn"
  onClick={handleNextBtn}
  disabled={currentPage === pageCount}
>
  Next
</button>
</div>

  </div>
);
};

export default Table;
