// ProductComparison.js
const ProductComparison = ({ product1, product2 }) => {
    if (!product1 || !product2) return null;
  
    const product1Entries = Object.entries(product1);
    const product2Entries = Object.entries(product2);
  
    return (
      <div className="product-comparison">
        <h2>Comparison: {product1.name} VS {product2.name}</h2>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>{product1.name}</th>
              <th>{product2.name}</th>
            </tr>
          </thead>
          <tbody>
            {product1Entries.map(([key, value], index) => {
              // Assuming the structure of both products is identical
              const product2Value = product2Entries[index][1];
  
              return (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{typeof value === 'object' ? JSON.stringify(value) : value}</td>
                  <td>{typeof product2Value === 'object' ? JSON.stringify(product2Value) : product2Value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
  export default ProductComparison;
