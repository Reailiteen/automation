export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-6 overflow-x-hidden">
      {children}
    </div>
  );
}
