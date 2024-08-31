import { Inter } from "next/font/google";
import ProjectSideBarComponent from "@/components/Navigation/ProjectSideBarComponent/index";
import { Amplify } from "aws-amplify";
import awsconfig from "@/amplifyconfiguration.json";

Amplify.configure(awsconfig, { ssr: true });

type Tag = {
  key: string;
  value: string;
};
const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  return (
    <div className="flex h-full">
      <div className="sidebar h-[calc(100vh-4rem)]">
        <ProjectSideBarComponent params={params} />
      </div>
      <div className="grow overflow-auto">{children}</div>
    </div>
  );
}
