import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import ProbeSideBarComponent from "@/components/Navigation/ProbeSideBarComponent/index";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="projectlayout h-full flex">
      <div className="sidebar h-[calc(100vh-4rem)]">
        <ProbeSideBarComponent />
      </div>
      <div className="projectchildren grow overflow-auto">{children}</div>
    </div>
  );
}
