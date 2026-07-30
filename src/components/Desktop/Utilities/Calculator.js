import React, { useState } from "react";
import "../../../styles/Desktop/Calculator.css";

const buttonLayout = [
  ["C", "CE", "%", "/"],
  ["7", "8", "9", "x"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["+/-", "0", ".", "="],
];

function compute(a, b, op) {
  const x = parseFloat(a);
  const y = parseFloat(b);
  switch (op) {
    case "+":
      return x + y;
    case "-":
      return x - y;
    case "x":
      return x * y;
    case "/":
      return y === 0 ? NaN : x / y;
    default:
      return y;
  }
}

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForNext, setWaitingForNext] = useState(false);

  const formatResult = (value) => {
    if (Number.isNaN(value)) return "Error";
    const rounded = Math.round((value + Number.EPSILON) * 1e10) / 1e10;
    return String(rounded).slice(0, 16);
  };

  const handleDigit = (digit) => {
    if (waitingForNext || display === "0") {
      setDisplay(digit === "." ? "0." : digit);
      setWaitingForNext(false);
    } else if (digit === "." && display.includes(".")) {
      return;
    } else {
      setDisplay(display + digit);
    }
  };

  const handleOperator = (op) => {
    if (stored !== null && operator && !waitingForNext) {
      const result = compute(stored, display, operator);
      setDisplay(formatResult(result));
      setStored(formatResult(result));
    } else {
      setStored(display);
    }
    setOperator(op);
    setWaitingForNext(true);
  };

  const handleEquals = () => {
    if (operator === null || stored === null) return;
    const result = compute(stored, display, operator);
    setDisplay(formatResult(result));
    setStored(null);
    setOperator(null);
    setWaitingForNext(true);
  };

  const handleClear = () => {
    setDisplay("0");
    setStored(null);
    setOperator(null);
    setWaitingForNext(false);
  };

  const handleClearEntry = () => {
    setDisplay("0");
  };

  const handleSign = () => {
    if (display === "0") return;
    setDisplay(display.startsWith("-") ? display.slice(1) : `-${display}`);
  };

  const handlePercent = () => {
    setDisplay(formatResult(parseFloat(display) / 100));
  };

  const handlePress = (key) => {
    if (key === "C") return handleClear();
    if (key === "CE") return handleClearEntry();
    if (key === "+/-") return handleSign();
    if (key === "%") return handlePercent();
    if (key === "=") return handleEquals();
    if (["+", "-", "x", "/"].includes(key)) return handleOperator(key);
    return handleDigit(key);
  };

  return (
    <div className="calculator">
      <div className="calc-display-wrap win95-sunken">
        <div className="calc-op-indicator">{operator || ""}</div>
        <div className="calc-display">{display}</div>
      </div>
      <div className="calc-grid">
        {buttonLayout.flat().map((key) => (
          <button
            key={key}
            className={`calc-btn win95-raised ${"+-x/=".includes(key) ? "calc-btn-op" : ""} ${
              key === "=" ? "calc-btn-equals" : ""
            }`}
            onClick={() => handlePress(key)}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Calculator;
