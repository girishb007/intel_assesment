import React, { useState, useEffect } from 'react';
import jsonData from '../components/API_DATA.json'; // Adjust the path as necessary

const Table = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Change as per your preferences

  useEffect(() => {
    console.log(jsonData); // Log to see the structure
    const formattedData = Object.entries(jsonData);
    setData(formattedData);
  }, []);
  
   // Calculate total number of pages
   const pageCount = Math.ceil(data.length / itemsPerPage);
   // Calculate the index of the last item on the current page
   const lastItemIndex = currentPage * itemsPerPage;
   // Calculate the index of the first item on the current page
   const firstItemIndex = lastItemIndex - itemsPerPage;
   // Slice the data array to get the items for the current page
   const currentItems = data.slice(firstItemIndex, lastItemIndex);
 
   // Function to change page
   const paginate = (pageNumber) => setCurrentPage(pageNumber);
 

  return (
    <div>
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
          </tr>
        </thead>
        <tbody>
  {currentItems.map(([key, product]) => (
    <tr key={key}>
      <td>{product.name}</td>
      <td>{product.Essentials?.['Product Collection'] ?? 'N/A'}</td>
      <td>{product.Essentials?.Status ?? 'N/A'}</td>
      <td>{product.Essentials?.Lithography ?? 'N/A'}</td>
      <td>{product.Performance?.['Processor Base Frequency'] ?? 'N/A'}</td>
      <td>{product.Performance?.Cache ?? 'N/A'}</td>
    </tr>
  ))}
</tbody>
      </table>
      <div>
        {[...Array(pageCount)].map((_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Table;
