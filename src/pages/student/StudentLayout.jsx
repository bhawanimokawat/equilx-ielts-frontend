
import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function StudentLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#F8F7FA] text-[#252333] transition-colors duration-300 dark:bg-[#171419] dark:text-[#FFF8FA]">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main application area */}
      <div className="flex min-h-screen min-w-0 flex-col bg-[#F8F7FA] transition-colors duration-300 dark:bg-[#171419] lg:ml-[280px]">
        <Navbar onMenuClick={openSidebar} />

        <main className="min-w-0 flex-1 bg-[#F8F7FA] p-4 transition-colors duration-300 dark:bg-[#171419] sm:p-6 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
