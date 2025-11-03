'use client'

import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        {/* Top Bar */}
        <Topbar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-white w-full">
          {children}
        </main>
      </div>
    </div>
  )
}

