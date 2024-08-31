"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

interface selectionEntity {
  lable: string;
  path: string;
}

export default function Selection() {
  const pathname = usePathname();

  const selectionEntities: selectionEntity[] = [
    {
      lable: "File Category",
      path: "filecategory",
    },
    {
      lable: "FileGroup Setting",
      path: "filegroupsetting"
    },
  ];

  return (
    <ul className="hidden md:flex gap-x-6 text-white flex-col ">
      {selectionEntities.map((entity) => {
        const uid = uuidv4();
        const isActive = pathname.startsWith(`/admin/${entity.path}`);
        return (
          <li key={uid}>
            <Link
              href={`/admin/${entity.path}`}
              className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 ${isActive ? "bg-sky-100 text-blue-600" : ""}`}
            >
              <p>{entity.lable}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
