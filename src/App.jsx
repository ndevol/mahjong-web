import { useState } from "react";

function App() {
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("Enter a number between 1 and 100");
  const [loading, setLoading] = useState(false);

  const handleGuess = async () => {
    if (!guess) return;
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: Number(guess) }),
      });

      if (!response.ok) {
        setMessage(`Error: ${response.status}`);
      } else {
        const data = await response.json();
        setMessage(data.result);
      }
    } catch (err) {
      setMessage("Could not reach backend.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>Guess the Number Game</h2>
      <input
        type="number"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Enter a guess"
      />
      <button onClick={handleGuess} disabled={loading}>
        {loading ? "Checking..." : "Submit Guess"}
      </button>
      <div style={{ marginTop: "1rem", fontSize: "1.2rem" }}>{message}</div>
    </div>
  );
}

export default App;
