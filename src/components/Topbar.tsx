'use client'

import { Moon, Bell, User, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function Topbar() {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 h-16">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-purple-500 bg-clip-text text-transparent">
            ShipUAE
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Moon className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                <div className="border-t border-gray-200 my-1"></div>
                <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Sign Out</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

