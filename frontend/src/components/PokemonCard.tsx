import { useState } from "react";

interface PokemonCardProps {
  name: string;
  type: string[];
  onCatch: () => void;
  onRelease: () => void;
}

function PokemonCard({ name, type, onCatch, onRelease }: PokemonCardProps) {
  const [isCaught, setIsCaught] = useState(false);

  const handleClick = () => {
    if (isCaught) {
      setIsCaught(false);
      onRelease();
    } else {
      setIsCaught(true);
      onCatch();
    }
  };

  return (
    <div style={cardStyle}>
      <h2>{name}</h2>

      <p>Type: {[...type].join(", ")}</p>

      <p>Status: {isCaught ? "✅ Caught" : "❌ Not Caught"}</p>

      <button onClick={handleClick} style={buttonStyle}>
        {isCaught ? "Release" : "Catch"}
      </button>
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "16px",
  margin: "10px 0",
  backgroundColor: "white",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  maxWidth: "300px",
};

const buttonStyle = {
  padding: "8px 16px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "bold",
};

export default PokemonCard;
