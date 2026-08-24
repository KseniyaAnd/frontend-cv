import Sidebar from '@/lib/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />

      <main className="min-h-screen pl-[264px]">{children}</main>
    </div>
  );
}
