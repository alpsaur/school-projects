export default function IbisTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full border border-gray-500 rounded-lg overflow-hidden bg-white">
      {children}
    </div>
  );
}
