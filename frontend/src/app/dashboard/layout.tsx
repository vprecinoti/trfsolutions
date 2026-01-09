"use client";

import dynamic from 'next/dynamic';

// Carregar o componente de notificações apenas no cliente
const SuperAdminNotifications = dynamic(
  () => import("@/components/SuperAdminNotifications"),
  { ssr: false }
);

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