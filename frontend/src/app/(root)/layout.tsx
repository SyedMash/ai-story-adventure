import React, { type ReactNode } from "react";
import { AppSidebar } from "~/components/AppSidebar";

import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="h-full w-full bg-gradient-to-b from-white to-sky-100">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default layout;
