'use client'

import { 
  Home,
  Package,
  Truck,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    workspace: true,
    others: false
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const workspaceItems = [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'My Orders', icon: Package, path: '/orders' },
    { label: 'Carriers', icon: Truck, path: '/carriers' },
    { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  ]

  const othersItems = [
    { label: 'Settings', icon: Settings, path: '/settings' },
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white text-gray-900 border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-purple-500 bg-clip-text text-transparent">
              ShipUAE
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {/* WORKSPACE Section */}
          <div>
            <button
              onClick={() => toggleSection('workspace')}
              className="w-full flex items-center justify-between px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              <span>WORKSPACE</span>
              {expandedSections.workspace ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {expandedSections.workspace && (
              <div className="space-y-1">
                {workspaceItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.path
                  return (
                    <button
                      key={item.label}
                      onClick={() => router.push(item.path)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-sky-50 to-purple-50 text-gray-900 font-medium shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-gray-900' : 'text-gray-600'}`} />
                        <span className={`text-sm ${isActive ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                          {item.label}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* OTHERS Section */}
          <div>
            <button
              onClick={() => toggleSection('others')}
              className="w-full flex items-center justify-between px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              <span>OTHERS</span>
              {expandedSections.others ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {expandedSections.others && (
              <div className="space-y-1">
                {othersItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.path
                  return (
                    <button
                      key={item.label}
                      onClick={() => router.push(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-sky-50 to-purple-50 text-gray-900 font-medium shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-gray-900' : 'text-gray-600'}`} />
                      <span className={`text-sm ${isActive ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">U</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-900">user@email.com</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>
    </aside>
  )
}

