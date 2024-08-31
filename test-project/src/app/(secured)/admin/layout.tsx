import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import AdminSideBarComponent from "@/components/Navigation/AdminSideBarComponent";

const inter = Inter({ subsets: ["latin"] });

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="projectlayout h-full flex">
      <div className="sidebar w-40 fixed h-full">
        <AdminSideBarComponent />
      </div>
      <div className="projectchildren flex-grow pl-40 overflow-auto">
        {children}
      </div>
    </div>
  );
}
