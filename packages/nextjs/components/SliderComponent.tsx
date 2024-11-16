import React from "react";

interface SliderComponentProps {
  value: number;
  onChange: (value: number) => void;
}

const SliderComponent: React.FC<SliderComponentProps> = ({ value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
  };

  return (
    <div className="flex flex-col items-center">
      {/* Valor seleccionado */}
      <div className="mb-3 text-2xl">
        Unidades seleccionadas: <span className="font-bold text-blue-400">{value}</span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min="1"
        max="100"
        value={value}
        onChange={handleChange}
        className="w-full max-w-md accent-blue-500"
      />
    </div>
  );
};

export default SliderComponent;
