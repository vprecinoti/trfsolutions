import SuperAdminNotifications from "@/components/SuperAdminNotifications";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SuperAdminNotifications />
      {children}
    </>
  );
}