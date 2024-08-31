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

export default function Selection({
  params,
}: {
  params: { projectId: string };
}) {
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
      label: "Dashboard",
      path: "",
      shortcut: "D",
    },
    {
      label: "Inspection",
      path: "/inspections",
      shortcut: "I",
    },
    {
      label: "Files",
      path: "/files",
      shortcut: "F",
    },
  ];

  return (
    <ul className="md:flex gap-x-6 text-white flex-col ">
      {selectionEntities.map((entity) => {
        const uid = uuidv4();
        let isActive: boolean = false;
        if (entity.path === "") {
          isActive = pathname === `/projects/${params.projectId}`;
        } else {
          isActive = pathname.startsWith(
            `/projects/${params.projectId}${entity.path}`
          );
        }
        const labelName = isSmallScreen ? entity.shortcut : entity.label;
        return (
          <li key={uid}>
            <Link
              href={`/projects/${params.projectId}${entity.path}`}
              className={`flex h-[48px] grow items-center justify-center gap-2 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 ${
                isActive ? "bg-sky-100 text-blue-600" : ""
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
