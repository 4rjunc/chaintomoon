import React from "react";

interface CollateralButtonProps {
  value: number;
  onClick: () => void;
}

const CollateralButton: React.FC<CollateralButtonProps> = ({ value, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mt-5 px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95 transition-transform duration-200"
    >
      Purchase {value} units of Oxygen
    </button>
  );
};

export default CollateralButton;
