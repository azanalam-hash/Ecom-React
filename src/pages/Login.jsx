import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await login(email, password);

    if (result.success) {
      navigate("/"); // Redirect to home immediately on success
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          
          <div className="auth-input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>

      </div>
    </div>
  );
}
