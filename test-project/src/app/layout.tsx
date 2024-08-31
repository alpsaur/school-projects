import type { Metadata } from "next";
import "@/app/globals.css";
import Navigation from "@/components/Navigation/NavBar";
import { Amplify } from "aws-amplify";
import config from "@/amplifyconfiguration.json";
import { headers } from "next/headers";
Amplify.configure(config, { ssr: true });

export const metadata: Metadata = {
  title: "IBIS",
  description: "IBIS - A Built Environment Intelligence System",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerLists = headers();
  const ownerIdValue: string = headerLists.get("X-IBIS-ID") ?? "";
  console.log("ownerIdValue: ", ownerIdValue);

  return (
    <html lang="en">
      <body>
        <div className="rootlayout flex flex-col h-screen">
          <div className="navbar w-full h-16 fixed top-0 left-0 z-10">
            <Navigation ownerId={ownerIdValue} />
          </div>
          <div className="grow w-full overflow-auto mt-16 bg-indigo-200">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
