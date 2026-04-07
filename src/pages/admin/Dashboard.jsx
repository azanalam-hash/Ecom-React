import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Admin.css";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      
      // Remove from state without refetching
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <Link to="/admin/add-product" className="admin-btn">Add New Product</Link>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="5" style={{textAlign:"center"}}>No products found. Start adding some!</td></tr>
            ) : (
              products.map(product => (
                <tr key={product._id}>
                  <td>
                     <img src={product.image || "https://via.placeholder.com/50"} alt={product.name} width="50" height="50" style={{objectFit:"cover", borderRadius: "4px"}}/>
                  </td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>
                    <button onClick={() => handleDelete(product._id)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
