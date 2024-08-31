import React, {
  CSSProperties,
  useState,
  FC,
  MouseEventHandler,
  ReactNode,
} from "react";

interface IbisAccordianProps {
  title: string;
  children?: ReactNode;
  isAccordianOpenDefault?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export const IbisAccordian: FC<IbisAccordianProps> = ({
  className = "",
  title,
  children,
  isAccordianOpenDefault,
  style,
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState(isAccordianOpenDefault);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`transition rounded-lg bg-indigo-50 hover:bg-indigo-100 ${isOpen ? "bg-indigo-100" : ""
        }  ${className}`}
      style={style}
    >
      <div
        className="accordion-header cursor-pointer transition flex space-x-5 px-5 items-center h-16"
        onClick={toggleAccordion}
        style={{ cursor: "pointer" }}
      >
        {isOpen ? (
          <svg
            className="w-6 h-6 text-gray-800 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 2"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h16"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-gray-800 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        )}
        <h3>{title}</h3>
      </div>
      {isOpen && (
        <div className="accordion-content px-5 py-2 overflow-hidden transition-[max-height] ease-in ">
          {children}
        </div>
      )}
    </div>
  );
};
