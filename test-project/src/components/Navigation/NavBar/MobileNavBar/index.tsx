"use client";
import Link from "next/link";

const MobileNavbar = ({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}): JSX.Element => {
  return (
    <>
      <div
        className="sidebar-container fixed flex-col w-full overflow-hidden justify-center bg-gradient-to-r from-teal-950 to-indigo-900 left-0 z-10"
        style={{
          opacity: `${isOpen ? "1" : "0"}`,
          top: ` ${isOpen ? "0" : "-100%"}`,
        }}
      >
        <div className="h-16 shadow-xl py-2 w-full flex flex-row-reverse px-5">
          <button className="p-2 flex-none" onClick={toggle}>
            {/* Close icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="white"
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
              />
            </svg>
          </button>
          <div className="flex flex-1 text-white font-bold items-center text-2xl px-5">
            <span>Menu</span>
          </div>
        </div>

        <div className="py-2 w-full">
          <ul className="sidebar-nav text-center leading-relaxed text-2xl text-white">
            <li className="hover:bg-indigo-500/50">
              <Link href="/projects" onClick={toggle}>
                <p>Projects</p>
              </Link>
            </li>
            <li className="hover:bg-indigo-500/50">
              <Link href="/probes" onClick={toggle}>
                <p>Probes</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;
