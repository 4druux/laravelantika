import React from "react";

const Tittle = ({
  text,
  className = "",
  textSize = "text-3xl lg:text-5xl",
}) => {
  return (
    <div className={className}>
      <div className="inline-flex items-center gap-2">
        <h2
          className={`font-semibold ${textSize} bg-clip-text text-transparent bg-gradient-to-br from-gray-200 via-gray-500 to-gray-900 tracking-wide`}
        >
          {text}
        </h2>
      </div>
    </div>
  );
};

export default Tittle;
