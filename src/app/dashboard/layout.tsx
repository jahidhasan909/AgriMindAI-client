
import DashboardSidebar from "@/components/DashboardComponents/Shared/Sidebar";
import React from "react";



interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="grow p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}