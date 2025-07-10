import React from "react";

const Description = ({
  text,
  className = "",
  textSize = "text-sm lg:text-lg",
}) => {
  return (
    <div className={className}>
      <p className={`${textSize} text-gray-500`}>{text}</p>
    </div>
  );
};

export default Description;
