"use client";

import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { usePathname } from "next/navigation";

interface settingEntity {
  label: string;
  path: string;
  prefix: string;
}

export default function NavBarSelection() {
  const pathname = usePathname();
  // console.log("pathname in select for navbar", pathname);

  const entities: settingEntity[] = [
    {
      label: "Projects",
      path: "/projects",
      prefix: "/projects",
    },
    {
      label: "Probes",
      path: "/probes",
      prefix: "/probe",
    },
  ];

  return (
    <ul className="hidden md:flex gap-x-6 text-white ">
      {entities.map((entity) => {
        const uid = uuidv4();
        return (
          <li key={uid}>
            <Link
              href={entity.path}
              className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 ${
                pathname.startsWith(entity.prefix)
                  ? "bg-sky-100 text-blue-600"
                  : ""
              }`}
            >
              <p
                onClick={() => {
                  console.log(`Clicked on ${entity.label}`);
                }}
              >
                {entity.label}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
