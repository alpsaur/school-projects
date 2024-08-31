export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  return <div className="w-full h-full">{children}</div>;
}
