import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Parse numerical values explicitly
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      if (!response.ok) throw new Error("Failed to create product");
      
      alert("Product created successfully!");
      navigate("/admin/dashboard");
      
    } catch (err) {
      alert("Error: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="admin-container form-container">
      <h2>Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Product Name</label>
          <input type="text" name="name" required value={formData.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Price ($)</label>
          <input type="number" step="0.01" name="price" required value={formData.price} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} />
        </div>
        
        <div className="form-group">
          <label>Image URL</label>
          <input type="url" name="image" placeholder="https://..." value={formData.image} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" rows="4" value={formData.description} onChange={handleChange}></textarea>
        </div>

        <button type="submit" disabled={loading} className="admin-submit-btn">
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
