import { useEffect, useState } from "react";
import LoginScreen from "./components/Intro/LoginScreen";
import Desktop from "./components/Desktop/Desktop";
import MobilePhone from "./components/Mobile/MobilePhone";

import "./styles/App.css";

/**
 * Main App component that renders the initial UI and handles state changes.
 *
 * @returns {JSX.Element} The rendered App component.
 */

function App() {
  // State variables to track the application's state
  const [isFocused, setIsFocused] = useState(true); // Whether the app has focus
  const [isFinalClicked, setIsFinalClicked] = useState(false); // Whether the login has been completed
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobileWidth = window.innerWidth <= 900;
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const mobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      setIsMobileDevice((mobileWidth && coarsePointer) || mobileUA);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  /**
   * Updates the state of 'isFocused' based on the provided action.
   *
   * @param {boolean} action - The action to update the state with.
   */
  const handleFocus = (action) => {
    setIsFocused(action);
  };

  const handleLogin = (action) => {
    setIsFinalClicked(action);
  };

  return (
    // Main container for the app
    <div
      className="App"
      // Event handlers for focus
      onClick={() => setIsFocused(false)}
    >
      {isMobileDevice && <MobilePhone />}

      {!isMobileDevice && !isFinalClicked && (
          <LoginScreen
            toggleClicked={handleLogin} // Handler for login
            />
      )}

      {!isMobileDevice && isFinalClicked && <Desktop/> }
    </div>
  );
}

export default App;
