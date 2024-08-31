"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface selectionEntity {
  label: string;
  path: string;
  shortcut: string;
}

export default function Selection() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectionEntities: selectionEntity[] = [
    {
      label: "Probes",
      path: "probes",
      shortcut: "P",
    },
    {
      label: "Probe Groups",
      path: "probegroups",
      shortcut: "PG",
    },
  ];

  return (
    <ul className="md:flex gap-x-6 text-white flex-col ">
      {selectionEntities.map((entity) => {
        const uid = uuidv4();
        const labelName = isSmallScreen ? entity.shortcut : entity.label;
        return (
          <li key={uid}>
            <Link
              href={`/${entity.path}`}
              className={`flex h-[48px] grow items-center justify-center gap-2 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 ${
                pathname.startsWith(`/${entity.path}`)
                  ? "bg-sky-100 text-blue-600"
                  : ""
              }`}
            >
              <p>{labelName}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
