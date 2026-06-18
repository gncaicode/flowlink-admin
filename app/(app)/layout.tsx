import { LayoutShell } from "@/components/layout/LayoutShell";
import { SessionGuard } from "@/components/layout/SessionGuard";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionGuard>
      <LayoutShell>{children}</LayoutShell>
    </SessionGuard>
  );
}
