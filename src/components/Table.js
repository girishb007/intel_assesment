import React, { useState, useEffect } from 'react';
import jsonData from '../components/API_DATA.json'; // Adjust the path as necessary
import '../components/global.css';
import ProductComparison from './ProductComparison'; // Adjust path as necessary


const Table = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterQuery, setFilterQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState(null); // Track the ID of an expanded row for details
  const [nameFilter, setNameFilter] = useState("");
  const [codeNameFilter, setCodeNameFilter] = useState("");
  const [productCollectionFilter, setProductCollectionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [verticalSegmentFilter, setVerticalSegmentFilter] = useState("");
  const [embeddedOptionsFilter, setEmbeddedOptionsFilter] = useState("");
  const [hyperThreadingFilter, setHyperThreadingFilter] = useState(false);
  const [virtualizationTechFilter, setVirtualizationTechFilter] = useState(false);  
  const [showFilters, setShowFilters] = useState(false); // Add this to your component's state
  const [searchQuery, setSearchQuery] = useState("");
  const maxPageNumberLimit = 10;
  const minPageNumberLimit = 0;
  const [pageNumberLimit, setPageNumberLimit] = useState(maxPageNumberLimit); // Maximum number of page numbers to display
  const [maxPageLimit, setMaxPageLimit] = useState(10); // Adjust as per your initial display limit
  const [minPageLimit, setMinPageLimit] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
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
  
  


  useEffect(() => {
    console.log(jsonData); // Log to see the structure
    const formattedData = Object.entries(jsonData);
    setData(formattedData);
  }, []);

  useEffect(() => {
    const productCollections = new Set(data.map(([_, product]) => product.Essentials?.['Product Collection']).filter(Boolean));
    // setState for productCollections options
    // Remember to convert the Set to an array if you're storing it in state
  }, [data]); // Depends on your data fetching logic; adjust as needed
    

  const ProductComparison = ({ product1, product2 }) => {
    // Combine all keys from both products for a full comparison, eliminate duplicates
    const combinedKeys = Array.from(new Set([...Object.keys(product1), ...Object.keys(product2)]));
    
    // Function to render comparison rows for all keys
    const renderComparisonRows = (key) => {
      // Handle if the product doesn't have a specific key
      const product1Value = product1[key];
      const product2Value = product2[key];
      
      // Check if the value is an object (like in Essentials) and recursively render its properties
      if (typeof product1Value === 'object' && product1Value !== null && typeof product2Value === 'object' && product2Value !== null) {
        // Further combine keys if the value itself is an object to catch all properties
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
        // Render a simple comparison row if the value is not an object
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
  // Adjust the page limits accordingly
  setMaxPageLimit(maxPageLimit + pageNumberLimit);
  setMinPageLimit(minPageLimit + pageNumberLimit);
};

const handleJumpBack = () => {
  setCurrentPage(currentPage - 10);
  // Adjust the page limits accordingly
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
    // Add any other filter states you need to reset
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
      setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
      return;
    }
    setShowComparison(true); // Show the comparison component
  };
  

// Toast component
const Toast = ({ show, message }) => {
  if (!show) return null;
  return (
    <div className="toast">{message}</div>
  );
};

  /*const filteredData = data.filter(([_, product]) =>
    product.name.toLowerCase().includes(filterQuery.toLowerCase())
  );*/

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
      setExpandedRow(null); // Collapse if the same row is clicked again
    } else {
      setExpandedRow(id); // Expand the new row
    }
  };

  const resetComparison = () => {
    setSelectedRows([]);
    setShowComparison(false);
  };
  

  const handleSearchByName = () => {
    // Assuming `data` is an array of objects and each object has a `name` property.
    const result = data.filter(([_, product]) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // Assuming you have a way to update the view with this filtered result.
    // For example, if you're setting filtered data to state:
    //setFilteredData(result);
  };
  

  // Helper function to render detailed information
  const renderDetails = (product) => {
    return (
      <div>
        {Object.entries(product).map(([category, details]) => (
          <div key={category}>
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
    <button className="toggle-filters-btn" onClick={() => setShowFilters(!showFilters)}>
    {showFilters ? "Hide Filters" : "Show Filters"}
  </button>
    
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
      <div>
      <button className="reset-filters-btn" onClick={resetFilters}>
      Reset Filters
    </button>
      <div className="filter-panel">
  <input
    type="text"
    placeholder="Filter by Code Name..."
    value={codeNameFilter}
    onChange={(e) => setCodeNameFilter(e.target.value)}
  />

  <select value={productCollectionFilter} onChange={(e) => setProductCollectionFilter(e.target.value)}>
    <option value="">All Product Collections</option>
    <option value="Legacy Intel Xeon Processors">Legacy Intel Xeon Processors</option>
    {/* Add other options dynamically or statically */}
  </select>

  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
    <option value="">All Statuses</option>
    <option value="Launched">Launched</option>
    <option value="Discontinued">Discontinued</option>
    {/* Add other options dynamically or statically */}
  </select>

  <select value={verticalSegmentFilter} onChange={(e) => setVerticalSegmentFilter(e.target.value)}>
    <option value="">All Segments</option>
    <option value="Server">Server</option>
    <option value="Desktop">Desktop</option>
    {/* Add other options dynamically or statically */}
  </select>

  <select value={embeddedOptionsFilter} onChange={(e) => setEmbeddedOptionsFilter(e.target.value)}>
    <option value="">All Options</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>

  <label>
    <input
      type="checkbox"
      checked={hyperThreadingFilter}
      onChange={(e) => setHyperThreadingFilter(e.target.checked)}
    />
    Intel Hyper-Threading Technology
  </label>

  <label>
    <input
      type="checkbox"
      checked={virtualizationTechFilter}
      onChange={(e) => setVirtualizationTechFilter(e.target.checked)}
    />
    Intel Virtualization Technology (VT-x)
  </label>
  </div>
  </div>
    )}

<div className="comparison-controls">
      <button onClick={handleCompareClick} disabled={selectedRows.length !== 2}>Compare Selected</button>
      <Toast show={showToast} message="Please select exactly 2 products for comparison." />
    </div>

      <h2>Product Data</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Product Collection</th>
            <th>Status</th>
            <th>Lithography</th>
            <th>Base Frequency</th>
            <th>Cache</th>
            <th>Expand</th> {/* New column for expand/collapse button */}
          </tr>
        </thead>
        <tbody>
          {currentItems.map(([key, product]) => (
            <>
              <tr key={key} 
        className={selectedRows.includes(key) ? "selected" : ""} 
        onClick={() => handleRowSelection(key)}>
          <td>
        <input
          type="checkbox"
          checked={selectedRows.includes(key)}
          onChange={() => handleRowSelection(key)}
        />
      </td>
                <td>{product.name}</td>
                <td>{product.Essentials?.['Product Collection'] ?? 'N/A'}</td>
                <td>{product.Essentials?.Status ?? 'N/A'}</td>
                <td>{product.Essentials?.Lithography ?? 'N/A'}</td>
                <td>{product.Performance?.['Processor Base Frequency'] ?? 'N/A'}</td>
                <td>{product.Performance?.Cache ?? 'N/A'}</td>
                <td><button onClick={() => toggleRowExpansion(key)}>Expand</button></td>
              </tr>
              {expandedRow === key && (
                <tr>
                  <td colSpan="7">
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
