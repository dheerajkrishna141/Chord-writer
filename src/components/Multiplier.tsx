import React from "react";

interface MultiplierProps {
  setMultiplier: (value: string) => void;
}

const Multiplier = ({ setMultiplier }: MultiplierProps) => {
  return (
    <div>
      <input
        onChange={(e) => setMultiplier(e.currentTarget.value)}
        type="number"
      ></input>
    </div>
  );
};

export default Multiplier;
