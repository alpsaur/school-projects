interface IbisTableCellProps {
  children: React.ReactNode;
  isBold?: boolean; // Optional prop to control font-bold
  onClick?: () => void;
  className?: string;
}

export default function IbisTableCell({
  children,
  isBold = false, // Default to false if isBold prop is not provided
  onClick,
  className = "",
}: IbisTableCellProps) {
  return (
    <div
      className={`flex-1 p-2 text-center ${
        isBold ? "font-bold text-white" : "text-black"
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
