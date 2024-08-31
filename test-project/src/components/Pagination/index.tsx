"use client";

import { generatePagination } from "@/components/Pagination/generatePagination";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const allPages = generatePagination(currentPage, totalPages);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <>
      <div className="inline-flex">
        <PaginationArrow
          direction="left"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />

        <div className="flex -space-x-px">
          {allPages.map((page, index) => {
            let position: "first" | "last" | "single" | "middle" | undefined;

            if (index === 0) position = "first";
            if (index === allPages.length - 1) position = "last";
            if (allPages.length === 1) position = "single";
            if (page === "...") position = "middle";

            return (
              <PaginationNumber
                key={page}
                href={createPageURL(page)}
                page={page}
                position={position}
                isActive={currentPage === page}
              />
            );
          })}
        </div>

        <PaginationArrow
          direction="right"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </div>
    </>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: "first" | "last" | "middle" | "single";
  isActive: boolean;
}) {
  const className = `flex h-10 w-10 items-center justify-center text-sm font-bold ${
    position === "first" || position === "single" ? "rounded-l-md" : ""
  } ${position === "last" || position === "single" ? "rounded-r-md" : ""} ${
    isActive
      ? "z-10 bg-blue-600 border-blue-600 text-white pointer-events-none"
      : ""
  } ${
    !isActive && position !== "middle"
      ? "bg-indigo-100 hover:bg-indigo-300 hover:cursor-pointer hover:text-white"
      : ""
  } ${position === "middle" ? "text-gray-300" : ""}`;
  const router = useRouter();

  const handleClick = (e: any) => {
    e.preventDefault();
    if (!isActive && position !== "middle") {
      router.push(href);
    }
  };

  return isActive || position === "middle" ? (
    <div className={className}>{page}</div>
  ) : (
    <div onClick={handleClick} className={className}>
      {page}
    </div>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: "left" | "right";
  isDisabled?: boolean;
}) {
  const className = `flex h-10 w-10 p-2 items-center justify-center rounded-md ${
    isDisabled
      ? "pointer-events-none bg-gray-400"
      : "hover:bg-indigo-400 hover:cursor-pointer bg-indigo-100"
  } ${
    direction === "left"
      ? "mr-1 md:mr-2"
      : direction === "right"
      ? "ml-1 md:ml-2"
      : ""
  }`;

  const leftIcon = (
    <svg
      width="40px"
      height="40px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z"
        fill="white"
      />
    </svg>
  );

  const rightIcon = (
    <svg
      width="40px"
      height="40px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.82054 20.7313C8.21107 21.1218 8.84423 21.1218 9.23476 20.7313L15.8792 14.0868C17.0505 12.9155 17.0508 11.0167 15.88 9.84497L9.3097 3.26958C8.91918 2.87905 8.28601 2.87905 7.89549 3.26958C7.50497 3.6601 7.50497 4.29327 7.89549 4.68379L14.4675 11.2558C14.8581 11.6464 14.8581 12.2795 14.4675 12.67L7.82054 19.317C7.43002 19.7076 7.43002 20.3407 7.82054 20.7313Z"
        fill="white"
      />
    </svg>
  );

  const icon = direction === "left" ? leftIcon : rightIcon;
  const router = useRouter();

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push(href);
  };
  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <div onClick={handleClick} className={className}>
      {icon}
    </div>
  );
}
