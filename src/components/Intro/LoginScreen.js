import React, { useState } from "react";
import "../../styles/Intro/LoginScreen.css";

function LoginScreen({ toggleClicked }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Any username and password works - just proceed to desktop
    toggleClicked(true);
  };

  return (
    <div className="login-screen">
      <div className="login-background">
        <div className="login-container">
          {/* Windows XP Login Box */}
          <div className="login-box">
            <div className="login-header">
              <div className="login-title">
                <h1>Welcome</h1>
                <p>Portfolio System 1.0</p>
              </div>
            </div>

            <div className="login-content">
              <div className="user-selection">
                <h2>User Sign-in</h2>
                <form onSubmit={handleLogin}>
                  <div className="input-group">
                    <label htmlFor="username">User Name:</label>
                    <input
                      id="username"
                      type="text"
                      className="login-input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Sohan"
                      autoFocus
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="password">Password:</label>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="login-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                    />
                  </div>

                  <div className="checkbox-group">
                    <input
                      id="show-password"
                      type="checkbox"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    <label htmlFor="show-password">Show password</label>
                  </div>

                  <div className="button-group">
                    <button type="submit" className="btn btn-primary">
                      OK
                    </button>
                    <button type="button" className="btn btn-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="login-footer">
              <div className="footer-text">
                <small>© 2025 Portfolio. All rights reserved.</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
