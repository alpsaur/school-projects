import React from "react";

interface IbisTableRowProps {
  children: React.ReactNode;
  isBlueBackground?: boolean; // Optional prop to control background color
  className?: string;
}

export default function IbisTableRow({
  children,
  isBlueBackground = true, // Default to blue background if isBlueBackground prop is not provided,
  className = "",
}: IbisTableRowProps) {
  const backgroundColorClass = isBlueBackground ? "bg-gradient-to-r from-slate-800 to-indigo-600 pointer-events-none" : "bg-violet-50";
  const hoverClass = !isBlueBackground ? "hover:bg-violet-100 hover:cursor-pointer" : "";

  return <div className={`flex w-full ${backgroundColorClass} ${hoverClass} ${className}`}>{children}</div>;
}
